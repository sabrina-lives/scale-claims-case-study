import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, X } from "lucide-react";
import type { DamageItem, Claim } from "@shared/schema";

interface DamageAnalysisProps {
  damageItems: DamageItem[];
  claim: Claim;
}

export default function DamageAnalysis({ damageItems, claim }: DamageAnalysisProps) {
  const [editingDamages, setEditingDamages] = useState(damageItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveChanges = () => {
    // TODO: Send updated damages to server
    console.log('Saving damage changes:', editingDamages);
    setIsModalOpen(false);
  };

  const updateDamageItem = (index: number, field: keyof DamageItem, value: string) => {
    const updated = [...editingDamages];
    updated[index] = { ...updated[index], [field]: value };
    setEditingDamages(updated);
  };

  const addDamageItem = () => {
    const newItem: DamageItem = {
      id: `new-${Date.now()}`,
      location: 'custom_area',
      description: 'New damage item',
      severity: 'minor',
      confidence: '85',
      area: '2 sq ft',
      depth: 'surface',
      repairType: 'polish',
      coordinates: { x: 0, y: 0, width: 10, height: 10 }
    };
    setEditingDamages([...editingDamages, newItem]);
  };

  const removeDamageItem = (index: number) => {
    setEditingDamages(editingDamages.filter((_, i) => i !== index));
  };
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
    <div className="bg-card rounded-lg border border-border p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">AI Damage Analysis</h3>
        {claim.status !== "approved" && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Edit className="w-3 h-3 mr-1" />
                Edit Damages
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Edit AI Damage Analysis</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {editingDamages.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-3 gap-3 flex-1">
                        <div>
                          <Label htmlFor={`location-${index}`}>Location</Label>
                          <Input
                            id={`location-${index}`}
                            value={item.location}
                            onChange={(e) => updateDamageItem(index, 'location', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`severity-${index}`}>Severity</Label>
                          <Select
                            value={item.severity}
                            onValueChange={(value) => updateDamageItem(index, 'severity', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minor">Minor</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="severe">Severe</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`confidence-${index}`}>Confidence %</Label>
                          <Input
                            id={`confidence-${index}`}
                            type="number"
                            value={item.confidence}
                            onChange={(e) => updateDamageItem(index, 'confidence', e.target.value)}
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDamageItem(index)}
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
                        onChange={(e) => updateDamageItem(index, 'description', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor={`area-${index}`}>Area</Label>
                        <Input
                          id={`area-${index}`}
                          value={item.area}
                          onChange={(e) => updateDamageItem(index, 'area', e.target.value)}
                          placeholder="e.g., 4 sq ft"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`depth-${index}`}>Depth</Label>
                        <Input
                          id={`depth-${index}`}
                          value={item.depth}
                          onChange={(e) => updateDamageItem(index, 'depth', e.target.value)}
                          placeholder="e.g., surface, medium"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`repair-${index}`}>Repair Type</Label>
                        <Input
                          id={`repair-${index}`}
                          value={item.repairType}
                          onChange={(e) => updateDamageItem(index, 'repairType', e.target.value)}
                          placeholder="e.g., replace, repair"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between">
                  <Button variant="outline" onClick={addDamageItem}>
                    Add Damage Item
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
      <div className="space-y-3">
        {damageItems.map((item, index) => (
          <div
            key={item.id}
            className="border border-border rounded-md p-3"
            data-testid={`damage-item-${index}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start space-x-2">
                <div className={`w-2 h-2 rounded-full mt-1 ${getSeverityColor(item.severity)}`}></div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm" data-testid={`text-damage-title-${index}`}>
                    {formatDescription(item)}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {item.location.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="secondary"
                  className={`${getSeverityTextColor(item.severity)} capitalize text-xs`}
                  data-testid={`badge-severity-${index}`}
                >
                  {item.severity}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Progress
                    value={parseFloat(item.confidence)}
                    className="w-16 h-1.5"
                    data-testid={`progress-confidence-${index}`}
                  />
                  <span className="text-xs font-medium text-muted-foreground min-w-[24px]" data-testid={`text-confidence-${index}`}>
                    {Math.round(parseFloat(item.confidence))}%
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="flex flex-col">
                <span className="text-muted-foreground font-medium">Area</span>
                <span data-testid={`text-area-${index}`}>{item.area}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-medium">Depth</span>
                <span data-testid={`text-depth-${index}`}>{item.depth}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-medium">Repair</span>
                <span data-testid={`text-repair-${index}`}>{item.repairType}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
