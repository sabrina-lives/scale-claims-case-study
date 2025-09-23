import { Badge } from "@/components/ui/badge";
import type { CostBreakdown } from "@shared/schema";

interface CostEstimationProps {
  costBreakdown: CostBreakdown[];
  totalEstimate: number;
}

export default function CostEstimation({ costBreakdown, totalEstimate }: CostEstimationProps) {
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
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Repair Cost Estimation</h3>
      
      {/* Total Estimate */}
      <div className="bg-accent rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Estimate</span>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground" data-testid="text-total-estimate">
              {formatCurrency(totalEstimate)}
            </div>
            <div className="text-sm text-muted-foreground">±$125 range</div>
          </div>
        </div>
      </div>
      
      {/* Cost Breakdown */}
      <div className="space-y-3">
        {costBreakdown.map((item, index) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between py-2 border-b border-border"
            data-testid={`cost-item-${index}`}
          >
            <div>
              <div className="font-medium capitalize" data-testid={`text-cost-category-${index}`}>
                {item.category}
              </div>
              <div className="text-sm text-muted-foreground" data-testid={`text-cost-detail-${index}`}>
                {getDetailText(item)}
              </div>
            </div>
            <span className="font-medium" data-testid={`text-cost-amount-${index}`}>
              {formatCurrency(item.amount)}
            </span>
          </div>
        ))}
      </div>
      
      {/* Data Sources */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-2">Data Sources:</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" data-testid="badge-source-mitchell">Mitchell Database</Badge>
          <Badge variant="secondary" data-testid="badge-source-market">Local Market</Badge>
          <Badge variant="secondary" data-testid="badge-source-oem">OEM Pricing</Badge>
        </div>
      </div>
    </div>
  );
}
