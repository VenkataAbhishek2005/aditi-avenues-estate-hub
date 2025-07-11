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
        const pathParams = event.pathParameters || {};

        switch (method) {
            case 'GET':
                if (pathParams.id) {
                    return await getDocument(pathParams.id);
                } else {
                    return await getDocuments(event.queryStringParameters || {});
                }
            case 'POST':
                return await createDocument(event);
            case 'PUT':
                return await updateDocument(event, pathParams.id);
            case 'DELETE':
                return await deleteDocument(event, pathParams.id);
            default:
                return error('Method not allowed', 405);
        }
    } catch (err) {
        console.error('Error:', err);
        return error(err.message, 500);
    }
};

async function getDocuments(queryParams) {
    try {
        let sql = `
            SELECT d.*, p.name as project_name 
            FROM documents d 
            LEFT JOIN projects p ON d.project_id = p.id 
            WHERE d.is_active = TRUE
        `;
        const params = [];

        if (queryParams.project_id) {
            sql += ' AND d.project_id = ?';
            params.push(queryParams.project_id);
        }

        if (queryParams.document_type) {
            sql += ' AND d.document_type = ?';
            params.push(queryParams.document_type);
        }

        if (queryParams.search) {
            sql += ' AND (d.title LIKE ? OR d.description LIKE ?)';
            const searchTerm = `%${queryParams.search}%`;
            params.push(searchTerm, searchTerm);
        }

        sql += ' ORDER BY d.document_type, d.title';

        const documents = await database.query(sql, params);
        return success(documents);
    } catch (err) {
        console.error('Error getting documents:', err);
        throw err;
    }
}

async function getDocument(id) {
    try {
        const documents = await database.query(
            `SELECT d.*, p.name as project_name 
             FROM documents d 
             LEFT JOIN projects p ON d.project_id = p.id 
             WHERE d.id = ? AND d.is_active = TRUE`,
            [id]
        );

        if (documents.length === 0) {
            return error('Document not found', 404);
        }

        return success(documents[0]);
    } catch (err) {
        console.error('Error getting document:', err);
        throw err;
    }
}

async function createDocument(event) {
    try {
        const adminUser = await authorize(event, ['super_admin', 'admin', 'editor']);
        const data = JSON.parse(event.body);

        const {
            title,
            description,
            file_url,
            file_type,
            file_size,
            document_type,
            project_id
        } = data;

        if (!title || !file_url || !document_type) {
            return error('Title, file URL, and document type are required');
        }

        const result = await database.query(
            `INSERT INTO documents (
                title, description, file_url, file_type, file_size,
                document_type, project_id, created_by, updated_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                description,
                file_url,
                file_type,
                file_size,
                document_type,
                project_id,
                adminUser.id,
                adminUser.id
            ]
        );

        const documentId = result.insertId;

        await logAuditEvent(
            adminUser.id,
            'CREATE',
            'documents',
            documentId,
            null,
            data,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ id: documentId, message: 'Document created successfully' }, 201);
    } catch (err) {
        console.error('Error creating document:', err);
        throw err;
    }
}

async function updateDocument(event, id) {
    try {
        const adminUser = await authorize(event, ['super_admin', 'admin', 'editor']);
        const data = JSON.parse(event.body);

        const existingDocuments = await database.query(
            'SELECT * FROM documents WHERE id = ? AND is_active = TRUE',
            [id]
        );

        if (existingDocuments.length === 0) {
            return error('Document not found', 404);
        }

        const existingDocument = existingDocuments[0];
        const {
            title,
            description,
            file_url,
            file_type,
            file_size,
            document_type,
            project_id
        } = data;

        await database.query(
            `UPDATE documents SET 
                title = ?, description = ?, file_url = ?, file_type = ?,
                file_size = ?, document_type = ?, project_id = ?, updated_by = ?
             WHERE id = ?`,
            [
                title || existingDocument.title,
                description || existingDocument.description,
                file_url || existingDocument.file_url,
                file_type || existingDocument.file_type,
                file_size || existingDocument.file_size,
                document_type || existingDocument.document_type,
                project_id || existingDocument.project_id,
                adminUser.id,
                id
            ]
        );

        await logAuditEvent(
            adminUser.id,
            'UPDATE',
            'documents',
            id,
            existingDocument,
            data,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ message: 'Document updated successfully' });
    } catch (err) {
        console.error('Error updating document:', err);
        throw err;
    }
}

async function deleteDocument(event, id) {
    try {
        const adminUser = await authorize(event, ['super_admin', 'admin']);

        const existingDocuments = await database.query(
            'SELECT * FROM documents WHERE id = ? AND is_active = TRUE',
            [id]
        );

        if (existingDocuments.length === 0) {
            return error('Document not found', 404);
        }

        const existingDocument = existingDocuments[0];

        // Delete from S3 if needed
        if (existingDocument.file_url && existingDocument.file_url.includes('amazonaws.com')) {
            try {
                const urlParts = existingDocument.file_url.split('/');
                const key = urlParts.slice(-1)[0];
                const bucketName = process.env.DOCUMENTS_BUCKET;
                
                await s3.deleteObject({
                    Bucket: bucketName,
                    Key: key
                }).promise();
            } catch (s3Error) {
                console.error('Error deleting from S3:', s3Error);
                // Continue with database deletion even if S3 deletion fails
            }
        }

        await database.query(
            'UPDATE documents SET is_active = FALSE, updated_by = ? WHERE id = ?',
            [adminUser.id, id]
        );

        await logAuditEvent(
            adminUser.id,
            'DELETE',
            'documents',
            id,
            existingDocument,
            null,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ message: 'Document deleted successfully' });
    } catch (err) {
        console.error('Error deleting document:', err);
        throw err;
    }
}