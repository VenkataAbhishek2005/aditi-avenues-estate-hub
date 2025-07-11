import { pgTable, text, serial, integer, boolean, timestamp, json, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin Users Table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"), // super_admin, admin, editor, viewer
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Projects Table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull(), // upcoming, ongoing, ready_to_move, completed
  configurations: json("configurations").$type<string[]>(), // ['2BHK', '3BHK']
  areaRange: text("area_range"), // "1200-2400 sq ft"
  priceRange: text("price_range"), // "₹45L - ₹85L"
  possessionDate: timestamp("possession_date"),
  reraId: text("rera_id"),
  description: text("description"),
  highlights: json("highlights").$type<string[]>(),
  amenities: json("amenities").$type<string[]>(),
  images: json("images").$type<string[]>(),
  documents: json("documents").$type<string[]>(),
  isFeatured: boolean("is_featured").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Amenities Table
export const amenities = pgTable("amenities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon"), // Lucide icon name
  category: text("category").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Gallery Table
export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // exterior, interior, amenities, construction, lifestyle
  projectId: integer("project_id").references(() => projects.id),
  tags: json("tags").$type<string[]>(),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Contact Inquiries Table
export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  projectId: integer("project_id").references(() => projects.id),
  message: text("message"),
  source: text("source").notNull().default("website"), // website, phone, email, etc.
  status: text("status").notNull().default("new"), // new, contacted, qualified, converted, closed
  assignedTo: integer("assigned_to").references(() => adminUsers.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Site Settings Table
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value"),
  description: text("description"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  updatedBy: integer("updated_by").references(() => adminUsers.id),
});

// Insert Schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).pick({
  username: true,
  email: true,
  password: true,
  role: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  location: true,
  status: true,
  configurations: true,
  areaRange: true,
  priceRange: true,
  possessionDate: true,
  reraId: true,
  description: true,
  highlights: true,
  amenities: true,
  images: true,
  documents: true,
  isFeatured: true,
});

export const insertAmenitySchema = createInsertSchema(amenities).pick({
  title: true,
  description: true,
  icon: true,
  category: true,
  displayOrder: true,
});

export const insertGallerySchema = createInsertSchema(gallery).pick({
  title: true,
  description: true,
  imageUrl: true,
  category: true,
  projectId: true,
  tags: true,
  displayOrder: true,
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).pick({
  name: true,
  email: true,
  phone: true,
  projectId: true,
  message: true,
  source: true,
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).pick({
  settingKey: true,
  settingValue: true,
  description: true,
});

// Types
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertAmenity = z.infer<typeof insertAmenitySchema>;
export type Amenity = typeof amenities.$inferSelect;

export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type Gallery = typeof gallery.$inferSelect;

export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;

export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

// Legacy users table for backward compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
