const database = require('../shared/database');
const { authorize, logAuditEvent } = require('../shared/auth');
const { success, error, handleCors } = require('../shared/response');
const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider();

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
                    return await getAdminUser(pathParams.id, event);
                } else {
                    return await getAdminUsers(event.queryStringParameters || {}, event);
                }
            case 'POST':
                return await createAdminUser(event);
            case 'PUT':
                return await updateAdminUser(event, pathParams.id);
            case 'DELETE':
                return await deleteAdminUser(event, pathParams.id);
            default:
                return error('Method not allowed', 405);
        }
    } catch (err) {
        console.error('Error:', err);
        return error(err.message, 500);
    }
};

async function getAdminUsers(queryParams, event) {
    try {
        const currentUser = await authorize(event, ['super_admin', 'admin']);

        let sql = 'SELECT id, email, name, role, is_active, last_login, created_at FROM admin_users WHERE 1=1';
        const params = [];

        if (queryParams.role) {
            sql += ' AND role = ?';
            params.push(queryParams.role);
        }

        if (queryParams.is_active !== undefined) {
            sql += ' AND is_active = ?';
            params.push(queryParams.is_active === 'true');
        }

        if (queryParams.search) {
            sql += ' AND (name LIKE ? OR email LIKE ?)';
            const searchTerm = `%${queryParams.search}%`;
            params.push(searchTerm, searchTerm);
        }

        sql += ' ORDER BY created_at DESC';

        const users = await database.query(sql, params);
        return success(users);
    } catch (err) {
        console.error('Error getting admin users:', err);
        throw err;
    }
}

async function getAdminUser(id, event) {
    try {
        await authorize(event, ['super_admin', 'admin']);

        const users = await database.query(
            'SELECT id, email, name, role, is_active, last_login, created_at FROM admin_users WHERE id = ?',
            [id]
        );

        if (users.length === 0) {
            return error('Admin user not found', 404);
        }

        return success(users[0]);
    } catch (err) {
        console.error('Error getting admin user:', err);
        throw err;
    }
}

async function createAdminUser(event) {
    try {
        const currentUser = await authorize(event, ['super_admin']);
        const data = JSON.parse(event.body);

        const { email, name, role, temporaryPassword } = data;

        if (!email || !name || !role) {
            return error('Email, name, and role are required');
        }

        // Validate role
        const validRoles = ['super_admin', 'admin', 'editor', 'viewer'];
        if (!validRoles.includes(role)) {
            return error('Invalid role');
        }

        // Create user in Cognito
        const cognitoParams = {
            UserPoolId: process.env.USER_POOL_ID,
            Username: email,
            TemporaryPassword: temporaryPassword || generateTemporaryPassword(),
            MessageAction: 'SUPPRESS', // Don't send welcome email
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'email_verified',
                    Value: 'true'
                },
                {
                    Name: 'custom:role',
                    Value: role
                }
            ]
        };

        const cognitoUser = await cognito.adminCreateUser(cognitoParams).promise();
        const cognitoSub = cognitoUser.User.Username;

        // Create user in database
        const result = await database.query(
            'INSERT INTO admin_users (cognito_sub, email, name, role) VALUES (?, ?, ?, ?)',
            [cognitoSub, email, name, role]
        );

        const userId = result.insertId;

        await logAuditEvent(
            currentUser.id,
            'CREATE',
            'admin_users',
            userId,
            null,
            { email, name, role },
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ 
            id: userId, 
            message: 'Admin user created successfully',
            temporaryPassword: cognitoParams.TemporaryPassword
        }, 201);
    } catch (err) {
        console.error('Error creating admin user:', err);
        if (err.code === 'UsernameExistsException') {
            return error('User with this email already exists');
        }
        throw err;
    }
}

async function updateAdminUser(event, id) {
    try {
        const currentUser = await authorize(event, ['super_admin']);
        const data = JSON.parse(event.body);

        const existingUsers = await database.query(
            'SELECT * FROM admin_users WHERE id = ?',
            [id]
        );

        if (existingUsers.length === 0) {
            return error('Admin user not found', 404);
        }

        const existingUser = existingUsers[0];
        const { name, role, is_active } = data;

        // Validate role if provided
        if (role) {
            const validRoles = ['super_admin', 'admin', 'editor', 'viewer'];
            if (!validRoles.includes(role)) {
                return error('Invalid role');
            }
        }

        // Update in database
        await database.query(
            'UPDATE admin_users SET name = ?, role = ?, is_active = ? WHERE id = ?',
            [
                name || existingUser.name,
                role || existingUser.role,
                is_active !== undefined ? is_active : existingUser.is_active,
                id
            ]
        );

        // Update role in Cognito if changed
        if (role && role !== existingUser.role) {
            try {
                await cognito.adminUpdateUserAttributes({
                    UserPoolId: process.env.USER_POOL_ID,
                    Username: existingUser.cognito_sub,
                    UserAttributes: [
                        {
                            Name: 'custom:role',
                            Value: role
                        }
                    ]
                }).promise();
            } catch (cognitoError) {
                console.error('Error updating Cognito user:', cognitoError);
                // Continue even if Cognito update fails
            }
        }

        await logAuditEvent(
            currentUser.id,
            'UPDATE',
            'admin_users',
            id,
            existingUser,
            data,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ message: 'Admin user updated successfully' });
    } catch (err) {
        console.error('Error updating admin user:', err);
        throw err;
    }
}

async function deleteAdminUser(event, id) {
    try {
        const currentUser = await authorize(event, ['super_admin']);

        const existingUsers = await database.query(
            'SELECT * FROM admin_users WHERE id = ?',
            [id]
        );

        if (existingUsers.length === 0) {
            return error('Admin user not found', 404);
        }

        const existingUser = existingUsers[0];

        // Prevent deleting self
        if (existingUser.id === currentUser.id) {
            return error('Cannot delete your own account');
        }

        // Deactivate user in database
        await database.query(
            'UPDATE admin_users SET is_active = FALSE WHERE id = ?',
            [id]
        );

        // Disable user in Cognito
        try {
            await cognito.adminDisableUser({
                UserPoolId: process.env.USER_POOL_ID,
                Username: existingUser.cognito_sub
            }).promise();
        } catch (cognitoError) {
            console.error('Error disabling Cognito user:', cognitoError);
            // Continue even if Cognito update fails
        }

        await logAuditEvent(
            currentUser.id,
            'DELETE',
            'admin_users',
            id,
            existingUser,
            null,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ message: 'Admin user deleted successfully' });
    } catch (err) {
        console.error('Error deleting admin user:', err);
        throw err;
    }
}

function generateTemporaryPassword() {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one of each required character type
    password += 'A'; // uppercase
    password += 'a'; // lowercase
    password += '1'; // number
    password += '!'; // symbol
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Shuffle the password
    return password.split('').sort(() => 0.5 - Math.random()).join('');
}