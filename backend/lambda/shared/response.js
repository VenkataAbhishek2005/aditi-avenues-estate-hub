const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Content-Type': 'application/json'
};

function success(data, statusCode = 200) {
    return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify({
            success: true,
            data
        })
    };
}

function error(message, statusCode = 400, details = null) {
    return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify({
            success: false,
            error: message,
            details
        })
    };
}

function handleCors() {
    return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
    };
}

module.exports = {
    success,
    error,
    handleCors
};