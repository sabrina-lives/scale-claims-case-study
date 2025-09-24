import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClaimSchema, insertAuditLogSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all claims
  app.get("/api/claims", async (req, res) => {
    try {
      const claims = await storage.getAllClaims();
      res.json(claims);
    } catch (error) {
      console.error("Error fetching claims:", error);
      res.status(500).json({ error: "Failed to fetch claims" });
    }
  });

  // Get specific claim by ID
  app.get("/api/claims/:id", async (req, res) => {
    try {
      const claim = await storage.getClaim(req.params.id);
      if (!claim) {
        return res.status(404).json({ error: "Claim not found" });
      }
      res.json(claim);
    } catch (error) {
      console.error("Error fetching claim:", error);
      res.status(500).json({ error: "Failed to fetch claim" });
    }
  });

  // Get claim by claim number
  app.get("/api/claims/number/:claimNumber", async (req, res) => {
    try {
      const claim = await storage.getClaimByNumber(req.params.claimNumber);
      if (!claim) {
        return res.status(404).json({ error: "Claim not found" });
      }
      res.json(claim);
    } catch (error) {
      console.error("Error fetching claim:", error);
      res.status(500).json({ error: "Failed to fetch claim" });
    }
  });

  // Update claim
  app.patch("/api/claims/:id", async (req, res) => {
    try {
      const updates = req.body;
      const updatedClaim = await storage.updateClaim(req.params.id, updates);
      if (!updatedClaim) {
        return res.status(404).json({ error: "Claim not found" });
      }
      
      // Create audit log entry for claim update
      await storage.createAuditLog({
        claimId: req.params.id,
        action: "claim_updated",
        description: `Claim updated by agent`,
        performedBy: "Sarah Johnson", // In a real app, this would come from auth
        metadata: { updates },
      });
      
      res.json(updatedClaim);
    } catch (error) {
      console.error("Error updating claim:", error);
      res.status(500).json({ error: "Failed to update claim" });
    }
  });

  // Approve claim
  app.post("/api/claims/:id/approve", async (req, res) => {
    try {
      const { notes } = req.body;
      
      const updatedClaim = await storage.updateClaim(req.params.id, {
        status: "approved",
        agentNotes: notes,
      });
      
      if (!updatedClaim) {
        return res.status(404).json({ error: "Claim not found" });
      }
      
      // Create audit log entry
      await storage.createAuditLog({
        claimId: req.params.id,
        action: "claim_approved",
        description: `Claim approved by agent`,
        performedBy: "Sarah Johnson",
        metadata: { notes, estimateAmount: updatedClaim.totalEstimate },
      });
      
      res.json(updatedClaim);
    } catch (error) {
      console.error("Error approving claim:", error);
      res.status(500).json({ error: "Failed to approve claim" });
    }
  });

  // Reject claim
  app.post("/api/claims/:id/reject", async (req, res) => {
    try {
      const { reason } = req.body;

      const updatedClaim = await storage.updateClaim(req.params.id, {
        status: "rejected",
        agentNotes: reason,
      });

      if (!updatedClaim) {
        return res.status(404).json({ error: "Claim not found" });
      }

      // Create audit log entry
      await storage.createAuditLog({
        claimId: req.params.id,
        action: "claim_rejected",
        description: `Claim rejected by agent`,
        performedBy: "Sarah Johnson",
        metadata: { reason },
      });

      res.json(updatedClaim);
    } catch (error) {
      console.error("Error rejecting claim:", error);
      res.status(500).json({ error: "Failed to reject claim" });
    }
  });

  // Send claim to repair shop
  app.post("/api/claims/:id/send-to-shop", async (req, res) => {
    try {
      const { shopId, notes } = req.body;

      const updatedClaim = await storage.updateClaim(req.params.id, {
        status: "sent_to_shop",
        adjusterNotes: notes,
        assignedShopId: shopId,
      });

      if (!updatedClaim) {
        return res.status(404).json({ error: "Claim not found" });
      }

      // Create audit log entry
      await storage.createAuditLog({
        claimId: req.params.id,
        action: "sent_to_shop",
        description: `Claim sent to repair shop (ID: ${shopId})`,
        performedBy: "Michael Chen",
        metadata: { shopId, notes },
      });

      res.json(updatedClaim);
    } catch (error) {
      console.error("Error sending claim to shop:", error);
      res.status(500).json({ error: "Failed to send claim to shop" });
    }
  });

  // Get damage items for a claim
  app.get("/api/claims/:id/damage-items", async (req, res) => {
    try {
      const damageItems = await storage.getDamageItemsByClaim(req.params.id);
      res.json(damageItems);
    } catch (error) {
      console.error("Error fetching damage items:", error);
      res.status(500).json({ error: "Failed to fetch damage items" });
    }
  });

  // Get photos for a claim
  app.get("/api/claims/:id/photos", async (req, res) => {
    try {
      const photos = await storage.getPhotosByClaim(req.params.id);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });

  // Get cost breakdown for a claim
  app.get("/api/claims/:id/cost-breakdown", async (req, res) => {
    try {
      const costBreakdown = await storage.getCostBreakdownByClaim(req.params.id);
      res.json(costBreakdown);
    } catch (error) {
      console.error("Error fetching cost breakdown:", error);
      res.status(500).json({ error: "Failed to fetch cost breakdown" });
    }
  });

  // Get audit log for a claim
  app.get("/api/claims/:id/audit-log", async (req, res) => {
    try {
      const auditLog = await storage.getAuditLogByClaim(req.params.id);
      res.json(auditLog);
    } catch (error) {
      console.error("Error fetching audit log:", error);
      res.status(500).json({ error: "Failed to fetch audit log" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
