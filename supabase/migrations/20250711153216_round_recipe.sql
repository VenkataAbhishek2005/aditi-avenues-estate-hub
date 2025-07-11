-- Aditi Avenues Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS aditi_avenues;
USE aditi_avenues;

-- Projects table
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status ENUM('upcoming', 'ongoing', 'ready_to_move', 'completed') NOT NULL,
    configurations JSON, -- Array of configurations like ['2BHK', '3BHK']
    area_range VARCHAR(100), -- e.g., "1200-2400 sq ft"
    price_range VARCHAR(100), -- e.g., "₹45L - ₹85L"
    possession_date DATE,
    rera_id VARCHAR(100),
    description TEXT,
    highlights JSON, -- Array of highlights
    amenities JSON, -- Array of amenity IDs
    images JSON, -- Array of image URLs/keys
    documents JSON, -- Array of document URLs/keys
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    INDEX idx_status (status),
    INDEX idx_location (location),
    INDEX idx_featured (is_featured),
    INDEX idx_active (is_active)
);

-- Amenities table
CREATE TABLE amenities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    category VARCHAR(100),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    INDEX idx_category (category),
    INDEX idx_order (display_order),
    INDEX idx_active (is_active)
);

-- Gallery table
CREATE TABLE gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    category ENUM('exterior', 'interior', 'amenities', 'construction', 'lifestyle') NOT NULL,
    project_id INT,
    tags JSON, -- Array of tags
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_project (project_id),
    INDEX idx_order (display_order),
    INDEX idx_active (is_active)
);

-- Documents table
CREATE TABLE documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50), -- pdf, jpg, png, docx, etc.
    file_size BIGINT, -- in bytes
    document_type ENUM('rera_certificate', 'brochure', 'floor_plan', 'legal_approval', 'other') NOT NULL,
    project_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_type (document_type),
    INDEX idx_project (project_id),
    INDEX idx_active (is_active)
);

-- Admin users table
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cognito_sub VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'editor', 'viewer') NOT NULL DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- Contact enquiries table
CREATE TABLE contact_enquiries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    project_id INT,
    message TEXT,
    source VARCHAR(100) DEFAULT 'website', -- website, phone, email, etc.
    status ENUM('new', 'contacted', 'qualified', 'converted', 'closed') DEFAULT 'new',
    assigned_to INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_project (project_id),
    INDEX idx_created (created_at),
    INDEX idx_assigned (assigned_to)
);

-- Audit log table
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, etc.
    entity_type VARCHAR(100) NOT NULL, -- projects, amenities, gallery, etc.
    entity_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
);

-- Site settings table
CREATE TABLE site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Insert default amenities
INSERT INTO amenities (title, description, category, display_order) VALUES
('Swimming Pool', 'Resort-style swimming pool with separate kids pool and poolside deck', 'Recreation', 1),
('Fitness Center', 'Fully equipped gymnasium with modern cardio and strength training equipment', 'Health & Fitness', 2),
('Clubhouse', 'Multi-purpose clubhouse with event halls and recreational facilities', 'Community', 3),
('24/7 Security', 'Round-the-clock security with CCTV surveillance and trained personnel', 'Safety', 4),
('Landscaped Gardens', 'Beautifully designed gardens with walking paths and seating areas', 'Outdoor', 5),
('Children\'s Play Area', 'Safe and fun play area designed specifically for children of all ages', 'Family', 6),
('Covered Parking', 'Dedicated covered parking spaces for residents and visitors', 'Convenience', 7),
('Power Backup', '100% power backup for common areas and emergency lighting', 'Utilities', 8),
('Rainwater Harvesting', 'Eco-friendly rainwater harvesting system for sustainable living', 'Sustainability', 9);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
('company_name', 'Aditi Avenues', 'Company name'),
('company_email', 'info@aditiavenues.com', 'Primary company email'),
('company_phone', '+91 9876543210', 'Primary company phone'),
('company_address', 'Flat No-102, Vishali Nagar, Hyderabad, Telangana, India', 'Company address'),
('rera_number', 'P02400004321', 'RERA registration number'),
('established_year', '2012', 'Year company was established');