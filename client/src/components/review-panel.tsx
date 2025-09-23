import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Users, Calculator } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Claim } from "@shared/schema";

interface ReviewPanelProps {
  claim: Claim;
  totalEstimate: number;
}

export default function ReviewPanel({ claim, totalEstimate }: ReviewPanelProps) {
  const [adjustedEstimate, setAdjustedEstimate] = useState(totalEstimate.toString());
  const [priority, setPriority] = useState(claim.priority);
  const [notes, setNotes] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateClaimMutation = useMutation({
    mutationFn: async (updates: Partial<Claim>) => {
      const response = await apiRequest("PATCH", `/api/claims/${claim.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
      toast({
        title: "Success",
        description: "Claim updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update claim",
        variant: "destructive",
      });
    },
  });

  const approveMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/claims/${claim.id}/approve`, { notes });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
      toast({
        title: "Claim Approved",
        description: `The repair estimate of $${adjustedEstimate} has been approved and will be sent to qualified shops.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to approve claim",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/claims/${claim.id}/reject`, { reason: notes });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
      toast({
        title: "Claim Rejected",
        description: "The claim has been rejected and returned for review.",
        variant: "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reject claim",
        variant: "destructive",
      });
    },
  });

  const handleApprove = () => {
    // Update estimate if changed
    if (parseFloat(adjustedEstimate) !== totalEstimate) {
      updateClaimMutation.mutate({ 
        totalEstimate: parseFloat(adjustedEstimate).toFixed(2),
        priority,
      });
    }
    approveMutation.mutate();
  };

  const handleReject = () => {
    if (!notes.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this claim.",
        variant: "destructive",
      });
      return;
    }
    rejectMutation.mutate();
  };

  const isLoading = updateClaimMutation.isPending || approveMutation.isPending || rejectMutation.isPending;

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Agent Review</h3>
      
      {/* Override Controls */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="estimate-input" className="block text-sm font-medium mb-2">
            Adjust Total Estimate
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="estimate-input"
              type="number"
              value={adjustedEstimate}
              onChange={(e) => setAdjustedEstimate(e.target.value)}
              className="flex-1"
              data-testid="input-estimate"
            />
            <Button variant="secondary" size="sm" data-testid="button-calculator">
              <Calculator className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <Label htmlFor="priority-select" className="block text-sm font-medium mb-2">
            Priority Level
          </Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger id="priority-select" data-testid="select-priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High - Review Required</SelectItem>
              <SelectItem value="medium">Medium - Standard</SelectItem>
              <SelectItem value="low">Low - Auto-approve</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="notes-textarea" className="block text-sm font-medium mb-2">
            Notes & Overrides
          </Label>
          <Textarea
            id="notes-textarea"
            rows={3}
            placeholder="Add notes about your review or overrides..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none"
            data-testid="textarea-notes"
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-2 mt-4">
        <Button 
          className="flex-1 bg-primary text-primary-foreground"
          onClick={handleApprove}
          disabled={isLoading}
          data-testid="button-approve"
        >
          <Check className="w-4 h-4 mr-2" />
          {approveMutation.isPending ? "Approving..." : "Approve"}
        </Button>
        <Button 
          variant="destructive"
          className="flex-1"
          onClick={handleReject}
          disabled={isLoading}
          data-testid="button-reject"
        >
          <X className="w-4 h-4 mr-2" />
          {rejectMutation.isPending ? "Rejecting..." : "Reject"}
        </Button>
      </div>
      <Button 
        variant="secondary"
        className="w-full mt-2"
        disabled={isLoading}
        data-testid="button-senior-review"
      >
        <Users className="w-4 h-4 mr-2" />
        Request Senior Review
      </Button>
    </div>
  );
}
