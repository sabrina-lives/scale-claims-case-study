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
    const claim2Id = randomUUID();
    const claim3Id = randomUUID();
    const claim4Id = randomUUID();
    const claim5Id = randomUUID();
    const claim6Id = randomUUID();
    const claim7Id = randomUUID();
    const claim8Id = randomUUID();
    // Approved claims
    const approvedClaim1Id = randomUUID();
    const approvedClaim2Id = randomUUID();
    const approvedClaim3Id = randomUUID();
    
    // Sample claims
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
      aiConfidence: "low", // high priority -> low confidence
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      totalEstimate: "2847.00",
      agentNotes: null,
      assignedAgent: "Sarah Johnson",
    };
    
    const claim2: Claim = {
      id: claim2Id,
      claimNumber: "CLM-2024-001952",
      policyholderName: "Jennifer Chen",
      vehicleInfo: "2021 Honda Accord",
      vin: "1HGCV1F30MA123789",
      incidentDate: new Date("2024-03-20"),
      incidentDescription: "Rear-end collision on highway",
      status: "pending_review",
      priority: "medium",
      aiConfidence: "medium", // medium priority -> medium confidence
      submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      totalEstimate: "4235.00",
      agentNotes: null,
      assignedAgent: "Sarah Johnson",
    };
    
    const claim3: Claim = {
      id: claim3Id,
      claimNumber: "CLM-2024-002103",
      policyholderName: "David Thompson",
      vehicleInfo: "2020 Ford F-150",
      vin: "1FTFW1ET5LFA12345",
      incidentDate: new Date("2024-03-18"),
      incidentDescription: "Side impact from intersection",
      status: "pending_review",
      priority: "high",
      aiConfidence: "low", // high priority -> low confidence
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      totalEstimate: "6780.00",
      agentNotes: null,
      assignedAgent: "Sarah Johnson",
    };
    
    const claim4: Claim = {
      id: claim4Id,
      claimNumber: "CLM-2024-002156",
      policyholderName: "Amanda Martinez",
      vehicleInfo: "2023 Tesla Model 3",
      vin: "5YJ3E1EA0PF123456",
      incidentDate: new Date("2024-03-22"),
      incidentDescription: "Door damage in parking garage",
      status: "pending_review",
      priority: "low",
      aiConfidence: "high", // low priority -> high confidence
      submittedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      totalEstimate: "1240.00",
      agentNotes: null,
      assignedAgent: "Sarah Johnson",
    };
    
    const claim5: Claim = {
      id: claim5Id,
      claimNumber: "CLM-2024-002201",
      policyholderName: "Robert Williams",
      vehicleInfo: "2019 BMW X5",
      vin: "5UXCR6C05KL123456",
      incidentDate: new Date("2024-03-19"),
      incidentDescription: "Vandalism damage to multiple panels",
      status: "pending_review",
      priority: "medium",
      aiConfidence: "medium", // medium priority -> medium confidence
      submittedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      totalEstimate: "3450.00",
      agentNotes: null,
      assignedAgent: "Sarah Johnson",
    };
    
    const claim6: Claim = {
      id: claim6Id,
      claimNumber: "CLM-2024-002245",
      policyholderName: "Lisa Park",
      vehicleInfo: "2022 Subaru Outback",
      vin: "4S4BTANC2N3123456",
      incidentDate: new Date("2024-03-21"),
      incidentDescription: "Hail damage to roof and hood",
      status: "pending_review",
      priority: "high",
      aiConfidence: "low", // high priority -> low confidence
      submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      totalEstimate: "5680.00",
      agentNotes: null,
      assignedAgent: "Sarah Johnson",
    };
    
    const claim7: Claim = {
      id: claim7Id,
      claimNumber: "CLM-2024-002289",
      policyholderName: "Carlos Santos",
      vehicleInfo: "2021 Chevrolet Silverado",
      vin: "1GCUYBE0XMZ123456",
      incidentDate: new Date("2024-03-23"),
      incidentDescription: "Minor fender bender",
      status: "pending_review",
      priority: "low",
      aiConfidence: "high", // low priority -> high confidence
      submittedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      totalEstimate: "980.00",
      agentNotes: null,
      assignedAgent: "Sarah Johnson",
    };
    
    const claim8: Claim = {
      id: claim8Id,
      claimNumber: "CLM-2024-002301",
      policyholderName: "Emily Davis",
      vehicleInfo: "2020 Audi A4",
      vin: "WAUENAF40LA123456",
      incidentDate: new Date("2024-03-22"),
      incidentDescription: "Shopping cart damage to door",
      status: "pending_review",
      priority: "low",
      aiConfidence: "high", // low priority -> high confidence
      submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      totalEstimate: "750.00",
      agentNotes: null,
      assignedAgent: "Sarah Johnson",
    };
    
    // Approved claims
    const approvedClaim1: Claim = {
      id: approvedClaim1Id,
      claimNumber: "CLM-2024-001756",
      policyholderName: "Mark Johnson",
      vehicleInfo: "2021 Jeep Wrangler",
      vin: "1C4HJXDG5MW123456",
      incidentDate: new Date("2024-03-10"),
      incidentDescription: "Off-road damage to undercarriage",
      status: "pending_review",
      priority: "low",
      aiConfidence: "high", // changed to high confidence for batch testing
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      totalEstimate: "2890.00",
      agentNotes: null,
      assignedAgent: "Sarah Johnson",
    };
    
    const approvedClaim2: Claim = {
      id: approvedClaim2Id,
      claimNumber: "CLM-2024-001623",
      policyholderName: "Rachel Green",
      vehicleInfo: "2022 Mazda CX-5",
      vin: "JM3KFBDM7N0123456",
      incidentDate: new Date("2024-03-08"),
      incidentDescription: "Tree branch damage during storm",
      status: "approved",
      priority: "high",
      aiConfidence: "low", // high priority -> low confidence
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      totalEstimate: "4750.00",
      agentNotes: "Approved - weather related incident confirmed",
      assignedAgent: "Sarah Johnson",
    };
    
    const approvedClaim3: Claim = {
      id: approvedClaim3Id,
      claimNumber: "CLM-2024-001589",
      policyholderName: "James Wilson",
      vehicleInfo: "2019 Nissan Altima",
      vin: "1N4AL3AP5KC123456",
      incidentDate: new Date("2024-03-05"),
      incidentDescription: "Rear bumper replacement needed",
      status: "pending_review",
      priority: "low",
      aiConfidence: "high", // low priority -> high confidence
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      totalEstimate: "1650.00",
      agentNotes: null,
      assignedAgent: "Sarah Johnson",
    };
    
    this.claims.set(sampleClaimId, sampleClaim);
    this.claims.set(claim2Id, claim2);
    this.claims.set(claim3Id, claim3);
    this.claims.set(claim4Id, claim4);
    this.claims.set(claim5Id, claim5);
    this.claims.set(claim6Id, claim6);
    this.claims.set(claim7Id, claim7);
    this.claims.set(claim8Id, claim8);
    this.claims.set(approvedClaim1Id, approvedClaim1);
    this.claims.set(approvedClaim2Id, approvedClaim2);
    this.claims.set(approvedClaim3Id, approvedClaim3);

    // Sample damage items for all claims
    const damageItems: DamageItem[] = [
      // Michael Rodriguez - CLM-2024-001847
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
      // Jennifer Chen - CLM-2024-001952 (rear-end collision)
      {
        id: randomUUID(),
        claimId: claim2Id,
        type: "structural_damage",
        severity: "severe",
        location: "rear_bumper",
        description: "Rear Bumper Crush",
        area: "24\" x 8\"",
        depth: "4\" deep",
        repairType: "Full replacement",
        confidence: "96.00",
        coordinates: { x: 25, y: 70, width: 30, height: 20 },
      },
      {
        id: randomUUID(),
        claimId: claim2Id,
        type: "structural_dent",
        severity: "moderate",
        location: "trunk_lid",
        description: "Trunk Misalignment",
        area: "18\" x 12\"",
        depth: "1.5\" deep",
        repairType: "Panel repair",
        confidence: "91.00",
        coordinates: { x: 30, y: 50, width: 25, height: 15 },
      },
      // David Thompson - CLM-2024-002103 (side impact)
      {
        id: randomUUID(),
        claimId: claim3Id,
        type: "structural_damage",
        severity: "severe",
        location: "driver_door",
        description: "Door Frame Damage",
        area: "36\" x 20\"",
        depth: "6\" deep",
        repairType: "Door replacement",
        confidence: "98.00",
        coordinates: { x: 15, y: 40, width: 35, height: 25 },
      },
      {
        id: randomUUID(),
        claimId: claim3Id,
        type: "paint_damage",
        severity: "moderate",
        location: "side_panel",
        description: "Paint Transfer",
        area: "16\" x 8\"",
        depth: "Surface level",
        repairType: "Paint & refinish",
        confidence: "89.00",
        coordinates: { x: 10, y: 60, width: 20, height: 12 },
      },
      // Amanda Martinez - CLM-2024-002156 (door damage)
      {
        id: randomUUID(),
        claimId: claim4Id,
        type: "surface_dent",
        severity: "minor",
        location: "passenger_door",
        description: "Small Door Ding",
        area: "4\" x 2\"",
        depth: "0.5\" deep",
        repairType: "PDR",
        confidence: "82.00",
        coordinates: { x: 60, y: 45, width: 8, height: 6 },
      },
      // Robert Williams - CLM-2024-002201 (vandalism)
      {
        id: randomUUID(),
        claimId: claim5Id,
        type: "paint_damage",
        severity: "severe",
        location: "hood",
        description: "Keyed Paint Damage",
        area: "20\" x 2\"",
        depth: "Through primer",
        repairType: "Panel refinish",
        confidence: "95.00",
        coordinates: { x: 30, y: 25, width: 25, height: 5 },
      },
      {
        id: randomUUID(),
        claimId: claim5Id,
        type: "paint_damage",
        severity: "moderate",
        location: "side_panel",
        description: "Spray Paint Vandalism",
        area: "14\" x 10\"",
        depth: "Surface level",
        repairType: "Paint removal & refinish",
        confidence: "88.00",
        coordinates: { x: 20, y: 55, width: 18, height: 12 },
      },
      // Lisa Park - CLM-2024-002245 (hail damage)
      {
        id: randomUUID(),
        claimId: claim6Id,
        type: "hail_damage",
        severity: "severe",
        location: "hood",
        description: "Multiple Hail Dents",
        area: "48\" x 32\"",
        depth: "0.25\" average",
        repairType: "Hood replacement",
        confidence: "97.00",
        coordinates: { x: 20, y: 15, width: 40, height: 25 },
      },
      {
        id: randomUUID(),
        claimId: claim6Id,
        type: "hail_damage",
        severity: "moderate",
        location: "roof",
        description: "Roof Hail Damage",
        area: "60\" x 48\"",
        depth: "0.2\" average",
        repairType: "PDR treatment",
        confidence: "93.00",
        coordinates: { x: 15, y: 10, width: 50, height: 30 },
      },
      // Carlos Santos - CLM-2024-002289 (fender bender)
      {
        id: randomUUID(),
        claimId: claim7Id,
        type: "paint_scratches",
        severity: "minor",
        location: "front_bumper",
        description: "Minor Bumper Scuff",
        area: "6\" x 3\"",
        depth: "Surface only",
        repairType: "Touch-up paint",
        confidence: "79.00",
        coordinates: { x: 40, y: 65, width: 12, height: 8 },
      },
      // Emily Davis - CLM-2024-002301 (shopping cart)
      {
        id: randomUUID(),
        claimId: claim8Id,
        type: "surface_dent",
        severity: "minor",
        location: "rear_door",
        description: "Shopping Cart Ding",
        area: "3\" x 2\"",
        depth: "0.3\" deep",
        repairType: "PDR",
        confidence: "84.00",
        coordinates: { x: 65, y: 50, width: 6, height: 5 },
      },
    ];

    damageItems.forEach(item => this.damageItems.set(item.id, item));

    // Sample photos for all claims - realistic car damage images using reliable CDN
    const photos: Photo[] = [
      // Michael Rodriguez - CLM-2024-001847 (front bumper collision)
      {
        id: randomUUID(),
        claimId: sampleClaimId,
        category: "front_bumper",
        url: "/assets/generated_images/damaged_car_front_bumper_05746b19.png",
        thumbnailUrl: "/assets/generated_images/damaged_car_front_bumper_05746b19.png",
        isPrimary: true,
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        claimId: sampleClaimId,
        category: "front_bumper",
        url: "/assets/generated_images/car_bumper_damage_angle_a5e4f382.png",
        thumbnailUrl: "/assets/generated_images/car_bumper_damage_angle_a5e4f382.png",
        isPrimary: false,
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      // Jennifer Chen - CLM-2024-001952 (rear-end collision)
      {
        id: randomUUID(),
        claimId: claim2Id,
        category: "rear_bumper",
        url: "/assets/generated_images/car_side_panel_scuff_ca26bc00.png",
        thumbnailUrl: "/assets/generated_images/car_side_panel_scuff_ca26bc00.png",
        isPrimary: true,
        uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        claimId: claim2Id,
        category: "trunk_area",
        url: "/assets/generated_images/damaged_car_front_bumper_05746b19.png",
        thumbnailUrl: "/assets/generated_images/damaged_car_front_bumper_05746b19.png",
        isPrimary: false,
        uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      // David Thompson - CLM-2024-002103 (side impact)
      {
        id: randomUUID(),
        claimId: claim3Id,
        category: "side_panel",
        url: "/assets/generated_images/car_bumper_damage_angle_a5e4f382.png",
        thumbnailUrl: "/assets/generated_images/car_bumper_damage_angle_a5e4f382.png",
        isPrimary: true,
        uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      // Amanda Martinez - CLM-2024-002156 (door ding)
      {
        id: randomUUID(),
        claimId: claim4Id,
        category: "door_panel",
        url: "/assets/generated_images/car_side_panel_scuff_ca26bc00.png",
        thumbnailUrl: "/assets/generated_images/car_side_panel_scuff_ca26bc00.png",
        isPrimary: true,
        uploadedAt: new Date(Date.now() - 30 * 60 * 1000),
      },
      // Robert Williams - CLM-2024-002201 (vandalism)
      {
        id: randomUUID(),
        claimId: claim5Id,
        category: "hood",
        url: "/assets/generated_images/damaged_car_front_bumper_05746b19.png",
        thumbnailUrl: "/assets/generated_images/damaged_car_front_bumper_05746b19.png",
        isPrimary: true,
        uploadedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        claimId: claim5Id,
        category: "side_panel",
        url: "/assets/generated_images/car_bumper_damage_angle_a5e4f382.png",
        thumbnailUrl: "/assets/generated_images/car_bumper_damage_angle_a5e4f382.png",
        isPrimary: false,
        uploadedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },
      // Lisa Park - CLM-2024-002245 (hail damage)
      {
        id: randomUUID(),
        claimId: claim6Id,
        category: "hood",
        url: "/assets/generated_images/car_side_panel_scuff_ca26bc00.png",
        thumbnailUrl: "/assets/generated_images/car_side_panel_scuff_ca26bc00.png",
        isPrimary: true,
        uploadedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        claimId: claim6Id,
        category: "roof",
        url: "/assets/generated_images/damaged_car_front_bumper_05746b19.png",
        thumbnailUrl: "/assets/generated_images/damaged_car_front_bumper_05746b19.png",
        isPrimary: false,
        uploadedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      // Carlos Santos - CLM-2024-002289 (minor fender bender)
      {
        id: randomUUID(),
        claimId: claim7Id,
        category: "front_bumper",
        url: "/assets/generated_images/car_bumper_damage_angle_a5e4f382.png",
        thumbnailUrl: "/assets/generated_images/car_bumper_damage_angle_a5e4f382.png",
        isPrimary: true,
        uploadedAt: new Date(Date.now() - 45 * 60 * 1000),
      },
      // Emily Davis - CLM-2024-002301 (shopping cart damage)
      {
        id: randomUUID(),
        claimId: claim8Id,
        category: "door_panel",
        url: "/assets/generated_images/car_side_panel_scuff_ca26bc00.png",
        thumbnailUrl: "/assets/generated_images/car_side_panel_scuff_ca26bc00.png",
        isPrimary: true,
        uploadedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      // Mark Johnson - CLM-2024-001756 (approved claim - off-road damage)
      {
        id: randomUUID(),
        claimId: approvedClaim1Id,
        category: "undercarriage",
        url: "/assets/generated_images/damaged_car_front_bumper_05746b19.png",
        thumbnailUrl: "/assets/generated_images/damaged_car_front_bumper_05746b19.png",
        isPrimary: true,
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        claimId: approvedClaim1Id,
        category: "undercarriage",
        url: "/assets/generated_images/car_bumper_damage_angle_a5e4f382.png",
        thumbnailUrl: "/assets/generated_images/car_bumper_damage_angle_a5e4f382.png",
        isPrimary: false,
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      // Rachel Green - CLM-2024-001623 (approved claim - tree branch damage)
      {
        id: randomUUID(),
        claimId: approvedClaim2Id,
        category: "roof_panel",
        url: "/assets/generated_images/car_side_panel_scuff_ca26bc00.png",
        thumbnailUrl: "/assets/generated_images/car_side_panel_scuff_ca26bc00.png",
        isPrimary: true,
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        claimId: approvedClaim2Id,
        category: "windshield",
        url: "/assets/generated_images/damaged_car_front_bumper_05746b19.png",
        thumbnailUrl: "/assets/generated_images/damaged_car_front_bumper_05746b19.png",
        isPrimary: false,
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      // James Wilson - CLM-2024-001589 (approved claim - rear bumper replacement)
      {
        id: randomUUID(),
        claimId: approvedClaim3Id,
        category: "rear_bumper",
        url: "/assets/generated_images/car_bumper_damage_angle_a5e4f382.png",
        thumbnailUrl: "/assets/generated_images/car_bumper_damage_angle_a5e4f382.png",
        isPrimary: true,
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        claimId: approvedClaim3Id,
        category: "rear_bumper",
        url: "/assets/generated_images/car_side_panel_scuff_ca26bc00.png",
        thumbnailUrl: "/assets/generated_images/car_side_panel_scuff_ca26bc00.png",
        isPrimary: false,
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ];

    photos.forEach(photo => this.photos.set(photo.id, photo));

    // Cost breakdown for all claims
    const costItems: CostBreakdown[] = [
      // Michael Rodriguez - CLM-2024-001847
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
      // Jennifer Chen - CLM-2024-001952 (rear-end collision)
      {
        id: randomUUID(),
        claimId: claim2Id,
        category: "labor",
        description: "Labor",
        amount: "1845.00",
        hours: "21.70",
        rate: "85.00",
      },
      {
        id: randomUUID(),
        claimId: claim2Id,
        category: "parts",
        description: "Rear bumper assembly",
        amount: "1285.00",
        hours: null,
        rate: null,
      },
      {
        id: randomUUID(),
        claimId: claim2Id,
        category: "parts",
        description: "Trunk lid repair",
        amount: "685.00",
        hours: null,
        rate: null,
      },
      // David Thompson - CLM-2024-002103 (side impact)
      {
        id: randomUUID(),
        claimId: claim3Id,
        category: "labor",
        description: "Labor",
        amount: "2125.00",
        hours: "25.00",
        rate: "85.00",
      },
      {
        id: randomUUID(),
        claimId: claim3Id,
        category: "parts",
        description: "Driver door replacement",
        amount: "1850.00",
        hours: null,
        rate: null,
      },
      {
        id: randomUUID(),
        claimId: claim3Id,
        category: "paint",
        description: "Paint & Materials",
        amount: "485.00",
        hours: null,
        rate: null,
      },
      // Amanda Martinez - CLM-2024-002156 (door ding)
      {
        id: randomUUID(),
        claimId: claim4Id,
        category: "labor",
        description: "PDR Labor",
        amount: "185.00",
        hours: "2.50",
        rate: "74.00",
      },
      // Robert Williams - CLM-2024-002201 (vandalism)
      {
        id: randomUUID(),
        claimId: claim5Id,
        category: "labor",
        description: "Labor",
        amount: "1285.00",
        hours: "15.12",
        rate: "85.00",
      },
      {
        id: randomUUID(),
        claimId: claim5Id,
        category: "paint",
        description: "Hood refinish",
        amount: "985.00",
        hours: null,
        rate: null,
      },
      {
        id: randomUUID(),
        claimId: claim5Id,
        category: "paint",
        description: "Side panel refinish",
        amount: "1180.00",
        hours: null,
        rate: null,
      },
      // Lisa Park - CLM-2024-002245 (hail damage)
      {
        id: randomUUID(),
        claimId: claim6Id,
        category: "labor",
        description: "Labor",
        amount: "2185.00",
        hours: "25.70",
        rate: "85.00",
      },
      {
        id: randomUUID(),
        claimId: claim6Id,
        category: "parts",
        description: "Hood replacement",
        amount: "2450.00",
        hours: null,
        rate: null,
      },
      {
        id: randomUUID(),
        claimId: claim6Id,
        category: "labor",
        description: "PDR roof treatment",
        amount: "1045.00",
        hours: "14.50",
        rate: "72.00",
      },
      // Carlos Santos - CLM-2024-002289 (minor fender bender)
      {
        id: randomUUID(),
        claimId: claim7Id,
        category: "paint",
        description: "Touch-up paint",
        amount: "185.00",
        hours: null,
        rate: null,
      },
      {
        id: randomUUID(),
        claimId: claim7Id,
        category: "labor",
        description: "Labor",
        amount: "795.00",
        hours: "9.35",
        rate: "85.00",
      },
      // Emily Davis - CLM-2024-002301 (shopping cart)
      {
        id: randomUUID(),
        claimId: claim8Id,
        category: "labor",
        description: "PDR Labor",
        amount: "155.00",
        hours: "2.10",
        rate: "74.00",
      },
      {
        id: randomUUID(),
        claimId: claim8Id,
        category: "supplies",
        description: "Shop Supplies",
        amount: "95.00",
        hours: null,
        rate: null,
      },
      // Mark Johnson - CLM-2024-001756 (approved - off-road damage) - $2,890
      {
        id: randomUUID(),
        claimId: approvedClaim1Id,
        category: "labor",
        description: "Labor",
        amount: "1360.00",
        hours: "16.00",
        rate: "85.00",
      },
      {
        id: randomUUID(),
        claimId: approvedClaim1Id,
        category: "parts",
        description: "Undercarriage protection panel",
        amount: "1200.00",
        hours: null,
        rate: null,
      },
      {
        id: randomUUID(),
        claimId: approvedClaim1Id,
        category: "parts",
        description: "Skid plate assembly",
        amount: "230.00",
        hours: null,
        rate: null,
      },
      {
        id: randomUUID(),
        claimId: approvedClaim1Id,
        category: "supplies",
        description: "Shop Supplies",
        amount: "100.00",
        hours: null,
        rate: null,
      },
      // Rachel Green - CLM-2024-001623 (approved - tree branch damage) - $4,750
      {
        id: randomUUID(),
        claimId: approvedClaim2Id,
        category: "labor",
        description: "Labor",
        amount: "2210.00",
        hours: "26.00",
        rate: "85.00",
      },
      {
        id: randomUUID(),
        claimId: approvedClaim2Id,
        category: "parts",
        description: "Roof panel replacement",
        amount: "1800.00",
        hours: null,
        rate: null,
      },
      {
        id: randomUUID(),
        claimId: approvedClaim2Id,
        category: "parts",
        description: "Windshield replacement",
        amount: "450.00",
        hours: null,
        rate: null,
      },
      {
        id: randomUUID(),
        claimId: approvedClaim2Id,
        category: "paint",
        description: "Paint & Materials",
        amount: "180.00",
        hours: null,
        rate: null,
      },
      {
        id: randomUUID(),
        claimId: approvedClaim2Id,
        category: "supplies",
        description: "Shop Supplies",
        amount: "110.00",
        hours: null,
        rate: null,
      },
      // James Wilson - CLM-2024-001589 (approved - rear bumper replacement) - $1,650
      {
        id: randomUUID(),
        claimId: approvedClaim3Id,
        category: "labor",
        description: "Labor",
        amount: "765.00",
        hours: "9.00",
        rate: "85.00",
      },
      {
        id: randomUUID(),
        claimId: approvedClaim3Id,
        category: "parts",
        description: "Rear bumper assembly",
        amount: "650.00",
        hours: null,
        rate: null,
      },
      {
        id: randomUUID(),
        claimId: approvedClaim3Id,
        category: "paint",
        description: "Paint & Materials",
        amount: "160.00",
        hours: null,
        rate: null,
      },
      {
        id: randomUUID(),
        claimId: approvedClaim3Id,
        category: "supplies",
        description: "Shop Supplies",
        amount: "75.00",
        hours: null,
        rate: null,
      },
    ];

    costItems.forEach(item => this.costBreakdowns.set(item.id, item));

    // Audit logs for all claims
    const auditItems: AuditLog[] = [
      // Michael Rodriguez - CLM-2024-001847
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
        metadata: { photoCount: 2, processedByCV: true },
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
      // Jennifer Chen - CLM-2024-001952
      {
        id: randomUUID(),
        claimId: claim2Id,
        action: "ai_analysis_completed",
        description: "AI Analysis Completed",
        performedBy: "system",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        metadata: { confidence: "93%", areasIdentified: 2 },
      },
      {
        id: randomUUID(),
        claimId: claim2Id,
        action: "photos_uploaded",
        description: "Photos Uploaded",
        performedBy: "system",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        metadata: { photoCount: 2, processedByCV: true },
      },
      {
        id: randomUUID(),
        claimId: claim2Id,
        action: "claim_submitted",
        description: "Claim Submitted",
        performedBy: "Jennifer Chen",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        metadata: {},
      },
      // David Thompson - CLM-2024-002103
      {
        id: randomUUID(),
        claimId: claim3Id,
        action: "ai_analysis_completed",
        description: "AI Analysis Completed",
        performedBy: "system",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        metadata: { confidence: "93%", areasIdentified: 2 },
      },
      {
        id: randomUUID(),
        claimId: claim3Id,
        action: "photos_uploaded",
        description: "Photos Uploaded",
        performedBy: "system",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        metadata: { photoCount: 1, processedByCV: true },
      },
      {
        id: randomUUID(),
        claimId: claim3Id,
        action: "claim_submitted",
        description: "Claim Submitted",
        performedBy: "David Thompson",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        metadata: {},
      },
      // Amanda Martinez - CLM-2024-002156
      {
        id: randomUUID(),
        claimId: claim4Id,
        action: "ai_analysis_completed",
        description: "AI Analysis Completed",
        performedBy: "system",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        metadata: { confidence: "82%", areasIdentified: 1 },
      },
      {
        id: randomUUID(),
        claimId: claim4Id,
        action: "photos_uploaded",
        description: "Photos Uploaded",
        performedBy: "system",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        metadata: { photoCount: 1, processedByCV: true },
      },
      {
        id: randomUUID(),
        claimId: claim4Id,
        action: "claim_submitted",
        description: "Claim Submitted",
        performedBy: "Amanda Martinez",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        metadata: {},
      },
      // Robert Williams - CLM-2024-002201
      {
        id: randomUUID(),
        claimId: claim5Id,
        action: "ai_analysis_completed",
        description: "AI Analysis Completed",
        performedBy: "system",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        metadata: { confidence: "91%", areasIdentified: 2 },
      },
      {
        id: randomUUID(),
        claimId: claim5Id,
        action: "photos_uploaded",
        description: "Photos Uploaded",
        performedBy: "system",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        metadata: { photoCount: 2, processedByCV: true },
      },
      {
        id: randomUUID(),
        claimId: claim5Id,
        action: "claim_submitted",
        description: "Claim Submitted",
        performedBy: "Robert Williams",
        timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000),
        metadata: {},
      },
      // Lisa Park - CLM-2024-002245
      {
        id: randomUUID(),
        claimId: claim6Id,
        action: "ai_analysis_completed",
        description: "AI Analysis Completed",
        performedBy: "system",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        metadata: { confidence: "95%", areasIdentified: 2 },
      },
      {
        id: randomUUID(),
        claimId: claim6Id,
        action: "photos_uploaded",
        description: "Photos Uploaded",
        performedBy: "system",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        metadata: { photoCount: 2, processedByCV: true },
      },
      {
        id: randomUUID(),
        claimId: claim6Id,
        action: "claim_submitted",
        description: "Claim Submitted",
        performedBy: "Lisa Park",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        metadata: {},
      },
      // Carlos Santos - CLM-2024-002289
      {
        id: randomUUID(),
        claimId: claim7Id,
        action: "ai_analysis_completed",
        description: "AI Analysis Completed",
        performedBy: "system",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        metadata: { confidence: "79%", areasIdentified: 1 },
      },
      {
        id: randomUUID(),
        claimId: claim7Id,
        action: "photos_uploaded",
        description: "Photos Uploaded",
        performedBy: "system",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        metadata: { photoCount: 1, processedByCV: true },
      },
      {
        id: randomUUID(),
        claimId: claim7Id,
        action: "claim_submitted",
        description: "Claim Submitted",
        performedBy: "Carlos Santos",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        metadata: {},
      },
      // Emily Davis - CLM-2024-002301
      {
        id: randomUUID(),
        claimId: claim8Id,
        action: "ai_analysis_completed",
        description: "AI Analysis Completed",
        performedBy: "system",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        metadata: { confidence: "84%", areasIdentified: 1 },
      },
      {
        id: randomUUID(),
        claimId: claim8Id,
        action: "photos_uploaded",
        description: "Photos Uploaded",
        performedBy: "system",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        metadata: { photoCount: 1, processedByCV: true },
      },
      {
        id: randomUUID(),
        claimId: claim8Id,
        action: "claim_submitted",
        description: "Claim Submitted",
        performedBy: "Emily Davis",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
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
