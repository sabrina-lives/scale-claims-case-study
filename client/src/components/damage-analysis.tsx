import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { DamageItem } from "@shared/schema";

interface DamageAnalysisProps {
  damageItems: DamageItem[];
}

export default function DamageAnalysis({ damageItems }: DamageAnalysisProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "minor":
        return "bg-green-500";
      case "moderate":
        return "bg-amber-500";
      case "severe":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case "minor":
        return "text-green-600";
      case "moderate":
        return "text-amber-600";
      case "severe":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDescription = (item: DamageItem) => {
    return `${item.location.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${item.description}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold mb-4">AI Damage Analysis</h3>
      <div className="space-y-4">
        {damageItems.map((item, index) => (
          <div 
            key={item.id} 
            className="border border-border rounded-lg p-4"
            data-testid={`damage-item-${index}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getSeverityColor(item.severity)}`}></div>
                <div>
                  <h4 className="font-medium" data-testid={`text-damage-title-${index}`}>
                    {formatDescription(item)}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Detected on {item.location.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant="secondary" 
                  className={`${getSeverityTextColor(item.severity)} capitalize`}
                  data-testid={`badge-severity-${index}`}
                >
                  {item.severity}
                </Badge>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-muted-foreground">Confidence:</span>
                  <Progress 
                    value={parseFloat(item.confidence)} 
                    className="w-20 h-2"
                    data-testid={`progress-confidence-${index}`}
                  />
                  <span className="text-xs font-medium" data-testid={`text-confidence-${index}`}>
                    {Math.round(parseFloat(item.confidence))}%
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Area:</span>
                <span className="ml-2" data-testid={`text-area-${index}`}>{item.area}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Depth:</span>
                <span className="ml-2" data-testid={`text-depth-${index}`}>{item.depth}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Repair:</span>
                <span className="ml-2" data-testid={`text-repair-${index}`}>{item.repairType}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
