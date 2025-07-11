const database = require('../shared/database');
const { authorize } = require('../shared/auth');
const { success, error, handleCors } = require('../shared/response');

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    if (event.httpMethod === 'OPTIONS') {
        return handleCors();
    }

    try {
        await authorize(event, ['super_admin', 'admin', 'editor', 'viewer']);
        
        const path = event.path;
        const queryParams = event.queryStringParameters || {};

        if (path.includes('/dashboard')) {
            return await getDashboardAnalytics(queryParams);
        } else if (path.includes('/enquiries')) {
            return await getEnquiryAnalytics(queryParams);
        } else if (path.includes('/projects')) {
            return await getProjectAnalytics(queryParams);
        } else {
            return error('Invalid analytics endpoint', 404);
        }
    } catch (err) {
        console.error('Error:', err);
        return error(err.message, 500);
    }
};

async function getDashboardAnalytics(queryParams) {
    try {
        const dateFrom = queryParams.date_from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const dateTo = queryParams.date_to || new Date().toISOString().split('T')[0];

        // Get overview stats
        const [projectStats] = await database.query(`
            SELECT 
                COUNT(*) as total_projects,
                SUM(CASE WHEN status = 'ongoing' THEN 1 ELSE 0 END) as ongoing_projects,
                SUM(CASE WHEN status = 'ready_to_move' THEN 1 ELSE 0 END) as ready_projects,
                SUM(CASE WHEN status = 'upcoming' THEN 1 ELSE 0 END) as upcoming_projects,
                SUM(CASE WHEN is_featured = TRUE THEN 1 ELSE 0 END) as featured_projects
            FROM projects 
            WHERE is_active = TRUE
        `);

        const [enquiryStats] = await database.query(`
            SELECT 
                COUNT(*) as total_enquiries,
                SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_enquiries,
                SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted_enquiries,
                SUM(CASE WHEN status = 'qualified' THEN 1 ELSE 0 END) as qualified_enquiries,
                SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted_enquiries
            FROM contact_enquiries 
            WHERE created_at BETWEEN ? AND ?
        `, [dateFrom, dateTo + ' 23:59:59']);

        const [galleryStats] = await database.query(`
            SELECT 
                COUNT(*) as total_images,
                COUNT(DISTINCT category) as categories,
                COUNT(DISTINCT project_id) as projects_with_images
            FROM gallery 
            WHERE is_active = TRUE
        `);

        const [documentStats] = await database.query(`
            SELECT 
                COUNT(*) as total_documents,
                COUNT(DISTINCT document_type) as document_types,
                COUNT(DISTINCT project_id) as projects_with_documents
            FROM documents 
            WHERE is_active = TRUE
        `);

        // Get recent enquiries
        const recentEnquiries = await database.query(`
            SELECT e.*, p.name as project_name 
            FROM contact_enquiries e 
            LEFT JOIN projects p ON e.project_id = p.id 
            ORDER BY e.created_at DESC 
            LIMIT 10
        `);

        // Get enquiry trends (last 30 days)
        const enquiryTrends = await database.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as count
            FROM contact_enquiries 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        // Get project enquiry distribution
        const projectEnquiries = await database.query(`
            SELECT 
                p.name,
                COUNT(e.id) as enquiry_count
            FROM projects p
            LEFT JOIN contact_enquiries e ON p.id = e.project_id
            WHERE p.is_active = TRUE
            GROUP BY p.id, p.name
            ORDER BY enquiry_count DESC
            LIMIT 10
        `);

        return success({
            overview: {
                projects: projectStats,
                enquiries: enquiryStats,
                gallery: galleryStats,
                documents: documentStats
            },
            recentEnquiries,
            enquiryTrends,
            projectEnquiries,
            dateRange: { from: dateFrom, to: dateTo }
        });
    } catch (err) {
        console.error('Error getting dashboard analytics:', err);
        throw err;
    }
}

async function getEnquiryAnalytics(queryParams) {
    try {
        const dateFrom = queryParams.date_from || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const dateTo = queryParams.date_to || new Date().toISOString().split('T')[0];

        // Enquiry status distribution
        const statusDistribution = await database.query(`
            SELECT 
                status,
                COUNT(*) as count
            FROM contact_enquiries 
            WHERE created_at BETWEEN ? AND ?
            GROUP BY status
            ORDER BY count DESC
        `, [dateFrom, dateTo + ' 23:59:59']);

        // Enquiries by source
        const sourceDistribution = await database.query(`
            SELECT 
                source,
                COUNT(*) as count
            FROM contact_enquiries 
            WHERE created_at BETWEEN ? AND ?
            GROUP BY source
            ORDER BY count DESC
        `, [dateFrom, dateTo + ' 23:59:59']);

        // Monthly enquiry trends
        const monthlyTrends = await database.query(`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                COUNT(*) as count
            FROM contact_enquiries 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month ASC
        `);

        // Conversion funnel
        const conversionFunnel = await database.query(`
            SELECT 
                'Total Enquiries' as stage,
                COUNT(*) as count,
                100 as percentage
            FROM contact_enquiries 
            WHERE created_at BETWEEN ? AND ?
            
            UNION ALL
            
            SELECT 
                'Contacted' as stage,
                COUNT(*) as count,
                ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM contact_enquiries WHERE created_at BETWEEN ? AND ?)), 2) as percentage
            FROM contact_enquiries 
            WHERE status IN ('contacted', 'qualified', 'converted') 
            AND created_at BETWEEN ? AND ?
            
            UNION ALL
            
            SELECT 
                'Qualified' as stage,
                COUNT(*) as count,
                ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM contact_enquiries WHERE created_at BETWEEN ? AND ?)), 2) as percentage
            FROM contact_enquiries 
            WHERE status IN ('qualified', 'converted') 
            AND created_at BETWEEN ? AND ?
            
            UNION ALL
            
            SELECT 
                'Converted' as stage,
                COUNT(*) as count,
                ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM contact_enquiries WHERE created_at BETWEEN ? AND ?)), 2) as percentage
            FROM contact_enquiries 
            WHERE status = 'converted' 
            AND created_at BETWEEN ? AND ?
        `, [
            dateFrom, dateTo + ' 23:59:59',
            dateFrom, dateTo + ' 23:59:59',
            dateFrom, dateTo + ' 23:59:59',
            dateFrom, dateTo + ' 23:59:59',
            dateFrom, dateTo + ' 23:59:59',
            dateFrom, dateTo + ' 23:59:59',
            dateFrom, dateTo + ' 23:59:59'
        ]);

        return success({
            statusDistribution,
            sourceDistribution,
            monthlyTrends,
            conversionFunnel,
            dateRange: { from: dateFrom, to: dateTo }
        });
    } catch (err) {
        console.error('Error getting enquiry analytics:', err);
        throw err;
    }
}

async function getProjectAnalytics(queryParams) {
    try {
        // Project status distribution
        const statusDistribution = await database.query(`
            SELECT 
                status,
                COUNT(*) as count
            FROM projects 
            WHERE is_active = TRUE
            GROUP BY status
            ORDER BY count DESC
        `);

        // Projects by location
        const locationDistribution = await database.query(`
            SELECT 
                location,
                COUNT(*) as count
            FROM projects 
            WHERE is_active = TRUE
            GROUP BY location
            ORDER BY count DESC
        `);

        // Project performance (enquiries per project)
        const projectPerformance = await database.query(`
            SELECT 
                p.name,
                p.status,
                p.location,
                COUNT(e.id) as enquiry_count,
                p.created_at
            FROM projects p
            LEFT JOIN contact_enquiries e ON p.id = e.project_id
            WHERE p.is_active = TRUE
            GROUP BY p.id, p.name, p.status, p.location, p.created_at
            ORDER BY enquiry_count DESC
        `);

        // Gallery and document stats per project
        const projectAssets = await database.query(`
            SELECT 
                p.name,
                COUNT(DISTINCT g.id) as gallery_count,
                COUNT(DISTINCT d.id) as document_count
            FROM projects p
            LEFT JOIN gallery g ON p.id = g.project_id AND g.is_active = TRUE
            LEFT JOIN documents d ON p.id = d.project_id AND d.is_active = TRUE
            WHERE p.is_active = TRUE
            GROUP BY p.id, p.name
            ORDER BY p.name
        `);

        return success({
            statusDistribution,
            locationDistribution,
            projectPerformance,
            projectAssets
        });
    } catch (err) {
        console.error('Error getting project analytics:', err);
        throw err;
    }
}