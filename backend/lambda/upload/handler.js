const AWS = require('aws-sdk');
const { authorize } = require('../shared/auth');
const { success, error, handleCors } = require('../shared/response');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3();

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    if (event.httpMethod === 'OPTIONS') {
        return handleCors();
    }

    try {
        const adminUser = await authorize(event, ['super_admin', 'admin', 'editor']);
        
        if (event.httpMethod === 'POST') {
            return await generatePresignedUrl(event);
        } else if (event.httpMethod === 'DELETE') {
            return await deleteFile(event);
        } else {
            return error('Method not allowed', 405);
        }
    } catch (err) {
        console.error('Error:', err);
        return error(err.message, 500);
    }
};

async function generatePresignedUrl(event) {
    try {
        const data = JSON.parse(event.body);
        const { fileName, fileType, fileCategory } = data;

        if (!fileName || !fileType || !fileCategory) {
            return error('fileName, fileType, and fileCategory are required');
        }

        // Validate file category
        const validCategories = ['documents', 'gallery', 'amenities'];
        if (!validCategories.includes(fileCategory)) {
            return error('Invalid file category');
        }

        // Validate file type
        const allowedTypes = {
            documents: ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            gallery: ['image/jpeg', 'image/png', 'image/webp'],
            amenities: ['image/jpeg', 'image/png', 'image/svg+xml']
        };

        if (!allowedTypes[fileCategory].includes(fileType)) {
            return error(`File type ${fileType} not allowed for category ${fileCategory}`);
        }

        // Generate unique file name
        const fileExtension = fileName.split('.').pop();
        const uniqueFileName = `${fileCategory}/${Date.now()}-${uuidv4()}.${fileExtension}`;

        // Determine bucket based on category
        const bucketName = fileCategory === 'documents' 
            ? process.env.DOCUMENTS_BUCKET 
            : process.env.GALLERY_BUCKET;

        // Generate presigned URL for upload
        const presignedUrl = s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: uniqueFileName,
            ContentType: fileType,
            Expires: 300, // 5 minutes
            ACL: 'private'
        });

        // Generate the final URL that will be stored in database
        const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;

        return success({
            uploadUrl: presignedUrl,
            fileUrl: fileUrl,
            fileName: uniqueFileName
        });
    } catch (err) {
        console.error('Error generating presigned URL:', err);
        throw err;
    }
}

async function deleteFile(event) {
    try {
        const data = JSON.parse(event.body);
        const { fileUrl } = data;

        if (!fileUrl) {
            return error('fileUrl is required');
        }

        // Extract bucket and key from URL
        const urlParts = fileUrl.split('/');
        const bucketName = urlParts[2].split('.')[0]; // Extract bucket name from domain
        const key = urlParts.slice(3).join('/'); // Everything after domain

        // Validate bucket
        const validBuckets = [process.env.DOCUMENTS_BUCKET, process.env.GALLERY_BUCKET];
        if (!validBuckets.includes(bucketName)) {
            return error('Invalid bucket');
        }

        await s3.deleteObject({
            Bucket: bucketName,
            Key: key
        }).promise();

        return success({ message: 'File deleted successfully' });
    } catch (err) {
        console.error('Error deleting file:', err);
        throw err;
    }
}