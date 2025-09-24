import { Car, ClipboardList, CheckCircle2, Clock, BarChart3, User, Settings, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Claim } from "@shared/schema";
import { useState, useEffect } from "react";

export type UserRole = "claims_agent" | "senior_adjuster";

interface SidebarProps {
  userRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

export default function Sidebar({ userRole = "claims_agent", onRoleChange }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Fetch all claims
  const { data: claims = [] } = useQuery<Claim[]>({
    queryKey: ["/api/claims"],
  });

  // Batch approve mutation
  const batchApproveMutation = useMutation({
    mutationFn: async (confidence: string) => {
      const response = await fetch('/api/claims/batch-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confidence }),
      });

      if (!response.ok) {
        throw new Error('Failed to batch approve claims');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch claims to update the sidebar
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
      console.log(`Batch approved ${data.approvedClaims} ${data.confidence} confidence claims`);
    },
    onError: (error) => {
      console.error('Error batch approving claims:', error);
    }
  });

  // Reset data mutation
  const resetDataMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/reset-data', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reset data');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch all claims data
      queryClient.invalidateQueries();
      console.log('Data reset to initial state');
    },
    onError: (error) => {
      console.error('Error resetting data:', error);
    }
  });

  // Filter claims by status based on user role
  const activeClaims = userRole === "claims_agent"
    ? claims.filter(claim => claim.status === "pending_review")
    : claims.filter(claim => claim.status === "approved"); // For senior adjuster, "Review Needed" are approved claims

  const approvedClaims = userRole === "claims_agent"
    ? claims.filter(claim => claim.status === "approved")
    : claims.filter(claim => claim.status === "sent_to_shop"); // For senior adjuster, "Approved" are sent to shop

  // Accordion state management
  const [expandedAccordion, setExpandedAccordion] = useState<string>("active-claims");

  // Update accordion based on current claim status
  useEffect(() => {
    const currentClaim = claims.find(claim => location.includes(claim.claimNumber));
    if (currentClaim) {
      const targetAccordion = currentClaim.status === "approved" ? "approved-claims" : "active-claims";
      setExpandedAccordion(targetAccordion);
    }
  }, [location, claims]);

  const handleClaimClick = (claimNumber: string) => {
    setLocation(`/claims/${claimNumber}`);
  };

  const handleBatchApprove = () => {
    batchApproveMutation.mutate("high");
  };

  const handleResetData = () => {
    resetDataMutation.mutate();
  };

  // Count high confidence claims for batch approve button
  const highConfidenceClaims = activeClaims.filter(claim =>
    claim.aiConfidence === "high" && claim.status === "pending_review"
  );

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo and Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Car className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Fave Insurance Co</h1>
            <p className="text-sm text-muted-foreground">Claims Review</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <Accordion 
          type="single" 
          collapsible 
          value={expandedAccordion} 
          onValueChange={setExpandedAccordion}
          className="space-y-2"
        >
          <AccordionItem value="active-claims" className="border-0">
            <AccordionTrigger 
              className="p-3 hover:no-underline bg-accent text-accent-foreground rounded-md hover:bg-accent/90 flex items-center justify-between w-full"
              data-testid="nav-active-claims"
            >
              <div className="flex items-center">
                <ClipboardList className="w-5 h-5 mr-3" />
                <span>{userRole === "claims_agent" ? "Active Claims" : "To Review"}</span>
              </div>
              <Badge className="bg-primary text-primary-foreground">{activeClaims.length}</Badge>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-0">
              <div className="space-y-1 ml-8">
                {activeClaims.map((claim) => {
                  const isActive = location.includes(claim.claimNumber);
                  const getConfidenceColor = (confidence: string) => {
                    switch (confidence) {
                      case "high": return "text-green-600 border-green-200"; // high confidence -> green
                      case "medium": return "text-amber-600 border-amber-200"; // medium confidence -> amber
                      case "low": return "text-red-600 border-red-200"; // low confidence -> red
                      default: return "text-gray-600 border-gray-200";
                    }
                  };
                  
                  return (
                    <Button
                      key={claim.id}
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={`w-full justify-start text-left h-auto py-2 ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                      onClick={() => handleClaimClick(claim.claimNumber)}
                      data-testid={`claim-${claim.claimNumber}`}
                    >
                      <div className="flex flex-col items-start w-full min-w-0">
                        <div className="flex items-center justify-between w-full gap-2">
                          <span className="font-medium text-xs truncate">{claim.claimNumber}</span>
                          <Badge variant="outline" className={`text-xs h-4 px-1 flex-shrink-0 ${getConfidenceColor(claim.aiConfidence || 'medium')}`}>
                            {(claim.aiConfidence || 'medium').charAt(0).toUpperCase() + (claim.aiConfidence || 'medium').slice(1)}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground truncate w-full">
                          {claim.policyholderName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${parseInt(claim.totalEstimate || "0").toLocaleString()}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
              {userRole === "claims_agent" && highConfidenceClaims.length > 0 && (
                <div className="mt-3 ml-8">
                  <Button
                    onClick={handleBatchApprove}
                    disabled={batchApproveMutation.isPending}
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-xs disabled:opacity-50"
                  >
                    {batchApproveMutation.isPending
                      ? `Approving ${highConfidenceClaims.length}...`
                      : `Approve ${highConfidenceClaims.length} High Confidence`}
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="approved-claims" className="border-0">
            <AccordionTrigger 
              className="p-3 hover:no-underline text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-between w-full"
              data-testid="nav-approved"
            >
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-3" />
                <span>Approved</span>
              </div>
              <Badge className="bg-green-500 text-white">{approvedClaims.length}</Badge>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-0">
              <div className="space-y-1 ml-8">
                {approvedClaims.map((claim) => {
                  const isActive = location.includes(claim.claimNumber);
                  
                  return (
                    <Button
                      key={claim.id}
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={`w-full justify-start text-left h-auto py-2 ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                      onClick={() => handleClaimClick(claim.claimNumber)}
                      data-testid={`claim-${claim.claimNumber}`}
                    >
                      <div className="flex flex-col items-start w-full min-w-0">
                        <div className="flex items-center justify-between w-full gap-2">
                          <span className="font-medium text-xs truncate">{claim.claimNumber}</span>
                          <Badge variant="outline" className="text-xs h-4 px-1 flex-shrink-0 text-green-600 border-green-200">
                            Approved
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground truncate w-full">
                          {claim.policyholderName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${parseInt(claim.totalEstimate || "0").toLocaleString()}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Reset Data Button */}
        <Button
          onClick={handleResetData}
          disabled={resetDataMutation.isPending}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          {resetDataMutation.isPending ? "Resetting..." : "Reset Demo Data"}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-3 cursor-pointer hover:bg-accent/50 p-2 rounded-md transition-colors">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm" data-testid="text-agent-name">
                  {userRole === "claims_agent" ? "Sarah Johnson" : "Michael Chen"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userRole === "claims_agent" ? "Claims Agent" : "Senior Adjuster"}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => onRoleChange?.("claims_agent")}
              className={userRole === "claims_agent" ? "bg-accent" : ""}
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">Claims Agent</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onRoleChange?.("senior_adjuster")}
              className={userRole === "senior_adjuster" ? "bg-accent" : ""}
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Michael Chen</p>
                  <p className="text-xs text-muted-foreground">Senior Adjuster</p>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
