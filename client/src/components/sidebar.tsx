import { Car, ClipboardList, CheckCircle2, Clock, BarChart3, User, Settings, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Claim } from "@shared/schema";
import { useState } from "react";

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const [expandedAccordion, setExpandedAccordion] = useState<string>("active-claims");

  // Fetch all claims
  const { data: claims = [] } = useQuery<Claim[]>({
    queryKey: ["/api/claims"],
  });

  // Filter active claims (pending_review status)
  const activeClaims = claims.filter(claim => claim.status === "pending_review");
  
  const handleClaimClick = (claimNumber: string) => {
    setLocation(`/claims/${claimNumber}`);
  };

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
            <AccordionTrigger className="p-0 hover:no-underline">
              <Button
                variant="secondary"
                className="w-full justify-start bg-accent text-accent-foreground"
                data-testid="nav-active-claims"
              >
                <ClipboardList className="w-5 h-5 mr-3" />
                <span>Active Claims</span>
                <Badge className="ml-auto bg-primary text-primary-foreground mr-2">{activeClaims.length}</Badge>
              </Button>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-0">
              <div className="space-y-1 ml-8">
                {activeClaims.map((claim) => {
                  const isActive = location.includes(claim.claimNumber);
                  const getPriorityColor = (priority: string) => {
                    switch (priority) {
                      case "high": return "text-red-600";
                      case "medium": return "text-amber-600";
                      case "low": return "text-green-600";
                      default: return "text-gray-600";
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
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium text-xs">{claim.claimNumber}</span>
                          <Badge variant="outline" className={`text-xs h-4 ${getPriorityColor(claim.priority)}`}>
                            {claim.priority.toUpperCase()}
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
        
        <div className="mt-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            data-testid="nav-approved"
          >
            <CheckCircle2 className="w-5 h-5 mr-3" />
            <span>Approved</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            data-testid="nav-pending"
          >
            <Clock className="w-5 h-5 mr-3" />
            <span>Pending Review</span>
            <Badge className="ml-auto bg-amber-500 text-white">{activeClaims.length}</Badge>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            data-testid="nav-analytics"
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            <span>Analytics</span>
          </Button>
        </div>
      </nav>
      
      {/* User Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm" data-testid="text-agent-name">Sarah Johnson</p>
            <p className="text-xs text-muted-foreground">Claims Agent</p>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
