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
                    return await getGalleryItem(pathParams.id);
                } else {
                    return await getGallery(event.queryStringParameters || {});
                }
            case 'POST':
                return await createGalleryItem(event);
            case 'PUT':
                return await updateGalleryItem(event, pathParams.id);
            case 'DELETE':
                return await deleteGalleryItem(event, pathParams.id);
            default:
                return error('Method not allowed', 405);
        }
    } catch (err) {
        console.error('Error:', err);
        return error(err.message, 500);
    }
};

async function getGallery(queryParams) {
    try {
        let sql = `
            SELECT g.*, p.name as project_name 
            FROM gallery g 
            LEFT JOIN projects p ON g.project_id = p.id 
            WHERE g.is_active = TRUE
        `;
        const params = [];

        if (queryParams.category) {
            sql += ' AND g.category = ?';
            params.push(queryParams.category);
        }

        if (queryParams.project_id) {
            sql += ' AND g.project_id = ?';
            params.push(queryParams.project_id);
        }

        if (queryParams.search) {
            sql += ' AND (g.title LIKE ? OR g.description LIKE ?)';
            const searchTerm = `%${queryParams.search}%`;
            params.push(searchTerm, searchTerm);
        }

        sql += ' ORDER BY g.display_order ASC, g.created_at DESC';

        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 20;
        const offset = (page - 1) * limit;
        sql += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const galleryItems = await database.query(sql, params);

        // Get total count
        let countSql = 'SELECT COUNT(*) as total FROM gallery g WHERE g.is_active = TRUE';
        const countParams = [];

        if (queryParams.category) {
            countSql += ' AND g.category = ?';
            countParams.push(queryParams.category);
        }

        if (queryParams.project_id) {
            countSql += ' AND g.project_id = ?';
            countParams.push(queryParams.project_id);
        }

        if (queryParams.search) {
            countSql += ' AND (g.title LIKE ? OR g.description LIKE ?)';
            const searchTerm = `%${queryParams.search}%`;
            countParams.push(searchTerm, searchTerm);
        }

        const [{ total }] = await database.query(countSql, countParams);

        return success({
            gallery: galleryItems,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Error getting gallery:', err);
        throw err;
    }
}

async function getGalleryItem(id) {
    try {
        const items = await database.query(
            `SELECT g.*, p.name as project_name 
             FROM gallery g 
             LEFT JOIN projects p ON g.project_id = p.id 
             WHERE g.id = ? AND g.is_active = TRUE`,
            [id]
        );

        if (items.length === 0) {
            return error('Gallery item not found', 404);
        }

        return success(items[0]);
    } catch (err) {
        console.error('Error getting gallery item:', err);
        throw err;
    }
}

async function createGalleryItem(event) {
    try {
        const adminUser = await authorize(event, ['super_admin', 'admin', 'editor']);
        const data = JSON.parse(event.body);

        const {
            title,
            description,
            image_url,
            category,
            project_id,
            tags,
            display_order = 0
        } = data;

        if (!title || !image_url || !category) {
            return error('Title, image URL, and category are required');
        }

        const result = await database.query(
            `INSERT INTO gallery (
                title, description, image_url, category, project_id, 
                tags, display_order, created_by, updated_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                description,
                image_url,
                category,
                project_id,
                JSON.stringify(tags || []),
                display_order,
                adminUser.id,
                adminUser.id
            ]
        );

        const galleryId = result.insertId;

        await logAuditEvent(
            adminUser.id,
            'CREATE',
            'gallery',
            galleryId,
            null,
            data,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ id: galleryId, message: 'Gallery item created successfully' }, 201);
    } catch (err) {
        console.error('Error creating gallery item:', err);
        throw err;
    }
}

async function updateGalleryItem(event, id) {
    try {
        const adminUser = await authorize(event, ['super_admin', 'admin', 'editor']);
        const data = JSON.parse(event.body);

        const existingItems = await database.query(
            'SELECT * FROM gallery WHERE id = ? AND is_active = TRUE',
            [id]
        );

        if (existingItems.length === 0) {
            return error('Gallery item not found', 404);
        }

        const existingItem = existingItems[0];
        const {
            title,
            description,
            image_url,
            category,
            project_id,
            tags,
            display_order
        } = data;

        await database.query(
            `UPDATE gallery SET 
                title = ?, description = ?, image_url = ?, category = ?,
                project_id = ?, tags = ?, display_order = ?, updated_by = ?
             WHERE id = ?`,
            [
                title || existingItem.title,
                description || existingItem.description,
                image_url || existingItem.image_url,
                category || existingItem.category,
                project_id || existingItem.project_id,
                JSON.stringify(tags || JSON.parse(existingItem.tags || '[]')),
                display_order !== undefined ? display_order : existingItem.display_order,
                adminUser.id,
                id
            ]
        );

        await logAuditEvent(
            adminUser.id,
            'UPDATE',
            'gallery',
            id,
            existingItem,
            data,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ message: 'Gallery item updated successfully' });
    } catch (err) {
        console.error('Error updating gallery item:', err);
        throw err;
    }
}

async function deleteGalleryItem(event, id) {
    try {
        const adminUser = await authorize(event, ['super_admin', 'admin']);

        const existingItems = await database.query(
            'SELECT * FROM gallery WHERE id = ? AND is_active = TRUE',
            [id]
        );

        if (existingItems.length === 0) {
            return error('Gallery item not found', 404);
        }

        const existingItem = existingItems[0];

        await database.query(
            'UPDATE gallery SET is_active = FALSE, updated_by = ? WHERE id = ?',
            [adminUser.id, id]
        );

        await logAuditEvent(
            adminUser.id,
            'DELETE',
            'gallery',
            id,
            existingItem,
            null,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ message: 'Gallery item deleted successfully' });
    } catch (err) {
        console.error('Error deleting gallery item:', err);
        throw err;
    }
}