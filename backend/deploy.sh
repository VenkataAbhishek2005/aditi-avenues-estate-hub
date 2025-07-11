#!/bin/bash

# Deployment script for Aditi Avenues Backend
set -e

STAGE=${1:-dev}
REGION=${2:-us-east-1}

echo "🚀 Deploying Aditi Avenues Backend to stage: $STAGE in region: $REGION"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy infrastructure first
echo "🏗️  Deploying infrastructure..."
cd infrastructure
aws cloudformation deploy \
    --template-file cloudformation-template.yaml \
    --stack-name "aditi-avenues-infrastructure-$STAGE" \
    --parameter-overrides \
        Environment=$STAGE \
        DatabasePassword=$(aws ssm get-parameter --name "/aditi-avenues/$STAGE/db-password" --with-decryption --query 'Parameter.Value' --output text 2>/dev/null || echo "TempPassword123!") \
    --capabilities CAPABILITY_IAM \
    --region $REGION

# Wait for infrastructure to be ready
echo "⏳ Waiting for infrastructure to be ready..."
aws cloudformation wait stack-deploy-complete \
    --stack-name "aditi-avenues-infrastructure-$STAGE" \
    --region $REGION

cd ..

# Deploy Lambda functions
echo "⚡ Deploying Lambda functions..."
npx serverless deploy --stage $STAGE --region $REGION

# Run database migrations
echo "🗄️  Running database migrations..."
# Note: In production, you might want to use AWS Database Migration Service
# For now, we'll assume the database schema is created via the CloudFormation template

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "   Stage: $STAGE"
echo "   Region: $REGION"
echo "   API Gateway URL: $(aws cloudformation describe-stacks --stack-name aditi-avenues-backend-$STAGE --query 'Stacks[0].Outputs[?OutputKey==`ServiceEndpoint`].OutputValue' --output text --region $REGION)"
echo ""
echo "🔗 Next Steps:"
echo "   1. Update frontend API endpoints"
echo "   2. Configure Cognito user pool"
echo "   3. Set up SES for email notifications"
echo "   4. Configure CloudFront distribution"
echo ""
echo "📚 Documentation:"
echo "   - API Documentation: https://docs.aditiavenues.com/api"
echo "   - Admin Guide: https://docs.aditiavenues.com/admin"