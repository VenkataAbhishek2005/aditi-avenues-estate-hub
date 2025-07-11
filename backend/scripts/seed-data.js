const database = require('../lambda/shared/database');

async function seedAmenities() {
    console.log('🌱 Seeding amenities...');
    
    const amenities = [
        {
            title: 'Swimming Pool',
            description: 'Resort-style swimming pool with separate kids pool and poolside deck',
            category: 'Recreation',
            display_order: 1
        },
        {
            title: 'Fitness Center',
            description: 'Fully equipped gymnasium with modern cardio and strength training equipment',
            category: 'Health & Fitness',
            display_order: 2
        },
        {
            title: 'Clubhouse',
            description: 'Multi-purpose clubhouse with event halls and recreational facilities',
            category: 'Community',
            display_order: 3
        },
        {
            title: '24/7 Security',
            description: 'Round-the-clock security with CCTV surveillance and trained personnel',
            category: 'Safety',
            display_order: 4
        },
        {
            title: 'Landscaped Gardens',
            description: 'Beautifully designed gardens with walking paths and seating areas',
            category: 'Outdoor',
            display_order: 5
        },
        {
            title: 'Children\'s Play Area',
            description: 'Safe and fun play area designed specifically for children of all ages',
            category: 'Family',
            display_order: 6
        },
        {
            title: 'Covered Parking',
            description: 'Dedicated covered parking spaces for residents and visitors',
            category: 'Convenience',
            display_order: 7
        },
        {
            title: 'Power Backup',
            description: '100% power backup for common areas and emergency lighting',
            category: 'Utilities',
            display_order: 8
        },
        {
            title: 'Rainwater Harvesting',
            description: 'Eco-friendly rainwater harvesting system for sustainable living',
            category: 'Sustainability',
            display_order: 9
        },
        {
            title: 'Multipurpose Hall',
            description: 'Spacious hall for events, celebrations, and community gatherings',
            category: 'Community',
            display_order: 10
        },
        {
            title: 'CCTV Surveillance',
            description: 'Comprehensive CCTV coverage for enhanced security and peace of mind',
            category: 'Safety',
            display_order: 11
        },
        {
            title: 'Indoor Games',
            description: 'Indoor recreation area with table tennis, carrom, and other games',
            category: 'Recreation',
            display_order: 12
        }
    ];

    for (const amenity of amenities) {
        await database.query(
            `INSERT IGNORE INTO amenities (title, description, category, display_order) 
             VALUES (?, ?, ?, ?)`,
            [amenity.title, amenity.description, amenity.category, amenity.display_order]
        );
    }
    
    console.log('✅ Amenities seeded successfully');
}

async function seedSampleProjects() {
    console.log('🌱 Seeding sample projects...');
    
    const projects = [
        {
            name: 'Aditi Heights',
            location: 'Kompally, Hyderabad',
            status: 'ongoing',
            configurations: ['2BHK', '3BHK', '4BHK'],
            area_range: '1200-2400 sq ft',
            price_range: '₹45L - ₹85L',
            possession_date: '2025-12-31',
            rera_id: 'P02400004321',
            description: 'Modern residential complex with premium amenities and strategic location near IT corridor.',
            highlights: ['RERA Approved', 'Near IT Hub', 'Metro Connectivity', 'Premium Location'],
            amenities: [1, 2, 3, 4, 5, 6, 7, 8],
            is_featured: true
        },
        {
            name: 'Aditi Paradise',
            location: 'Miyapur, Hyderabad',
            status: 'ready_to_move',
            configurations: ['1BHK', '2BHK', '3BHK'],
            area_range: '850-1800 sq ft',
            price_range: '₹35L - ₹65L',
            possession_date: '2024-01-01',
            rera_id: 'P02400004322',
            description: 'Ready to move homes with excellent connectivity and modern amenities.',
            highlights: ['Ready to Move', 'Metro Station', 'Schools Nearby', 'Hospital Access'],
            amenities: [1, 3, 4, 5, 6, 7, 8],
            is_featured: true
        },
        {
            name: 'Aditi Grandeur',
            location: 'Kondapur, Hyderabad',
            status: 'upcoming',
            configurations: ['2BHK', '3BHK', '4BHK', '5BHK'],
            area_range: '1400-3000 sq ft',
            price_range: '₹65L - ₹1.2Cr',
            possession_date: '2026-06-30',
            rera_id: 'P02400004323',
            description: 'Luxury residential project with world-class amenities and premium location.',
            highlights: ['Luxury Living', 'Premium Location', 'World-class Amenities', 'High-end Finishes'],
            amenities: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            is_featured: false
        },
        {
            name: 'Aditi Serene',
            location: 'Gachibowli, Hyderabad',
            status: 'ongoing',
            configurations: ['2BHK', '3BHK'],
            area_range: '1100-1900 sq ft',
            price_range: '₹55L - ₹95L',
            possession_date: '2026-03-31',
            rera_id: 'P02400004324',
            description: 'Peaceful residential community in the heart of IT corridor.',
            highlights: ['IT Corridor', 'Peaceful Environment', 'Modern Design', 'Investment Opportunity'],
            amenities: [1, 2, 3, 4, 5, 7, 8],
            is_featured: false
        }
    ];

    for (const project of projects) {
        await database.query(
            `INSERT IGNORE INTO projects (
                name, location, status, configurations, area_range, price_range,
                possession_date, rera_id, description, highlights, amenities, is_featured
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                project.name,
                project.location,
                project.status,
                JSON.stringify(project.configurations),
                project.area_range,
                project.price_range,
                project.possession_date,
                project.rera_id,
                project.description,
                JSON.stringify(project.highlights),
                JSON.stringify(project.amenities),
                project.is_featured
            ]
        );
    }
    
    console.log('✅ Sample projects seeded successfully');
}

async function seedSiteSettings() {
    console.log('🌱 Seeding site settings...');
    
    const settings = [
        {
            setting_key: 'company_name',
            setting_value: 'Aditi Avenues',
            description: 'Company name displayed on the website'
        },
        {
            setting_key: 'company_email',
            setting_value: 'info@aditiavenues.com',
            description: 'Primary company email address'
        },
        {
            setting_key: 'company_phone',
            setting_value: '+91 9876543210',
            description: 'Primary company phone number'
        },
        {
            setting_key: 'company_address',
            setting_value: 'Flat No-102, Vishali Nagar, Hyderabad, Telangana, India',
            description: 'Company physical address'
        },
        {
            setting_key: 'rera_number',
            setting_value: 'P02400004321',
            description: 'RERA registration number'
        },
        {
            setting_key: 'established_year',
            setting_value: '2012',
            description: 'Year the company was established'
        },
        {
            setting_key: 'website_title',
            setting_value: 'Aditi Avenues - Crafting Modern Living',
            description: 'Website title for SEO'
        },
        {
            setting_key: 'website_description',
            setting_value: 'Premium residential projects in Hyderabad with modern amenities and strategic locations.',
            description: 'Website meta description for SEO'
        },
        {
            setting_key: 'social_facebook',
            setting_value: 'https://facebook.com/aditiavenues',
            description: 'Facebook page URL'
        },
        {
            setting_key: 'social_instagram',
            setting_value: 'https://instagram.com/aditiavenues',
            description: 'Instagram profile URL'
        },
        {
            setting_key: 'social_twitter',
            setting_value: 'https://twitter.com/aditiavenues',
            description: 'Twitter profile URL'
        },
        {
            setting_key: 'social_linkedin',
            setting_value: 'https://linkedin.com/company/aditiavenues',
            description: 'LinkedIn company page URL'
        }
    ];

    for (const setting of settings) {
        await database.query(
            `INSERT INTO site_settings (setting_key, setting_value, description) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             setting_value = VALUES(setting_value), 
             description = VALUES(description)`,
            [setting.setting_key, setting.setting_value, setting.description]
        );
    }
    
    console.log('✅ Site settings seeded successfully');
}

async function main() {
    try {
        console.log('🌱 Starting data seeding...\n');
        
        await seedAmenities();
        await seedSampleProjects();
        await seedSiteSettings();
        
        console.log('\n🎉 Data seeding completed successfully!');
        
        await database.close();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    seedAmenities,
    seedSampleProjects,
    seedSiteSettings
};