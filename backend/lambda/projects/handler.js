const database = require('../shared/database');
const { authorize, logAuditEvent } = require('../shared/auth');
const { success, error, handleCors } = require('../shared/response');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    if (event.httpMethod === 'OPTIONS') {
        return handleCors();
    }

    try {
        const method = event.httpMethod;
        const path = event.path;
        const pathParams = event.pathParameters || {};

        switch (method) {
            case 'GET':
                if (pathParams.id) {
                    return await getProject(pathParams.id);
                } else {
                    return await getProjects(event.queryStringParameters || {});
                }
            case 'POST':
                return await createProject(event);
            case 'PUT':
                return await updateProject(event, pathParams.id);
            case 'DELETE':
                return await deleteProject(event, pathParams.id);
            default:
                return error('Method not allowed', 405);
        }
    } catch (err) {
        console.error('Error:', err);
        return error(err.message, 500);
    }
};

async function getProjects(queryParams) {
    try {
        let sql = `
            SELECT p.*, 
                   (SELECT COUNT(*) FROM contact_enquiries WHERE project_id = p.id) as enquiry_count
            FROM projects p 
            WHERE p.is_active = TRUE
        `;
        const params = [];

        // Add filters
        if (queryParams.status) {
            sql += ' AND p.status = ?';
            params.push(queryParams.status);
        }

        if (queryParams.location) {
            sql += ' AND p.location LIKE ?';
            params.push(`%${queryParams.location}%`);
        }

        if (queryParams.featured === 'true') {
            sql += ' AND p.is_featured = TRUE';
        }

        if (queryParams.search) {
            sql += ' AND (p.name LIKE ? OR p.location LIKE ? OR p.description LIKE ?)';
            const searchTerm = `%${queryParams.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        // Add sorting
        const sortBy = queryParams.sortBy || 'created_at';
        const sortOrder = queryParams.sortOrder || 'DESC';
        sql += ` ORDER BY p.${sortBy} ${sortOrder}`;

        // Add pagination
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;
        const offset = (page - 1) * limit;
        sql += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const projects = await database.query(sql, params);

        // Get total count for pagination
        let countSql = 'SELECT COUNT(*) as total FROM projects p WHERE p.is_active = TRUE';
        const countParams = [];

        if (queryParams.status) {
            countSql += ' AND p.status = ?';
            countParams.push(queryParams.status);
        }

        if (queryParams.location) {
            countSql += ' AND p.location LIKE ?';
            countParams.push(`%${queryParams.location}%`);
        }

        if (queryParams.featured === 'true') {
            countSql += ' AND p.is_featured = TRUE';
        }

        if (queryParams.search) {
            countSql += ' AND (p.name LIKE ? OR p.location LIKE ? OR p.description LIKE ?)';
            const searchTerm = `%${queryParams.search}%`;
            countParams.push(searchTerm, searchTerm, searchTerm);
        }

        const [{ total }] = await database.query(countSql, countParams);

        return success({
            projects,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Error getting projects:', err);
        throw err;
    }
}

async function getProject(id) {
    try {
        const projects = await database.query(
            `SELECT p.*, 
                    (SELECT COUNT(*) FROM contact_enquiries WHERE project_id = p.id) as enquiry_count
             FROM projects p 
             WHERE p.id = ? AND p.is_active = TRUE`,
            [id]
        );

        if (projects.length === 0) {
            return error('Project not found', 404);
        }

        const project = projects[0];

        // Get associated documents
        const documents = await database.query(
            'SELECT * FROM documents WHERE project_id = ? AND is_active = TRUE ORDER BY document_type, title',
            [id]
        );

        // Get associated gallery images
        const galleryImages = await database.query(
            'SELECT * FROM gallery WHERE project_id = ? AND is_active = TRUE ORDER BY display_order, created_at',
            [id]
        );

        project.documents = documents;
        project.gallery_images = galleryImages;

        return success(project);
    } catch (err) {
        console.error('Error getting project:', err);
        throw err;
    }
}

async function createProject(event) {
    try {
        const adminUser = await authorize(event, ['super_admin', 'admin', 'editor']);
        const data = JSON.parse(event.body);

        const {
            name,
            location,
            status,
            configurations,
            area_range,
            price_range,
            possession_date,
            rera_id,
            description,
            highlights,
            amenities,
            is_featured = false
        } = data;

        // Validate required fields
        if (!name || !location || !status) {
            return error('Name, location, and status are required');
        }

        const result = await database.query(
            `INSERT INTO projects (
                name, location, status, configurations, area_range, price_range,
                possession_date, rera_id, description, highlights, amenities,
                is_featured, created_by, updated_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                location,
                status,
                JSON.stringify(configurations || []),
                area_range,
                price_range,
                possession_date,
                rera_id,
                description,
                JSON.stringify(highlights || []),
                JSON.stringify(amenities || []),
                is_featured,
                adminUser.id,
                adminUser.id
            ]
        );

        const projectId = result.insertId;

        // Log audit event
        await logAuditEvent(
            adminUser.id,
            'CREATE',
            'projects',
            projectId,
            null,
            data,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ id: projectId, message: 'Project created successfully' }, 201);
    } catch (err) {
        console.error('Error creating project:', err);
        throw err;
    }
}

async function updateProject(event, id) {
    try {
        const adminUser = await authorize(event, ['super_admin', 'admin', 'editor']);
        const data = JSON.parse(event.body);

        // Get existing project for audit log
        const existingProjects = await database.query(
            'SELECT * FROM projects WHERE id = ? AND is_active = TRUE',
            [id]
        );

        if (existingProjects.length === 0) {
            return error('Project not found', 404);
        }

        const existingProject = existingProjects[0];

        const {
            name,
            location,
            status,
            configurations,
            area_range,
            price_range,
            possession_date,
            rera_id,
            description,
            highlights,
            amenities,
            is_featured
        } = data;

        await database.query(
            `UPDATE projects SET 
                name = ?, location = ?, status = ?, configurations = ?, area_range = ?,
                price_range = ?, possession_date = ?, rera_id = ?, description = ?,
                highlights = ?, amenities = ?, is_featured = ?, updated_by = ?
             WHERE id = ?`,
            [
                name || existingProject.name,
                location || existingProject.location,
                status || existingProject.status,
                JSON.stringify(configurations || JSON.parse(existingProject.configurations || '[]')),
                area_range || existingProject.area_range,
                price_range || existingProject.price_range,
                possession_date || existingProject.possession_date,
                rera_id || existingProject.rera_id,
                description || existingProject.description,
                JSON.stringify(highlights || JSON.parse(existingProject.highlights || '[]')),
                JSON.stringify(amenities || JSON.parse(existingProject.amenities || '[]')),
                is_featured !== undefined ? is_featured : existingProject.is_featured,
                adminUser.id,
                id
            ]
        );

        // Log audit event
        await logAuditEvent(
            adminUser.id,
            'UPDATE',
            'projects',
            id,
            existingProject,
            data,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ message: 'Project updated successfully' });
    } catch (err) {
        console.error('Error updating project:', err);
        throw err;
    }
}

async function deleteProject(event, id) {
    try {
        const adminUser = await authorize(event, ['super_admin', 'admin']);

        // Get existing project for audit log
        const existingProjects = await database.query(
            'SELECT * FROM projects WHERE id = ? AND is_active = TRUE',
            [id]
        );

        if (existingProjects.length === 0) {
            return error('Project not found', 404);
        }

        const existingProject = existingProjects[0];

        // Soft delete
        await database.query(
            'UPDATE projects SET is_active = FALSE, updated_by = ? WHERE id = ?',
            [adminUser.id, id]
        );

        // Log audit event
        await logAuditEvent(
            adminUser.id,
            'DELETE',
            'projects',
            id,
            existingProject,
            null,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error('Error deleting project:', err);
        throw err;
    }
}