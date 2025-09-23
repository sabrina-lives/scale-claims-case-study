import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import PhotoViewer from "@/components/photo-viewer";
import DamageAnalysis from "@/components/damage-analysis";
import CostEstimation from "@/components/cost-estimation";
import ReviewPanel from "@/components/review-panel";
import AuditTrail from "@/components/audit-trail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle2 } from "lucide-react";
import type { Claim, DamageItem, Photo, CostBreakdown, AuditLog } from "@shared/schema";

export default function Dashboard() {
  const { claimNumber } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("front_bumper");
  
  // Use default claim if no claimNumber provided
  const claimNumberToUse = claimNumber || "CLM-2024-001847";
  
  // Fetch claim data
  const { data: claim, isLoading: claimLoading } = useQuery<Claim>({
    queryKey: ["/api/claims/number", claimNumberToUse],
  });

  // Fetch related data
  const { data: damageItems = [] } = useQuery<DamageItem[]>({
    queryKey: ["/api/claims", claim?.id, "damage-items"],
    enabled: !!claim?.id,
  });

  const { data: photos = [] } = useQuery<Photo[]>({
    queryKey: ["/api/claims", claim?.id, "photos"],
    enabled: !!claim?.id,
  });

  const { data: costBreakdown = [] } = useQuery<CostBreakdown[]>({
    queryKey: ["/api/claims", claim?.id, "cost-breakdown"],
    enabled: !!claim?.id,
  });

  const { data: auditLog = [] } = useQuery<AuditLog[]>({
    queryKey: ["/api/claims", claim?.id, "audit-log"],
    enabled: !!claim?.id,
  });

  if (claimLoading || !claim) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading claim data...</p>
        </div>
      </div>
    );
  }

  const photosForCategory = photos.filter(photo => photo.category === selectedCategory);
  const primaryPhoto = photosForCategory.find(photo => photo.isPrimary) || photosForCategory[0];
  
  const totalEstimate = parseFloat(claim.totalEstimate || "0");
  
  // Group photos by category for tabs
  const photoCategories = Array.from(new Set(photos.map(photo => photo.category)));

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold" data-testid="claim-title">
                Claim Review: #{claim.claimNumber}
              </h2>
              <p className="text-muted-foreground">
                Submitted {new Date(claim.submittedAt || "").toLocaleString()} • Priority: {claim.priority}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                AI Analysis Complete
              </Badge>
              <Button className="bg-primary text-primary-foreground" data-testid="button-approve-estimate">
                <Check className="w-4 h-4 mr-2" />
                Approve Estimate
              </Button>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Photo Viewer and Analysis */}
          <div className="flex-1 p-6 overflow-auto">
            {/* Photo Viewer */}
            <PhotoViewer 
              photos={photosForCategory}
              primaryPhoto={primaryPhoto}
              damageItems={damageItems}
              categories={photoCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            
            {/* AI Analysis Results */}
            <DamageAnalysis damageItems={damageItems} />
            
            {/* Case Details */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Case Details</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Policyholder</p>
                  <p className="font-medium" data-testid="text-policyholder">{claim.policyholderName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <p className="font-medium" data-testid="text-vehicle">{claim.vehicleInfo}</p>
                  <p className="text-sm text-muted-foreground">VIN: {claim.vin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Incident Date</p>
                  <p className="font-medium" data-testid="text-incident-date">
                    {new Date(claim.incidentDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">{claim.incidentDescription}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Cost Estimation and Review */}
          <div className="w-96 border-l border-border p-6 overflow-auto">
            <CostEstimation 
              costBreakdown={costBreakdown}
              totalEstimate={totalEstimate}
            />
            
            <ReviewPanel 
              claim={claim}
              totalEstimate={totalEstimate}
            />
            
            <AuditTrail auditLog={auditLog} />
          </div>
        </div>
      </div>
    </div>
  );
}
