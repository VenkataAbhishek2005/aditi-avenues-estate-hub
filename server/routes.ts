import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactInquirySchema, 
  insertAdminUserSchema,
  insertProjectSchema,
  insertAmenitySchema,
  insertGallerySchema 
} from "@shared/schema";
import { z } from "zod";

// Middleware to validate request body against schema
const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: Function) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  };
};

// Simple authentication middleware (in production, use proper JWT/session management)
const requireAuth = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  // In production, verify JWT token here
  // For demo purposes, we'll just check for a simple token
  const token = authHeader.substring(7);
  if (token !== 'admin-token-demo') {
    return res.status(401).json({ message: "Invalid token" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Public API routes (no authentication required)
  
  // GET /api/projects - List all active projects
  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      const { status, featured } = req.query;
      const filters: any = {};
      
      if (status && typeof status === 'string') {
        filters.status = status;
      }
      if (featured !== undefined) {
        filters.featured = featured === 'true';
      }
      
      const projects = await storage.listProjects(filters);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Error fetching projects" });
    }
  });

  // GET /api/projects/:id - Get specific project
  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Error fetching project" });
    }
  });

  // GET /api/amenities - List all active amenities
  app.get("/api/amenities", async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      const filters: any = { active: true };
      
      if (category && typeof category === 'string') {
        filters.category = category;
      }
      
      const amenities = await storage.listAmenities(filters);
      res.json(amenities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching amenities" });
    }
  });

  // GET /api/gallery - List all active gallery items
  app.get("/api/gallery", async (req: Request, res: Response) => {
    try {
      const { category, projectId } = req.query;
      const filters: any = {};
      
      if (category && typeof category === 'string') {
        filters.category = category;
      }
      if (projectId) {
        filters.projectId = parseInt(projectId as string);
      }
      
      const galleryItems = await storage.listGalleryItems(filters);
      res.json(galleryItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching gallery items" });
    }
  });

  // POST /api/contact - Submit contact inquiry
  app.post("/api/contact", validateBody(insertContactInquirySchema), async (req: Request, res: Response) => {
    try {
      const inquiry = await storage.createContactInquiry(req.body);
      res.status(201).json({
        message: "Contact inquiry submitted successfully",
        inquiry: {
          id: inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          createdAt: inquiry.createdAt
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error submitting contact inquiry" });
    }
  });

  // Admin authentication route
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const adminUser = await storage.getAdminUserByUsername(username);
      
      if (!adminUser || adminUser.password !== password || !adminUser.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Update last login
      await storage.updateAdminUser(adminUser.id, { lastLogin: new Date() });
      
      // In production, generate proper JWT token here
      const token = 'admin-token-demo';
      
      res.json({
        message: "Login successful",
        token,
        user: {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Login error" });
    }
  });

  // Protected Admin API routes (authentication required)
  
  // GET /api/admin/dashboard - Dashboard statistics
  app.get("/api/admin/dashboard", requireAuth, async (req: Request, res: Response) => {
    try {
      const [projects, inquiries, galleryItems, adminUsers] = await Promise.all([
        storage.listProjects(),
        storage.listContactInquiries(),
        storage.listGalleryItems(),
        storage.listAdminUsers()
      ]);
      
      const stats = {
        totalProjects: projects.length,
        totalInquiries: inquiries.length,
        newInquiries: inquiries.filter(i => i.status === 'new').length,
        totalGalleryItems: galleryItems.length,
        totalAdminUsers: adminUsers.length
      };
      
      res.json({
        stats,
        recentProjects: projects.slice(0, 5),
        recentInquiries: inquiries.slice(0, 10)
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching dashboard data" });
    }
  });

  // Admin Projects Management
  app.get("/api/admin/projects", requireAuth, async (req: Request, res: Response) => {
    try {
      const projects = await storage.listProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Error fetching projects" });
    }
  });

  app.post("/api/admin/projects", requireAuth, validateBody(insertProjectSchema), async (req: Request, res: Response) => {
    try {
      const project = await storage.createProject(req.body);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: "Error creating project" });
    }
  });

  app.put("/api/admin/projects/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.updateProject(id, req.body);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Error updating project" });
    }
  });

  app.delete("/api/admin/projects/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting project" });
    }
  });

  // Admin Contact Inquiries Management
  app.get("/api/admin/inquiries", requireAuth, async (req: Request, res: Response) => {
    try {
      const { status, projectId } = req.query;
      const filters: any = {};
      
      if (status && typeof status === 'string') {
        filters.status = status;
      }
      if (projectId) {
        filters.projectId = parseInt(projectId as string);
      }
      
      const inquiries = await storage.listContactInquiries(filters);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Error fetching inquiries" });
    }
  });

  app.put("/api/admin/inquiries/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const inquiry = await storage.updateContactInquiry(id, req.body);
      
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Error updating inquiry" });
    }
  });

  // Admin Gallery Management
  app.get("/api/admin/gallery", requireAuth, async (req: Request, res: Response) => {
    try {
      const galleryItems = await storage.listGalleryItems();
      res.json(galleryItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching gallery items" });
    }
  });

  app.post("/api/admin/gallery", requireAuth, validateBody(insertGallerySchema), async (req: Request, res: Response) => {
    try {
      const item = await storage.createGalleryItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: "Error creating gallery item" });
    }
  });

  app.put("/api/admin/gallery/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.updateGalleryItem(id, req.body);
      
      if (!item) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Error updating gallery item" });
    }
  });

  app.delete("/api/admin/gallery/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGalleryItem(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
      
      res.json({ message: "Gallery item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting gallery item" });
    }
  });

  // Admin Amenities Management
  app.get("/api/admin/amenities", requireAuth, async (req: Request, res: Response) => {
    try {
      const amenities = await storage.listAmenities();
      res.json(amenities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching amenities" });
    }
  });

  app.post("/api/admin/amenities", requireAuth, validateBody(insertAmenitySchema), async (req: Request, res: Response) => {
    try {
      const amenity = await storage.createAmenity(req.body);
      res.status(201).json(amenity);
    } catch (error) {
      res.status(500).json({ message: "Error creating amenity" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
