const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const database = require('./database');

const client = jwksClient({
    jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.USER_POOL_ID}/.well-known/jwks.json`
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

async function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, getKey, {
            audience: process.env.USER_POOL_CLIENT_ID,
            issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.USER_POOL_ID}`,
            algorithms: ['RS256']
        }, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

async function getAdminUser(cognitoSub) {
    const users = await database.query(
        'SELECT * FROM admin_users WHERE cognito_sub = ? AND is_active = TRUE',
        [cognitoSub]
    );
    return users[0] || null;
}

async function authorize(event, requiredRoles = []) {
    try {
        const authHeader = event.headers.Authorization || event.headers.authorization;
        if (!authHeader) {
            throw new Error('No authorization header');
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = await verifyToken(token);
        
        const adminUser = await getAdminUser(decoded.sub);
        if (!adminUser) {
            throw new Error('User not found or inactive');
        }

        if (requiredRoles.length > 0 && !requiredRoles.includes(adminUser.role)) {
            throw new Error('Insufficient permissions');
        }

        // Update last login
        await database.query(
            'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
            [adminUser.id]
        );

        return adminUser;
    } catch (error) {
        console.error('Authorization error:', error);
        throw new Error('Unauthorized');
    }
}

async function logAuditEvent(userId, action, entityType, entityId, oldValues, newValues, ipAddress, userAgent) {
    try {
        await database.query(
            `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                action,
                entityType,
                entityId,
                oldValues ? JSON.stringify(oldValues) : null,
                newValues ? JSON.stringify(newValues) : null,
                ipAddress,
                userAgent
            ]
        );
    } catch (error) {
        console.error('Audit log error:', error);
        // Don't throw error for audit logging failures
    }
}

module.exports = {
    authorize,
    logAuditEvent,
    getAdminUser
};