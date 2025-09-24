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

  // Batch approve high confidence claims
  app.post("/api/claims/batch-approve", async (req, res) => {
    try {
      const { confidence = "high" } = req.body;

      // Get all pending claims with the specified confidence level
      const allClaims = await storage.getAllClaims();
      const highConfidenceClaims = allClaims.filter(
        claim => claim.status === "pending_review" && claim.aiConfidence === confidence
      );

      const approvedClaims = [];

      // Approve each high confidence claim
      for (const claim of highConfidenceClaims) {
        const updatedClaim = await storage.updateClaim(claim.id, {
          status: "approved",
          agentNotes: `Auto-approved via batch approval for ${confidence} confidence claims`,
        });

        if (updatedClaim) {
          approvedClaims.push(updatedClaim);

          // Create audit log entry for each
          await storage.createAuditLog({
            claimId: claim.id,
            action: "claim_batch_approved",
            description: `Claim batch-approved for ${confidence} confidence`,
            performedBy: "Sarah Johnson",
            metadata: {
              confidence,
              batchSize: highConfidenceClaims.length,
              estimateAmount: updatedClaim.totalEstimate
            },
          });
        }
      }

      res.json({
        message: `Batch approved ${approvedClaims.length} ${confidence} confidence claims`,
        approvedClaims: approvedClaims.length,
        confidence,
        claims: approvedClaims
      });
    } catch (error) {
      console.error("Error batch approving claims:", error);
      res.status(500).json({ error: "Failed to batch approve claims" });
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

  // Reset data to initial state
  app.post("/api/reset-data", async (req, res) => {
    try {
      console.log("Reset data endpoint called");
      const claimsBefore = await storage.getAllClaims();
      console.log(`Claims before reset: ${claimsBefore.length}, high confidence pending: ${claimsBefore.filter(c => c.aiConfidence === 'high' && c.status === 'pending_review').length}`);

      await storage.resetToInitialData();

      const claimsAfter = await storage.getAllClaims();
      console.log(`Claims after reset: ${claimsAfter.length}, high confidence pending: ${claimsAfter.filter(c => c.aiConfidence === 'high' && c.status === 'pending_review').length}`);

      res.json({ message: "Data reset to initial state successfully" });
    } catch (error) {
      console.error("Error resetting data:", error);
      res.status(500).json({ error: "Failed to reset data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
