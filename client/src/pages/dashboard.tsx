import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import Sidebar, { type UserRole } from "@/components/sidebar";
import PhotoViewer from "@/components/photo-viewer";
import DamageAnalysis from "@/components/damage-analysis";
import CostEstimation from "@/components/cost-estimation";
import ReviewPanel from "@/components/review-panel";
import AuditTrail from "@/components/audit-trail";
import RepairDetails from "@/components/repair-details";
import RepairShopSelection from "@/components/repair-shop-selection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle2, Send } from "lucide-react";
import type { Claim, DamageItem, Photo, CostBreakdown, AuditLog } from "@shared/schema";

export default function Dashboard() {
  const { claimNumber } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentDamageItems, setCurrentDamageItems] = useState<DamageItem[]>([]);
  const [userRole, setUserRole] = useState<UserRole>("claims_agent");
  const [selectedShop, setSelectedShop] = useState<string>("");
  const [adjusterNotes, setAdjusterNotes] = useState("");

  // Use default claim if no claimNumber provided
  const claimNumberToUse = claimNumber || "CLM-2024-001847";

  // Initialize query client for invalidations
  const queryClient = useQueryClient();

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

  // Group photos by category for tabs - must be called unconditionally
  const photoCategories = useMemo(() =>
    Array.from(new Set(photos.map(photo => photo.category))),
    [photos]
  );

  // Auto-select first category when photos load - must be called unconditionally
  useEffect(() => {
    // Always auto-select the first category if none is selected and we have categories
    if (photoCategories.length > 0 && (!selectedCategory || !photoCategories.includes(selectedCategory))) {
      setSelectedCategory(photoCategories[0]);
    }
  }, [photoCategories]);

  // Update current damage items when damageItems data changes
  useEffect(() => {
    setCurrentDamageItems(damageItems);
  }, [damageItems]);

  const handleDamageAreasUpdate = (updatedDamageItems: DamageItem[]) => {
    setCurrentDamageItems(updatedDamageItems);
    // TODO: Send to server if needed
    console.log('Dashboard received updated damage items:', updatedDamageItems);
  };

  // Mutation for sending claim to repair shop
  const sendToShopMutation = useMutation({
    mutationFn: async ({ claimId, shopId, notes }: { claimId: string; shopId: string; notes: string }) => {
      const response = await fetch(`/api/claims/${claimId}/send-to-shop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shopId, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to send claim to shop');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch claims data to update the sidebar
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
      queryClient.invalidateQueries({ queryKey: ["/api/claims/number", claimNumberToUse] });
      queryClient.invalidateQueries({ queryKey: ["/api/claims", claim?.id, "audit-log"] });
    },
    onError: (error) => {
      console.error('Error sending claim to shop:', error);
    }
  });

  const handleSendToShop = () => {
    if (!selectedShop || !claim?.id) return;

    sendToShopMutation.mutate({
      claimId: claim.id,
      shopId: selectedShop,
      notes: adjusterNotes
    });
  };

  // Early return AFTER all hooks have been called
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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={userRole} onRoleChange={setUserRole} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold" data-testid="claim-title">
                {userRole === "claims_agent" ? "Claim Review" : "Shop Assignment"}: #{claim.claimNumber}
              </h2>
              <p className="text-muted-foreground">
                Submitted {new Date(claim.submittedAt || "").toLocaleString()} • AI Confidence: {claim.aiConfidence || 'medium'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {userRole === "claims_agent" ? (
                <>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    AI Analysis Complete
                  </Badge>
                  {claim.status === "approved" ? (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Waiting on Adjuster
                    </Badge>
                  ) : (
                    <Button className="bg-primary text-primary-foreground" data-testid="button-approve-estimate">
                      <Check className="w-4 h-4 mr-2" />
                      Approve Estimate
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  onClick={handleSendToShop}
                  disabled={!selectedShop || sendToShopMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendToShopMutation.isPending ? "Sending..." : "Send to Repair Shop"}
                </Button>
              )}
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {userRole === "claims_agent" ? (
            <>
              {/* Claims Agent View - Left Panel - Photo Viewer and Analysis */}
              <div className="flex-1 p-4 overflow-auto">
                {/* Photo Viewer */}
                <PhotoViewer
                  photos={photosForCategory}
                  primaryPhoto={primaryPhoto}
                  damageItems={currentDamageItems}
                  categories={photoCategories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  isApproved={claim.status === "approved"}
                  onDamageAreasUpdate={handleDamageAreasUpdate}
                />

                {/* AI Analysis Results */}
                <DamageAnalysis damageItems={currentDamageItems} claim={claim} />

                {/* Case Details */}
                <div className="bg-card rounded-lg border border-border p-4 mb-4">
                  <h3 className="text-lg font-semibold mb-3">Case Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Policyholder</p>
                      <p className="font-medium text-sm" data-testid="text-policyholder">{claim.policyholderName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Vehicle</p>
                      <p className="font-medium text-sm" data-testid="text-vehicle">{claim.vehicleInfo}</p>
                      <p className="text-xs text-muted-foreground">VIN: {claim.vin}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Incident Date</p>
                      <p className="font-medium text-sm" data-testid="text-incident-date">
                        {new Date(claim.incidentDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{claim.incidentDescription}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Claims Agent View - Right Panel - Cost Estimation and Review */}
              <div className="w-96 border-l border-border p-4 overflow-auto">
                <CostEstimation
                  costBreakdown={costBreakdown}
                  totalEstimate={totalEstimate}
                  claim={claim}
                />

                <ReviewPanel
                  claim={claim}
                  totalEstimate={totalEstimate}
                />

                <AuditTrail auditLog={auditLog} />
              </div>
            </>
          ) : (
            <>
              {/* Senior Adjuster View - Left Panel - Repair Details */}
              <div className="flex-1 p-4 overflow-auto">
                <RepairDetails
                  claim={claim}
                  costBreakdown={costBreakdown}
                  totalEstimate={totalEstimate}
                  damageItems={currentDamageItems}
                  photos={photosForCategory}
                  primaryPhoto={primaryPhoto}
                  categories={photoCategories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              {/* Senior Adjuster View - Right Panel - Repair Shop Selection */}
              <div className="w-96 border-l border-border p-4 overflow-auto">
                <RepairShopSelection
                  claim={claim}
                  totalEstimate={totalEstimate}
                  selectedShop={selectedShop}
                  onShopChange={setSelectedShop}
                  adjusterNotes={adjusterNotes}
                  onNotesChange={setAdjusterNotes}
                />

                <AuditTrail auditLog={auditLog} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
