import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, X } from "lucide-react";
import type { CostBreakdown, Claim } from "@shared/schema";

interface CostEstimationProps {
  costBreakdown: CostBreakdown[];
  totalEstimate: number;
  claim: Claim;
}

export default function CostEstimation({ costBreakdown, totalEstimate, claim }: CostEstimationProps) {
  const [editingCosts, setEditingCosts] = useState(costBreakdown);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveChanges = () => {
    // TODO: Send updated costs to server
    console.log('Saving cost changes:', editingCosts);
    setIsModalOpen(false);
  };

  const updateCostItem = (index: number, field: keyof CostBreakdown, value: string) => {
    const updated = [...editingCosts];
    updated[index] = { ...updated[index], [field]: value };
    setEditingCosts(updated);
  };

  const addCostItem = () => {
    const newItem: CostBreakdown = {
      id: `new-${Date.now()}`,
      category: 'custom',
      description: 'New item',
      amount: '0',
      hours: '',
      rate: ''
    };
    setEditingCosts([...editingCosts, newItem]);
  };

  const removeCostItem = (index: number) => {
    setEditingCosts(editingCosts.filter((_, i) => i !== index));
  };
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const getDetailText = (item: CostBreakdown) => {
    if (item.hours && item.rate) {
      return `${parseFloat(item.hours)} hours @ ${formatCurrency(item.rate)}/hr`;
    }
    return item.description;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Repair Cost Estimation</h3>
        {claim.status !== "approved" && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Edit Repair Cost Estimation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {editingCosts.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-2 gap-3 flex-1">
                        <div>
                          <Label htmlFor={`category-${index}`}>Category</Label>
                          <Input
                            id={`category-${index}`}
                            value={item.category}
                            onChange={(e) => updateCostItem(index, 'category', e.target.value)}
                            className="capitalize"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`amount-${index}`}>Amount</Label>
                          <Input
                            id={`amount-${index}`}
                            type="number"
                            value={item.amount}
                            onChange={(e) => updateCostItem(index, 'amount', e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCostItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={item.description}
                        onChange={(e) => updateCostItem(index, 'description', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`hours-${index}`}>Hours (optional)</Label>
                        <Input
                          id={`hours-${index}`}
                          type="number"
                          value={item.hours || ''}
                          onChange={(e) => updateCostItem(index, 'hours', e.target.value)}
                          placeholder="0.0"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`rate-${index}`}>Rate (optional)</Label>
                        <Input
                          id={`rate-${index}`}
                          type="number"
                          value={item.rate || ''}
                          onChange={(e) => updateCostItem(index, 'rate', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between">
                  <Button variant="outline" onClick={addCostItem}>
                    Add Item
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveChanges}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Total Estimate */}
      <div className="bg-accent rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">Total Estimate</span>
          <div className="text-right">
            <div className="text-xl font-bold text-foreground" data-testid="text-total-estimate">
              {formatCurrency(totalEstimate)}
            </div>
            <div className="text-xs text-muted-foreground">±$125 confidence range</div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2">
        {costBreakdown.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 px-1 rounded hover:bg-accent/50"
            data-testid={`cost-item-${index}`}
          >
            <div className="flex-1">
              <div className="font-medium capitalize text-sm" data-testid={`text-cost-category-${index}`}>
                {item.category}
              </div>
              <div className="text-xs text-muted-foreground" data-testid={`text-cost-detail-${index}`}>
                {getDetailText(item)}
              </div>
            </div>
            <span className="font-medium text-sm" data-testid={`text-cost-amount-${index}`}>
              {formatCurrency(item.amount)}
            </span>
          </div>
        ))}
      </div>

      {/* Data Sources */}
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Data Sources:</p>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs py-0 px-2" data-testid="badge-source-mitchell">Mitchell DB</Badge>
          <Badge variant="outline" className="text-xs py-0 px-2" data-testid="badge-source-market">Local Market</Badge>
          <Badge variant="outline" className="text-xs py-0 px-2" data-testid="badge-source-oem">OEM Pricing</Badge>
        </div>
      </div>
    </div>
  );
}
