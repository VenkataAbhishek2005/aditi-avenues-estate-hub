const database = require('../shared/database');
const { authorize, logAuditEvent } = require('../shared/auth');
const { success, error, handleCors } = require('../shared/response');
const AWS = require('aws-sdk');

const ses = new AWS.SES({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    if (event.httpMethod === 'OPTIONS') {
        return handleCors();
    }

    try {
        const method = event.httpMethod;
        const pathParams = event.pathParameters || {};

        switch (method) {
            case 'GET':
                if (pathParams.id) {
                    return await getEnquiry(pathParams.id, event);
                } else {
                    return await getEnquiries(event.queryStringParameters || {}, event);
                }
            case 'POST':
                return await createEnquiry(event);
            case 'PUT':
                return await updateEnquiry(event, pathParams.id);
            case 'DELETE':
                return await deleteEnquiry(event, pathParams.id);
            default:
                return error('Method not allowed', 405);
        }
    } catch (err) {
        console.error('Error:', err);
        return error(err.message, 500);
    }
};

async function getEnquiries(queryParams, event) {
    try {
        await authorize(event, ['super_admin', 'admin', 'editor', 'viewer']);

        let sql = `
            SELECT e.*, p.name as project_name, a.name as assigned_to_name
            FROM contact_enquiries e 
            LEFT JOIN projects p ON e.project_id = p.id 
            LEFT JOIN admin_users a ON e.assigned_to = a.id
            WHERE 1=1
        `;
        const params = [];

        if (queryParams.status) {
            sql += ' AND e.status = ?';
            params.push(queryParams.status);
        }

        if (queryParams.project_id) {
            sql += ' AND e.project_id = ?';
            params.push(queryParams.project_id);
        }

        if (queryParams.assigned_to) {
            sql += ' AND e.assigned_to = ?';
            params.push(queryParams.assigned_to);
        }

        if (queryParams.search) {
            sql += ' AND (e.name LIKE ? OR e.email LIKE ? OR e.phone LIKE ?)';
            const searchTerm = `%${queryParams.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        if (queryParams.date_from) {
            sql += ' AND e.created_at >= ?';
            params.push(queryParams.date_from);
        }

        if (queryParams.date_to) {
            sql += ' AND e.created_at <= ?';
            params.push(queryParams.date_to + ' 23:59:59');
        }

        sql += ' ORDER BY e.created_at DESC';

        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 20;
        const offset = (page - 1) * limit;
        sql += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const enquiries = await database.query(sql, params);

        // Get total count
        let countSql = 'SELECT COUNT(*) as total FROM contact_enquiries e WHERE 1=1';
        const countParams = [];

        if (queryParams.status) {
            countSql += ' AND e.status = ?';
            countParams.push(queryParams.status);
        }

        if (queryParams.project_id) {
            countSql += ' AND e.project_id = ?';
            countParams.push(queryParams.project_id);
        }

        if (queryParams.assigned_to) {
            countSql += ' AND e.assigned_to = ?';
            countParams.push(queryParams.assigned_to);
        }

        if (queryParams.search) {
            countSql += ' AND (e.name LIKE ? OR e.email LIKE ? OR e.phone LIKE ?)';
            const searchTerm = `%${queryParams.search}%`;
            countParams.push(searchTerm, searchTerm, searchTerm);
        }

        if (queryParams.date_from) {
            countSql += ' AND e.created_at >= ?';
            countParams.push(queryParams.date_from);
        }

        if (queryParams.date_to) {
            countSql += ' AND e.created_at <= ?';
            countParams.push(queryParams.date_to + ' 23:59:59');
        }

        const [{ total }] = await database.query(countSql, countParams);

        return success({
            enquiries,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Error getting enquiries:', err);
        throw err;
    }
}

async function getEnquiry(id, event) {
    try {
        await authorize(event, ['super_admin', 'admin', 'editor', 'viewer']);

        const enquiries = await database.query(
            `SELECT e.*, p.name as project_name, a.name as assigned_to_name
             FROM contact_enquiries e 
             LEFT JOIN projects p ON e.project_id = p.id 
             LEFT JOIN admin_users a ON e.assigned_to = a.id
             WHERE e.id = ?`,
            [id]
        );

        if (enquiries.length === 0) {
            return error('Enquiry not found', 404);
        }

        return success(enquiries[0]);
    } catch (err) {
        console.error('Error getting enquiry:', err);
        throw err;
    }
}

async function createEnquiry(event) {
    try {
        const data = JSON.parse(event.body);
        const { name, email, phone, project_id, message, source = 'website' } = data;

        if (!name || !email) {
            return error('Name and email are required');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return error('Invalid email format');
        }

        const result = await database.query(
            `INSERT INTO contact_enquiries (name, email, phone, project_id, message, source)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, email, phone, project_id, message, source]
        );

        const enquiryId = result.insertId;

        // Send notification email to admin
        try {
            await sendNotificationEmail({
                name,
                email,
                phone,
                project_id,
                message,
                enquiry_id: enquiryId
            });
        } catch (emailError) {
            console.error('Error sending notification email:', emailError);
            // Don't fail the request if email fails
        }

        return success({ 
            id: enquiryId, 
            message: 'Enquiry submitted successfully. We will contact you soon.' 
        }, 201);
    } catch (err) {
        console.error('Error creating enquiry:', err);
        throw err;
    }
}

async function updateEnquiry(event, id) {
    try {
        const adminUser = await authorize(event, ['super_admin', 'admin', 'editor']);
        const data = JSON.parse(event.body);

        const existingEnquiries = await database.query(
            'SELECT * FROM contact_enquiries WHERE id = ?',
            [id]
        );

        if (existingEnquiries.length === 0) {
            return error('Enquiry not found', 404);
        }

        const existingEnquiry = existingEnquiries[0];
        const { status, assigned_to, notes } = data;

        await database.query(
            `UPDATE contact_enquiries SET 
                status = ?, assigned_to = ?, notes = ?
             WHERE id = ?`,
            [
                status || existingEnquiry.status,
                assigned_to || existingEnquiry.assigned_to,
                notes || existingEnquiry.notes,
                id
            ]
        );

        await logAuditEvent(
            adminUser.id,
            'UPDATE',
            'contact_enquiries',
            id,
            existingEnquiry,
            data,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ message: 'Enquiry updated successfully' });
    } catch (err) {
        console.error('Error updating enquiry:', err);
        throw err;
    }
}

async function deleteEnquiry(event, id) {
    try {
        const adminUser = await authorize(event, ['super_admin', 'admin']);

        const existingEnquiries = await database.query(
            'SELECT * FROM contact_enquiries WHERE id = ?',
            [id]
        );

        if (existingEnquiries.length === 0) {
            return error('Enquiry not found', 404);
        }

        const existingEnquiry = existingEnquiries[0];

        await database.query('DELETE FROM contact_enquiries WHERE id = ?', [id]);

        await logAuditEvent(
            adminUser.id,
            'DELETE',
            'contact_enquiries',
            id,
            existingEnquiry,
            null,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ message: 'Enquiry deleted successfully' });
    } catch (err) {
        console.error('Error deleting enquiry:', err);
        throw err;
    }
}

async function sendNotificationEmail(enquiryData) {
    const { name, email, phone, message, enquiry_id } = enquiryData;
    
    const emailParams = {
        Source: process.env.FROM_EMAIL || 'noreply@aditiavenues.com',
        Destination: {
            ToAddresses: [process.env.ADMIN_EMAIL || 'admin@aditiavenues.com']
        },
        Message: {
            Subject: {
                Data: `New Enquiry from ${name} - Aditi Avenues`
            },
            Body: {
                Html: {
                    Data: `
                        <h2>New Contact Enquiry</h2>
                        <p><strong>Enquiry ID:</strong> ${enquiry_id}</p>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                        <p><strong>Message:</strong></p>
                        <p>${message || 'No message provided'}</p>
                        <hr>
                        <p>Please log into the admin panel to respond to this enquiry.</p>
                    `
                }
            }
        }
    };

    return await ses.sendEmail(emailParams).promise();
}