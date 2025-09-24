import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Eye, FileText } from "lucide-react";
import type { Claim, CostBreakdown, DamageItem, Photo } from "@shared/schema";
import PhotoViewer from "./photo-viewer";
import DamageAnalysis from "./damage-analysis";

interface RepairDetailsProps {
  claim: Claim;
  costBreakdown: CostBreakdown[];
  totalEstimate: number;
  damageItems: DamageItem[];
  photos: Photo[];
  primaryPhoto?: Photo;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function RepairDetails({
  claim,
  costBreakdown,
  totalEstimate,
  damageItems,
  photos,
  primaryPhoto,
  categories,
  selectedCategory,
  onCategoryChange
}: RepairDetailsProps) {
  const [showPhotoAnalysis, setShowPhotoAnalysis] = useState(false);

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
    <div className="space-y-4">
      {/* Approved Repair Request */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold mb-3">Approved Repair Request</h3>

        {/* Request Summary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-800">Claim Approved by Agent</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Total: {formatCurrency(totalEstimate)}
            </Badge>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Ready for repair shop assignment and scheduling
          </p>
        </div>

        {/* Repair Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Approved Repair Items:</h4>
          {costBreakdown.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md"
            >
              <div className="flex-1">
                <div className="font-medium capitalize text-sm text-gray-900">
                  {item.category}
                </div>
                <div className="text-xs text-gray-600">
                  {getDetailText(item)}
                </div>
              </div>
              <span className="font-medium text-sm text-gray-900">
                {formatCurrency(item.amount)}
              </span>
            </div>
          ))}
        </div>

        {/* Agent Notes */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-sm text-blue-800 mb-2">Agent Notes:</h4>
          <p className="text-sm text-blue-700">
            "Damage assessment completed. Vehicle requires front bumper replacement and paint work.
            Estimated completion time: 3-5 business days. Customer has been notified of approval."
          </p>
        </div>
      </div>

      {/* Photo and Damage Analysis (Collapsible) */}
      <Collapsible open={showPhotoAnalysis} onOpenChange={setShowPhotoAnalysis}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            data-testid="toggle-photo-analysis"
          >
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>View Photos & Damage Analysis</span>
            </div>
            {showPhotoAnalysis ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          <PhotoViewer
            photos={photos}
            primaryPhoto={primaryPhoto}
            damageItems={damageItems}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            isApproved={true}
          />
          <DamageAnalysis damageItems={damageItems} claim={claim} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}