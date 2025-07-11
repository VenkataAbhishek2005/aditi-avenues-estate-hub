# Aditi Avenues Backend

AWS-based serverless backend for the Aditi Avenues real estate website.

## Architecture

### AWS Services Used

- **API Gateway**: RESTful API endpoints
- **Lambda**: Serverless compute for business logic
- **RDS MySQL**: Relational database for structured data
- **S3**: File storage for documents and images
- **Cognito**: Authentication and user management
- **CloudFront**: CDN for global content delivery
- **SES**: Email notifications
- **CloudWatch**: Monitoring and logging
- **CloudFormation**: Infrastructure as Code

### Project Structure

```
backend/
├── infrastructure/
│   └── cloudformation-template.yaml    # AWS infrastructure
├── lambda/
│   ├── shared/                         # Shared utilities
│   │   ├── database.js                 # Database connection
│   │   ├── auth.js                     # Authentication helpers
│   │   └── response.js                 # HTTP response helpers
│   ├── projects/                       # Project management
│   ├── amenities/                      # Amenities management
│   ├── gallery/                        # Gallery management
│   ├── documents/                      # Document management
│   ├── contact/                        # Contact enquiries
│   ├── upload/                         # File upload handling
│   ├── admin-users/                    # Admin user management
│   ├── analytics/                      # Analytics and reporting
│   └── settings/                       # Site settings
├── supabase/migrations/                # Database schema
├── serverless.yml                      # Serverless configuration
├── package.json                        # Dependencies
└── deploy.sh                          # Deployment script
```

## API Endpoints

### Public Endpoints

- `GET /api/projects` - List projects (with filters)
- `GET /api/projects/{id}` - Get project details
- `GET /api/amenities` - List amenities
- `GET /api/gallery` - List gallery images
- `POST /api/contact` - Submit contact enquiry

### Admin Endpoints (Require Authentication)

#### Projects
- `POST /api/projects` - Create project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

#### Amenities
- `POST /api/amenities` - Create amenity
- `PUT /api/amenities/{id}` - Update amenity
- `DELETE /api/amenities/{id}` - Delete amenity

#### Gallery
- `POST /api/gallery` - Add gallery image
- `PUT /api/gallery/{id}` - Update gallery image
- `DELETE /api/gallery/{id}` - Delete gallery image

#### Documents
- `GET /api/documents` - List documents
- `POST /api/documents` - Add document
- `PUT /api/documents/{id}` - Update document
- `DELETE /api/documents/{id}` - Delete document

#### Contact Management
- `GET /api/contact` - List enquiries
- `GET /api/contact/{id}` - Get enquiry details
- `PUT /api/contact/{id}` - Update enquiry status
- `DELETE /api/contact/{id}` - Delete enquiry

#### File Upload
- `POST /api/upload` - Generate presigned URL for file upload
- `DELETE /api/upload` - Delete file from S3

#### Admin Users
- `GET /api/admin/users` - List admin users
- `POST /api/admin/users` - Create admin user
- `PUT /api/admin/users/{id}` - Update admin user
- `DELETE /api/admin/users/{id}` - Delete admin user

#### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/enquiries` - Enquiry analytics
- `GET /api/analytics/projects` - Project analytics

#### Settings
- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update site settings

## Authentication

The backend uses AWS Cognito for authentication with JWT tokens. Admin users must be authenticated to access protected endpoints.

### Role-Based Access Control

- **super_admin**: Full access to all features
- **admin**: Access to most features except user management
- **editor**: Can manage content but not users or settings
- **viewer**: Read-only access

## Database Schema

The database includes the following main tables:

- `projects` - Project information
- `amenities` - Amenity details
- `gallery` - Gallery images
- `documents` - Project documents
- `contact_enquiries` - Contact form submissions
- `admin_users` - Admin user accounts
- `audit_logs` - Audit trail of admin actions
- `site_settings` - Configurable site settings

## Deployment

### Prerequisites

1. AWS CLI configured with appropriate permissions
2. Node.js 18+ installed
3. Serverless Framework installed globally

### Environment Setup

1. Set up AWS SSM parameters:
```bash
aws ssm put-parameter \
    --name "/aditi-avenues/dev/db-password" \
    --value "YourSecurePassword123!" \
    --type "SecureString"
```

2. Configure SES for email notifications:
```bash
aws ses verify-email-identity --email-address admin@aditiavenues.com
```

### Deploy Infrastructure

```bash
# Deploy to development
./deploy.sh dev us-east-1

# Deploy to staging
./deploy.sh staging us-east-1

# Deploy to production
./deploy.sh prod us-east-1
```

### Manual Deployment Steps

1. Deploy infrastructure:
```bash
cd infrastructure
aws cloudformation deploy \
    --template-file cloudformation-template.yaml \
    --stack-name aditi-avenues-infrastructure-dev \
    --parameter-overrides Environment=dev DatabasePassword=YourPassword \
    --capabilities CAPABILITY_IAM
```

2. Deploy Lambda functions:
```bash
npm install
npx serverless deploy --stage dev
```

## Configuration

### Environment Variables

The following environment variables are automatically set by the deployment:

- `DB_HOST` - RDS database endpoint
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password (from SSM)
- `DB_NAME` - Database name
- `USER_POOL_ID` - Cognito User Pool ID
- `USER_POOL_CLIENT_ID` - Cognito User Pool Client ID
- `DOCUMENTS_BUCKET` - S3 bucket for documents
- `GALLERY_BUCKET` - S3 bucket for gallery images
- `FROM_EMAIL` - SES verified sender email
- `ADMIN_EMAIL` - Admin notification email

### Security Features

1. **VPC**: Lambda functions run in private subnets
2. **Encryption**: S3 buckets and RDS use encryption at rest
3. **IAM**: Least privilege access for all resources
4. **WAF**: Web Application Firewall protection
5. **HTTPS**: All traffic encrypted in transit
6. **Audit Logging**: All admin actions are logged

## Monitoring

### CloudWatch Dashboards

The deployment creates CloudWatch dashboards for:

- API Gateway metrics (requests, latency, errors)
- Lambda function performance
- Database performance
- S3 usage statistics

### Alerts

CloudWatch alarms are configured for:

- High error rates
- Unusual traffic patterns
- Database connection issues
- Lambda function timeouts

## Backup and Recovery

### Automated Backups

- **RDS**: 7-day automated backups with point-in-time recovery
- **S3**: Versioning enabled with lifecycle policies
- **Database**: Daily snapshots retained for 30 days

### Disaster Recovery

- Multi-AZ RDS deployment for high availability
- S3 cross-region replication for critical assets
- Infrastructure as Code for rapid environment recreation

## Development

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start local development server:
```bash
npm run offline
```

3. Run tests:
```bash
npm test
```

### API Testing

Use the provided Postman collection or test with curl:

```bash
# Get projects
curl -X GET https://api.aditiavenues.com/api/projects

# Create project (requires authentication)
curl -X POST https://api.aditiavenues.com/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","location":"Hyderabad","status":"ongoing"}'
```

## Support

For technical support or questions:

- Email: tech@aditiavenues.com
- Documentation: https://docs.aditiavenues.com
- Issue Tracker: https://github.com/aditiavenues/backend/issues

## License

Copyright © 2024 Aditi Avenues. All rights reserved.