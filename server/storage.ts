import { 
  type Claim, 
  type InsertClaim,
  type DamageItem,
  type InsertDamageItem,
  type Photo,
  type InsertPhoto,
  type CostBreakdown,
  type InsertCostBreakdown,
  type AuditLog,
  type InsertAuditLog,
  type User, 
  type InsertUser 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Claim methods
  getClaim(id: string): Promise<Claim | undefined>;
  getClaimByNumber(claimNumber: string): Promise<Claim | undefined>;
  getAllClaims(): Promise<Claim[]>;
  createClaim(claim: InsertClaim): Promise<Claim>;
  updateClaim(id: string, updates: Partial<Claim>): Promise<Claim | undefined>;
  
  // Damage items methods
  getDamageItemsByClaim(claimId: string): Promise<DamageItem[]>;
  createDamageItem(damageItem: InsertDamageItem): Promise<DamageItem>;
  
  // Photos methods
  getPhotosByClaim(claimId: string): Promise<Photo[]>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  
  // Cost breakdown methods
  getCostBreakdownByClaim(claimId: string): Promise<CostBreakdown[]>;
  createCostBreakdown(costBreakdown: InsertCostBreakdown): Promise<CostBreakdown>;
  
  // Audit log methods
  getAuditLogByClaim(claimId: string): Promise<AuditLog[]>;
  createAuditLog(auditLog: InsertAuditLog): Promise<AuditLog>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private claims: Map<string, Claim>;
  private damageItems: Map<string, DamageItem>;
  private photos: Map<string, Photo>;
  private costBreakdowns: Map<string, CostBreakdown>;
  private auditLogs: Map<string, AuditLog>;

  constructor() {
    this.users = new Map();
    this.claims = new Map();
    this.damageItems = new Map();
    this.photos = new Map();
    this.costBreakdowns = new Map();
    this.auditLogs = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleClaimId = randomUUID();
    
    // Sample claim
    const sampleClaim: Claim = {
      id: sampleClaimId,
      claimNumber: "CLM-2024-001847",
      policyholderName: "Michael Rodriguez",
      vehicleInfo: "2022 Toyota Camry",
      vin: "4T1C11AK*N*123456",
      incidentDate: new Date("2024-03-15"),
      incidentDescription: "Parking lot collision",
      status: "pending_review",
      priority: "high",
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      totalEstimate: "2847.00",
      agentNotes: null,
      assignedAgent: "Sarah Johnson",
    };
    this.claims.set(sampleClaimId, sampleClaim);

    // Sample damage items
    const damageItems: DamageItem[] = [
      {
        id: randomUUID(),
        claimId: sampleClaimId,
        type: "paint_scratches",
        severity: "moderate",
        location: "front_bumper",
        description: "Paint Scratches",
        area: "12\" x 4\"",
        depth: "Surface level",
        repairType: "Paint & buff",
        confidence: "87.00",
        coordinates: { x: 35, y: 45, width: 25, height: 15 },
      },
      {
        id: randomUUID(),
        claimId: sampleClaimId,
        type: "structural_dent",
        severity: "severe",
        location: "front_bumper",
        description: "Structural Dent",
        area: "8\" x 6\"",
        depth: "2.5\" deep",
        repairType: "Panel replacement",
        confidence: "94.00",
        coordinates: { x: 20, y: 60, width: 15, height: 10 },
      },
      {
        id: randomUUID(),
        claimId: sampleClaimId,
        type: "surface_abrasion",
        severity: "minor",
        location: "headlight_housing",
        description: "Minor Scuff",
        area: "3\" x 1\"",
        depth: "Surface only",
        repairType: "Polish/compound",
        confidence: "76.00",
        coordinates: { x: 45, y: 35, width: 10, height: 8 },
      },
    ];

    damageItems.forEach(item => this.damageItems.set(item.id, item));

    // Sample photos
    const photos: Photo[] = [
      {
        id: randomUUID(),
        claimId: sampleClaimId,
        category: "front_bumper",
        url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        thumbnailUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
        isPrimary: true,
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        claimId: sampleClaimId,
        category: "front_bumper",
        url: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        thumbnailUrl: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
        isPrimary: false,
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        claimId: sampleClaimId,
        category: "side_panel",
        url: "https://images.unsplash.com/photo-1609244314066-f69aae9f7f82?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        thumbnailUrl: "https://images.unsplash.com/photo-1609244314066-f69aae9f7f82?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
        isPrimary: false,
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ];

    photos.forEach(photo => this.photos.set(photo.id, photo));

    // Sample cost breakdown
    const costItems: CostBreakdown[] = [
      {
        id: randomUUID(),
        claimId: sampleClaimId,
        category: "labor",
        description: "Labor",
        amount: "1020.00",
        hours: "12.00",
        rate: "85.00",
      },
      {
        id: randomUUID(),
        claimId: sampleClaimId,
        category: "parts",
        description: "Front bumper assembly",
        amount: "1485.00",
        hours: null,
        rate: null,
      },
      {
        id: randomUUID(),
        claimId: sampleClaimId,
        category: "paint",
        description: "Paint & Materials",
        amount: "285.00",
        hours: null,
        rate: null,
      },
      {
        id: randomUUID(),
        claimId: sampleClaimId,
        category: "supplies",
        description: "Shop Supplies",
        amount: "57.00",
        hours: null,
        rate: null,
      },
    ];

    costItems.forEach(item => this.costBreakdowns.set(item.id, item));

    // Sample audit log
    const auditItems: AuditLog[] = [
      {
        id: randomUUID(),
        claimId: sampleClaimId,
        action: "ai_analysis_completed",
        description: "AI Analysis Completed",
        performedBy: "system",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        metadata: { confidence: "87%", areasIdentified: 3 },
      },
      {
        id: randomUUID(),
        claimId: sampleClaimId,
        action: "photos_uploaded",
        description: "Photos Uploaded",
        performedBy: "system",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        metadata: { photoCount: 9, processedByCV: true },
      },
      {
        id: randomUUID(),
        claimId: sampleClaimId,
        action: "claim_submitted",
        description: "Claim Submitted",
        performedBy: "Michael Rodriguez",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        metadata: {},
      },
    ];

    auditItems.forEach(item => this.auditLogs.set(item.id, item));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Claim methods
  async getClaim(id: string): Promise<Claim | undefined> {
    return this.claims.get(id);
  }

  async getClaimByNumber(claimNumber: string): Promise<Claim | undefined> {
    return Array.from(this.claims.values()).find(
      (claim) => claim.claimNumber === claimNumber,
    );
  }

  async getAllClaims(): Promise<Claim[]> {
    return Array.from(this.claims.values());
  }

  async createClaim(insertClaim: InsertClaim): Promise<Claim> {
    const id = randomUUID();
    const claim: Claim = { 
      ...insertClaim, 
      id,
      submittedAt: new Date(),
      status: insertClaim.status || "pending",
    };
    this.claims.set(id, claim);
    return claim;
  }

  async updateClaim(id: string, updates: Partial<Claim>): Promise<Claim | undefined> {
    const claim = this.claims.get(id);
    if (!claim) return undefined;
    
    const updatedClaim = { ...claim, ...updates };
    this.claims.set(id, updatedClaim);
    return updatedClaim;
  }

  // Damage items methods
  async getDamageItemsByClaim(claimId: string): Promise<DamageItem[]> {
    return Array.from(this.damageItems.values()).filter(
      (item) => item.claimId === claimId,
    );
  }

  async createDamageItem(insertDamageItem: InsertDamageItem): Promise<DamageItem> {
    const id = randomUUID();
    const damageItem: DamageItem = { 
      ...insertDamageItem, 
      id,
      area: insertDamageItem.area || null,
      depth: insertDamageItem.depth || null,
      repairType: insertDamageItem.repairType || null,
    };
    this.damageItems.set(id, damageItem);
    return damageItem;
  }

  // Photos methods
  async getPhotosByClaim(claimId: string): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter(
      (photo) => photo.claimId === claimId,
    );
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = randomUUID();
    const photo: Photo = { 
      ...insertPhoto, 
      id,
      uploadedAt: new Date(),
      thumbnailUrl: insertPhoto.thumbnailUrl || null,
      isPrimary: insertPhoto.isPrimary || false,
    };
    this.photos.set(id, photo);
    return photo;
  }

  // Cost breakdown methods
  async getCostBreakdownByClaim(claimId: string): Promise<CostBreakdown[]> {
    return Array.from(this.costBreakdowns.values()).filter(
      (item) => item.claimId === claimId,
    );
  }

  async createCostBreakdown(insertCostBreakdown: InsertCostBreakdown): Promise<CostBreakdown> {
    const id = randomUUID();
    const costBreakdown: CostBreakdown = { 
      ...insertCostBreakdown, 
      id,
      hours: insertCostBreakdown.hours || null,
      rate: insertCostBreakdown.rate || null,
    };
    this.costBreakdowns.set(id, costBreakdown);
    return costBreakdown;
  }

  // Audit log methods
  async getAuditLogByClaim(claimId: string): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values())
      .filter((item) => item.claimId === claimId)
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }

  async createAuditLog(insertAuditLog: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const auditLog: AuditLog = { 
      ...insertAuditLog, 
      id,
      timestamp: new Date(),
      metadata: insertAuditLog.metadata || {},
      performedBy: insertAuditLog.performedBy || null,
    };
    this.auditLogs.set(id, auditLog);
    return auditLog;
  }
}

export const storage = new MemStorage();
