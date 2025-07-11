import { 
  users, 
  adminUsers, 
  projects, 
  amenities, 
  gallery, 
  contactInquiries, 
  siteSettings,
  type User, 
  type InsertUser, 
  type AdminUser, 
  type InsertAdminUser,
  type Project,
  type InsertProject,
  type Amenity,
  type InsertAmenity,
  type Gallery,
  type InsertGallery,
  type ContactInquiry,
  type InsertContactInquiry,
  type SiteSetting,
  type InsertSiteSetting
} from "@shared/schema";

// Storage interface with full CRUD methods for all entities
export interface IStorage {
  // Legacy users (for backward compatibility)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Admin Users
  getAdminUser(id: number): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: number, user: Partial<AdminUser>): Promise<AdminUser | undefined>;
  deleteAdminUser(id: number): Promise<boolean>;
  listAdminUsers(): Promise<AdminUser[]>;

  // Projects
  getProject(id: number): Promise<Project | undefined>;
  listProjects(filters?: { status?: string; featured?: boolean }): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Amenities
  getAmenity(id: number): Promise<Amenity | undefined>;
  listAmenities(filters?: { category?: string; active?: boolean }): Promise<Amenity[]>;
  createAmenity(amenity: InsertAmenity): Promise<Amenity>;
  updateAmenity(id: number, amenity: Partial<Amenity>): Promise<Amenity | undefined>;
  deleteAmenity(id: number): Promise<boolean>;

  // Gallery
  getGalleryItem(id: number): Promise<Gallery | undefined>;
  listGalleryItems(filters?: { category?: string; projectId?: number }): Promise<Gallery[]>;
  createGalleryItem(item: InsertGallery): Promise<Gallery>;
  updateGalleryItem(id: number, item: Partial<Gallery>): Promise<Gallery | undefined>;
  deleteGalleryItem(id: number): Promise<boolean>;

  // Contact Inquiries
  getContactInquiry(id: number): Promise<ContactInquiry | undefined>;
  listContactInquiries(filters?: { status?: string; projectId?: number }): Promise<ContactInquiry[]>;
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  updateContactInquiry(id: number, inquiry: Partial<ContactInquiry>): Promise<ContactInquiry | undefined>;
  deleteContactInquiry(id: number): Promise<boolean>;

  // Site Settings
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  listSiteSettings(): Promise<SiteSetting[]>;
  createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  updateSiteSetting(key: string, value: string, updatedBy?: number): Promise<SiteSetting | undefined>;
  deleteSiteSetting(key: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private adminUsers: Map<number, AdminUser>;
  private projects: Map<number, Project>;
  private amenities: Map<number, Amenity>;
  private gallery: Map<number, Gallery>;
  private contactInquiries: Map<number, ContactInquiry>;
  private siteSettings: Map<string, SiteSetting>;
  
  private currentUserId: number;
  private currentAdminUserId: number;
  private currentProjectId: number;
  private currentAmenityId: number;
  private currentGalleryId: number;
  private currentInquiryId: number;

  constructor() {
    this.users = new Map();
    this.adminUsers = new Map();
    this.projects = new Map();
    this.amenities = new Map();
    this.gallery = new Map();
    this.contactInquiries = new Map();
    this.siteSettings = new Map();
    
    this.currentUserId = 1;
    this.currentAdminUserId = 1;
    this.currentProjectId = 1;
    this.currentAmenityId = 1;
    this.currentGalleryId = 1;
    this.currentInquiryId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create default admin user
    const defaultAdmin: AdminUser = {
      id: this.currentAdminUserId++,
      username: 'admin',
      email: 'admin@aditiavenues.com',
      password: 'admin123', // In production, this should be hashed
      role: 'super_admin',
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.adminUsers.set(defaultAdmin.id, defaultAdmin);

    // Initialize sample projects
    const sampleProjects: Project[] = [
      {
        id: this.currentProjectId++,
        name: 'Aditi Heights',
        location: 'Kompally, Hyderabad',
        status: 'ongoing',
        configurations: ['2BHK', '3BHK', '4BHK'],
        areaRange: '1200-2400 sq ft',
        priceRange: '₹45L - ₹85L',
        possessionDate: new Date('2025-12-01'),
        reraId: 'P02400004321',
        description: 'Modern residential complex with premium amenities and strategic location.',
        highlights: ['RERA Approved', 'Near IT Hub', 'Metro Connectivity', 'Premium Location'],
        amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Security', 'Garden', 'Parking'],
        images: ['hero-building.jpg'],
        documents: [],
        isFeatured: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentProjectId++,
        name: 'Aditi Paradise',
        location: 'Miyapur, Hyderabad',
        status: 'ready_to_move',
        configurations: ['1BHK', '2BHK', '3BHK'],
        areaRange: '850-1800 sq ft',
        priceRange: '₹35L - ₹65L',
        possessionDate: new Date(),
        reraId: 'P02400004322',
        description: 'Ready to move homes with excellent connectivity and modern amenities.',
        highlights: ['Ready to Move', 'Metro Station', 'Schools Nearby', 'Hospital Access'],
        amenities: ['Garden', 'Parking', 'Power Backup', 'Security', 'Playground'],
        images: ['amenities-hero.jpg'],
        documents: [],
        isFeatured: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    sampleProjects.forEach(project => this.projects.set(project.id, project));

    // Initialize sample amenities
    const sampleAmenities: Amenity[] = [
      {
        id: this.currentAmenityId++,
        title: 'Swimming Pool',
        description: 'Resort-style swimming pool with separate kids pool and poolside deck',
        icon: 'Waves',
        category: 'Recreation',
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentAmenityId++,
        title: 'Fitness Center',
        description: 'Fully equipped gymnasium with modern cardio and strength training equipment',
        icon: 'Dumbbell',
        category: 'Health & Fitness',
        displayOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    sampleAmenities.forEach(amenity => this.amenities.set(amenity.id, amenity));

    // Initialize site settings
    const defaultSettings: SiteSetting[] = [
      {
        id: 1,
        settingKey: 'company_name',
        settingValue: 'Aditi Avenues',
        description: 'Company name',
        updatedAt: new Date(),
        updatedBy: 1,
      },
      {
        id: 2,
        settingKey: 'company_email',
        settingValue: 'info@aditiavenues.com',
        description: 'Primary company email',
        updatedAt: new Date(),
        updatedBy: 1,
      }
    ];

    defaultSettings.forEach(setting => this.siteSettings.set(setting.settingKey, setting));
  }

  // Legacy user methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Admin user methods
  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    return this.adminUsers.get(id);
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(
      (user) => user.username === username,
    );
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(
      (user) => user.email === email,
    );
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const id = this.currentAdminUserId++;
    const user: AdminUser = { 
      ...insertUser, 
      id,
      role: insertUser.role || 'admin',
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.adminUsers.set(id, user);
    return user;
  }

  async updateAdminUser(id: number, userUpdate: Partial<AdminUser>): Promise<AdminUser | undefined> {
    const user = this.adminUsers.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userUpdate, updatedAt: new Date() };
    this.adminUsers.set(id, updatedUser);
    return updatedUser;
  }

  async deleteAdminUser(id: number): Promise<boolean> {
    return this.adminUsers.delete(id);
  }

  async listAdminUsers(): Promise<AdminUser[]> {
    return Array.from(this.adminUsers.values()).filter(user => user.isActive);
  }

  // Project methods
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async listProjects(filters?: { status?: string; featured?: boolean }): Promise<Project[]> {
    let projects = Array.from(this.projects.values()).filter(project => project.isActive);
    
    if (filters?.status) {
      projects = projects.filter(project => project.status === filters.status);
    }
    if (filters?.featured !== undefined) {
      projects = projects.filter(project => project.isFeatured === filters.featured);
    }
    
    return projects;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { 
      ...insertProject,
      id,
      configurations: Array.isArray(insertProject.configurations) ? insertProject.configurations : null,
      areaRange: insertProject.areaRange || null,
      priceRange: insertProject.priceRange || null,
      possessionDate: insertProject.possessionDate || null,
      reraId: insertProject.reraId || null,
      description: insertProject.description || null,
      highlights: Array.isArray(insertProject.highlights) ? insertProject.highlights : null,
      amenities: Array.isArray(insertProject.amenities) ? insertProject.amenities : null,
      images: Array.isArray(insertProject.images) ? insertProject.images : null,
      documents: Array.isArray(insertProject.documents) ? insertProject.documents : null,
      isFeatured: insertProject.isFeatured || false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...projectUpdate, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Amenity methods
  async getAmenity(id: number): Promise<Amenity | undefined> {
    return this.amenities.get(id);
  }

  async listAmenities(filters?: { category?: string; active?: boolean }): Promise<Amenity[]> {
    let amenities = Array.from(this.amenities.values());
    
    if (filters?.active !== undefined) {
      amenities = amenities.filter(amenity => amenity.isActive === filters.active);
    }
    if (filters?.category) {
      amenities = amenities.filter(amenity => amenity.category === filters.category);
    }
    
    return amenities.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async createAmenity(insertAmenity: InsertAmenity): Promise<Amenity> {
    const id = this.currentAmenityId++;
    const amenity: Amenity = { 
      ...insertAmenity,
      id,
      description: insertAmenity.description || null,
      icon: insertAmenity.icon || null,
      displayOrder: insertAmenity.displayOrder || 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.amenities.set(id, amenity);
    return amenity;
  }

  async updateAmenity(id: number, amenityUpdate: Partial<Amenity>): Promise<Amenity | undefined> {
    const amenity = this.amenities.get(id);
    if (!amenity) return undefined;
    
    const updatedAmenity = { ...amenity, ...amenityUpdate, updatedAt: new Date() };
    this.amenities.set(id, updatedAmenity);
    return updatedAmenity;
  }

  async deleteAmenity(id: number): Promise<boolean> {
    return this.amenities.delete(id);
  }

  // Gallery methods
  async getGalleryItem(id: number): Promise<Gallery | undefined> {
    return this.gallery.get(id);
  }

  async listGalleryItems(filters?: { category?: string; projectId?: number }): Promise<Gallery[]> {
    let items = Array.from(this.gallery.values()).filter(item => item.isActive);
    
    if (filters?.category) {
      items = items.filter(item => item.category === filters.category);
    }
    if (filters?.projectId) {
      items = items.filter(item => item.projectId === filters.projectId);
    }
    
    return items.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async createGalleryItem(insertItem: InsertGallery): Promise<Gallery> {
    const id = this.currentGalleryId++;
    const item: Gallery = { 
      ...insertItem,
      id,
      description: insertItem.description || null,
      projectId: insertItem.projectId || null,
      tags: Array.isArray(insertItem.tags) ? insertItem.tags : null,
      displayOrder: insertItem.displayOrder || 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.gallery.set(id, item);
    return item;
  }

  async updateGalleryItem(id: number, itemUpdate: Partial<Gallery>): Promise<Gallery | undefined> {
    const item = this.gallery.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...itemUpdate, updatedAt: new Date() };
    this.gallery.set(id, updatedItem);
    return updatedItem;
  }

  async deleteGalleryItem(id: number): Promise<boolean> {
    return this.gallery.delete(id);
  }

  // Contact inquiry methods
  async getContactInquiry(id: number): Promise<ContactInquiry | undefined> {
    return this.contactInquiries.get(id);
  }

  async listContactInquiries(filters?: { status?: string; projectId?: number }): Promise<ContactInquiry[]> {
    let inquiries = Array.from(this.contactInquiries.values());
    
    if (filters?.status) {
      inquiries = inquiries.filter(inquiry => inquiry.status === filters.status);
    }
    if (filters?.projectId) {
      inquiries = inquiries.filter(inquiry => inquiry.projectId === filters.projectId);
    }
    
    return inquiries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createContactInquiry(insertInquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const id = this.currentInquiryId++;
    const inquiry: ContactInquiry = { 
      ...insertInquiry,
      id,
      phone: insertInquiry.phone || null,
      projectId: insertInquiry.projectId || null,
      message: insertInquiry.message || null,
      source: insertInquiry.source || 'website',
      status: 'new',
      assignedTo: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.contactInquiries.set(id, inquiry);
    return inquiry;
  }

  async updateContactInquiry(id: number, inquiryUpdate: Partial<ContactInquiry>): Promise<ContactInquiry | undefined> {
    const inquiry = this.contactInquiries.get(id);
    if (!inquiry) return undefined;
    
    const updatedInquiry = { ...inquiry, ...inquiryUpdate, updatedAt: new Date() };
    this.contactInquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }

  async deleteContactInquiry(id: number): Promise<boolean> {
    return this.contactInquiries.delete(id);
  }

  // Site settings methods
  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    return this.siteSettings.get(key);
  }

  async listSiteSettings(): Promise<SiteSetting[]> {
    return Array.from(this.siteSettings.values());
  }

  async createSiteSetting(insertSetting: InsertSiteSetting): Promise<SiteSetting> {
    const setting: SiteSetting = { 
      ...insertSetting,
      id: Date.now(), // Simple ID generation for memory storage
      settingValue: insertSetting.settingValue || null,
      description: insertSetting.description || null,
      updatedAt: new Date(),
      updatedBy: null,
    };
    this.siteSettings.set(setting.settingKey, setting);
    return setting;
  }

  async updateSiteSetting(key: string, value: string, updatedBy?: number): Promise<SiteSetting | undefined> {
    const setting = this.siteSettings.get(key);
    if (!setting) return undefined;
    
    const updatedSetting = { 
      ...setting, 
      settingValue: value, 
      updatedAt: new Date(),
      updatedBy: updatedBy || null,
    };
    this.siteSettings.set(key, updatedSetting);
    return updatedSetting;
  }

  async deleteSiteSetting(key: string): Promise<boolean> {
    return this.siteSettings.delete(key);
  }
}

export const storage = new MemStorage();
