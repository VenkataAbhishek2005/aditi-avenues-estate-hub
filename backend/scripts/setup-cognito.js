const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: process.env.AWS_REGION || 'us-east-1'
});

async function createInitialAdminUser() {
    const userPoolId = process.env.USER_POOL_ID;
    const email = process.env.ADMIN_EMAIL || 'admin@aditiavenues.com';
    const temporaryPassword = 'TempPassword123!';

    try {
        console.log('Creating initial admin user...');
        
        const params = {
            UserPoolId: userPoolId,
            Username: email,
            TemporaryPassword: temporaryPassword,
            MessageAction: 'SUPPRESS',
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
                    Value: 'super_admin'
                }
            ]
        };

        const result = await cognito.adminCreateUser(params).promise();
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email:', email);
        console.log('🔑 Temporary Password:', temporaryPassword);
        console.log('⚠️  Please change the password on first login');
        
        return result;
    } catch (error) {
        if (error.code === 'UsernameExistsException') {
            console.log('ℹ️  Admin user already exists');
        } else {
            console.error('❌ Error creating admin user:', error);
            throw error;
        }
    }
}

async function setupUserPoolDomain() {
    const userPoolId = process.env.USER_POOL_ID;
    const domain = `aditi-avenues-${process.env.STAGE || 'dev'}`;

    try {
        console.log('Setting up Cognito domain...');
        
        const params = {
            Domain: domain,
            UserPoolId: userPoolId
        };

        await cognito.createUserPoolDomain(params).promise();
        console.log(`✅ Cognito domain created: ${domain}.auth.${process.env.AWS_REGION}.amazoncognito.com`);
    } catch (error) {
        if (error.code === 'InvalidParameterException' && error.message.includes('already exists')) {
            console.log('ℹ️  Cognito domain already exists');
        } else {
            console.error('❌ Error creating domain:', error);
            throw error;
        }
    }
}

async function main() {
    try {
        await setupUserPoolDomain();
        await createInitialAdminUser();
        console.log('\n🎉 Cognito setup completed successfully!');
    } catch (error) {
        console.error('❌ Setup failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    createInitialAdminUser,
    setupUserPoolDomain
};