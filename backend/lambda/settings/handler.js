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

        switch (method) {
            case 'GET':
                return await getSettings(event);
            case 'PUT':
                return await updateSettings(event);
            default:
                return error('Method not allowed', 405);
        }
    } catch (err) {
        console.error('Error:', err);
        return error(err.message, 500);
    }
};

async function getSettings(event) {
    try {
        await authorize(event, ['super_admin', 'admin', 'editor', 'viewer']);

        const settings = await database.query(
            'SELECT setting_key, setting_value, description FROM site_settings ORDER BY setting_key'
        );

        // Convert to key-value object for easier frontend consumption
        const settingsObject = {};
        settings.forEach(setting => {
            settingsObject[setting.setting_key] = {
                value: setting.setting_value,
                description: setting.description
            };
        });

        return success(settingsObject);
    } catch (err) {
        console.error('Error getting settings:', err);
        throw err;
    }
}

async function updateSettings(event) {
    try {
        const adminUser = await authorize(event, ['super_admin', 'admin']);
        const data = JSON.parse(event.body);

        // Get existing settings for audit log
        const existingSettings = await database.query(
            'SELECT setting_key, setting_value FROM site_settings'
        );
        const existingSettingsObject = {};
        existingSettings.forEach(setting => {
            existingSettingsObject[setting.setting_key] = setting.setting_value;
        });

        // Update each setting
        for (const [key, value] of Object.entries(data)) {
            await database.query(
                `INSERT INTO site_settings (setting_key, setting_value, updated_by) 
                 VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE 
                 setting_value = VALUES(setting_value), 
                 updated_by = VALUES(updated_by), 
                 updated_at = CURRENT_TIMESTAMP`,
                [key, value, adminUser.id]
            );
        }

        // Log audit event
        await logAuditEvent(
            adminUser.id,
            'UPDATE',
            'site_settings',
            null,
            existingSettingsObject,
            data,
            event.requestContext?.identity?.sourceIp,
            event.headers?.['User-Agent']
        );

        return success({ message: 'Settings updated successfully' });
    } catch (err) {
        console.error('Error updating settings:', err);
        throw err;
    }
}