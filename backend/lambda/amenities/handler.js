const database = require('../shared/database');
const { authorize, logAuditEvent } = require('../shared/auth');
const { success, error, handleCors } = require('../shared/response');

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
                    return await getAmenity(pathParams.id);
                } else {
                    return await getAmenities(event.queryStringParameters || {});
                }
            case 'POST':
                return await createAmenity(event);
            case 'PUT':
                return await updateAmenity(event, pathParams.id);
            case 'DELETE':
                return await deleteAmenity(event, pathParams.id);
            default:
                return error('Method not allowed', 405);
        }
    } catch (err) {
        console.error('Error:', err);
        return error(err.message, 500);
    }
};

async function getAmenities(queryParams) {
    try {
        let sql = 'SELECT * FROM amenities WHERE is_active = TRUE';
        const params = [];

        if (queryParams.category) {
            sql += ' AND category = ?';
            params.push(queryParams.category);
        }

        if (queryParams.search) {
            sql += ' AND (title LIKE ? OR description LIKE ?)';
            const searchTerm = `%${queryParams.search}%`;
            params.push(searchTerm, searchTerm);
        }

        sql += ' ORDER BY display_order ASC, title ASC';

        const amenities = await database.query(sql, params);
        return success(amenities);
    } catch (err) {
        console.error('Error getting amenities:', err);
        throw err;
    }
}

async function getAmenity(id) {
    try {
        const amenities = await database.query(
            'SELECT * FROM amenities WHERE id = ? AND is_active = TRUE',
            [id]
        );

        if (amenities.length === 0) {
            return error('Amenity not found', 404);
        }

        return success(amenities[0]);
    } catch (err) {
        console.error('Error getting amenity:', err);
        throw err;
    }
}

async function createAmenity(event) {
    try {
        const adminUser = await authorize(event, ['super_admin', 'admin', 'editor']);
        const data = JSON.parse(event.body);

        const { title, description, icon_url, category, display_order = 0 } = data;

        if (!title) {
            return error('Title is required');
        }

        const result = await database.query(
            `INSERT INTO amenities (title, description, icon_url, category, display_order, created_by, updated_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, description, icon_url, category, display_order, adminUser.id, adminUser.id]
        );

        const amenityId = result.insertId;

        await logAuditEvent(
            adminUser.id,
            'CREATE',
            'amenities',
            amenityId,
            null,
            data,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ id: amenityId, message: 'Amenity created successfully' }, 201);
    } catch (err) {
        console.error('Error creating amenity:', err);
        throw err;
    }
}

async function updateAmenity(event, id) {
    try {
        const adminUser = await authorize(event, ['super_admin', 'admin', 'editor']);
        const data = JSON.parse(event.body);

        const existingAmenities = await database.query(
            'SELECT * FROM amenities WHERE id = ? AND is_active = TRUE',
            [id]
        );

        if (existingAmenities.length === 0) {
            return error('Amenity not found', 404);
        }

        const existingAmenity = existingAmenities[0];
        const { title, description, icon_url, category, display_order } = data;

        await database.query(
            `UPDATE amenities SET 
                title = ?, description = ?, icon_url = ?, category = ?, 
                display_order = ?, updated_by = ?
             WHERE id = ?`,
            [
                title || existingAmenity.title,
                description || existingAmenity.description,
                icon_url || existingAmenity.icon_url,
                category || existingAmenity.category,
                display_order !== undefined ? display_order : existingAmenity.display_order,
                adminUser.id,
                id
            ]
        );

        await logAuditEvent(
            adminUser.id,
            'UPDATE',
            'amenities',
            id,
            existingAmenity,
            data,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ message: 'Amenity updated successfully' });
    } catch (err) {
        console.error('Error updating amenity:', err);
        throw err;
    }
}

async function deleteAmenity(event, id) {
    try {
        const adminUser = await authorize(event, ['super_admin', 'admin']);

        const existingAmenities = await database.query(
            'SELECT * FROM amenities WHERE id = ? AND is_active = TRUE',
            [id]
        );

        if (existingAmenities.length === 0) {
            return error('Amenity not found', 404);
        }

        const existingAmenity = existingAmenities[0];

        await database.query(
            'UPDATE amenities SET is_active = FALSE, updated_by = ? WHERE id = ?',
            [adminUser.id, id]
        );

        await logAuditEvent(
            adminUser.id,
            'DELETE',
            'amenities',
            id,
            existingAmenity,
            null,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ message: 'Amenity deleted successfully' });
    } catch (err) {
        console.error('Error deleting amenity:', err);
        throw err;
    }
}