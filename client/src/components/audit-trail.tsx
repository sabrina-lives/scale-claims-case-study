import { Badge } from "@/components/ui/badge";
import type { AuditLog } from "@shared/schema";

interface AuditTrailProps {
  auditLog: AuditLog[];
}

export default function AuditTrail({ auditLog }: AuditTrailProps) {
  const getActionColor = (action: string) => {
    switch (action) {
      case "ai_analysis_completed":
        return "bg-green-500";
      case "photos_uploaded":
        return "bg-blue-500";
      case "claim_submitted":
        return "bg-gray-400";
      case "claim_approved":
        return "bg-green-500";
      case "claim_rejected":
        return "bg-red-500";
      case "claim_updated":
        return "bg-amber-500";
      default:
        return "bg-gray-400";
    }
  };

  const getRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const getMetadataText = (action: string, metadata: any) => {
    switch (action) {
      case "ai_analysis_completed":
        return `${metadata?.areasIdentified || 0} damage areas identified with ${metadata?.confidence || '0%'} avg confidence`;
      case "photos_uploaded":
        return `${metadata?.photoCount || 0} images processed by computer vision`;
      case "claim_approved":
        return `Estimate: ${metadata?.estimateAmount ? `$${metadata.estimateAmount}` : 'N/A'}`;
      case "claim_rejected":
        return `Reason: ${metadata?.reason || 'No reason provided'}`;
      default:
        return metadata?.description || '';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold mb-4">Audit Trail</h3>
      <div className="space-y-4">
        {auditLog.map((entry, index) => (
          <div 
            key={entry.id} 
            className="flex items-start space-x-3"
            data-testid={`audit-entry-${index}`}
          >
            <div className={`w-2 h-2 rounded-full mt-2 ${getActionColor(entry.action)}`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium" data-testid={`text-audit-action-${index}`}>
                {entry.description}
              </p>
              <p className="text-xs text-muted-foreground" data-testid={`text-audit-metadata-${index}`}>
                {getMetadataText(entry.action, entry.metadata)}
              </p>
              <p className="text-xs text-muted-foreground" data-testid={`text-audit-time-${index}`}>
                {entry.timestamp ? getRelativeTime(new Date(entry.timestamp)) : 'Unknown time'}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Model Info */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground" data-testid="text-model-info">
          Model: Scale-Vision-v2.1 • Accuracy: 94.2%
        </p>
      </div>
    </div>
  );
}
