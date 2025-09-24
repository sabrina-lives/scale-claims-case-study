import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pen, ZoomIn, Eye } from "lucide-react";
import type { Photo, DamageItem } from "@shared/schema";

interface PhotoViewerProps {
  photos: Photo[];
  primaryPhoto?: Photo;
  damageItems: DamageItem[];
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isApproved?: boolean;
  onDamageAreasUpdate?: (updatedDamageItems: DamageItem[]) => void;
}

export default function PhotoViewer({
  photos,
  primaryPhoto,
  damageItems,
  categories,
  selectedCategory,
  onCategoryChange,
  isApproved = false,
  onDamageAreasUpdate
}: PhotoViewerProps) {
  const [showAIHighlights, setShowAIHighlights] = useState(true);
  const [isAdjustingDamage, setIsAdjustingDamage] = useState(false);
  const [adjustedDamageAreas, setAdjustedDamageAreas] = useState(damageItems);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBox, setCurrentBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

  // Update adjustedDamageAreas when damageItems prop changes
  useEffect(() => {
    setAdjustedDamageAreas(damageItems);
  }, [damageItems]);
  
  // Filter damage items for current category
  const relevantDamageItems = damageItems.filter(item => 
    item.location.includes(selectedCategory.split('_')[0])
  );

  const formatCategoryName = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getCategoryPhotoCount = (category: string) => {
    return photos.filter(photo => photo.category === category).length;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAdjustingDamage) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setIsDrawing(true);
    setStartPoint({ x, y });
    setCurrentBox({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !startPoint) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;

    setCurrentBox({
      x: Math.min(startPoint.x, currentX),
      y: Math.min(startPoint.y, currentY),
      width: Math.abs(currentX - startPoint.x),
      height: Math.abs(currentY - startPoint.y)
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentBox || currentBox.width < 1 || currentBox.height < 1) {
      setIsDrawing(false);
      setCurrentBox(null);
      setStartPoint(null);
      return;
    }

    // Add new damage area or update existing one
    const newDamageItem = {
      id: `adjusted-${Date.now()}`,
      location: selectedCategory,
      description: 'User-adjusted damage area',
      severity: 'moderate' as const,
      confidence: '95',
      area: `${(currentBox.width * currentBox.height / 100).toFixed(1)} sq ft`,
      depth: 'surface',
      repairType: 'repair',
      coordinates: currentBox
    };

    setAdjustedDamageAreas(prev => [...prev, newDamageItem]);
    setIsDrawing(false);
    setCurrentBox(null);
    setStartPoint(null);
  };

  const handleAdjustDamageClick = () => {
    if (isAdjustingDamage) {
      // Save changes when exiting adjustment mode
      if (onDamageAreasUpdate) {
        onDamageAreasUpdate(adjustedDamageAreas);
      }
      console.log('Saving adjusted damage areas:', adjustedDamageAreas);
    } else {
      // Reset adjusted areas to current damage items when entering adjust mode
      setAdjustedDamageAreas(damageItems);
    }

    // Clear any drawing state when toggling modes
    setIsDrawing(false);
    setCurrentBox(null);
    setStartPoint(null);

    setIsAdjustingDamage(!isAdjustingDamage);
  };

  const displayDamageItems = isAdjustingDamage
    ? adjustedDamageAreas.filter(item => item.location.includes(selectedCategory.split('_')[0]))
    : relevantDamageItems;

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Damage Photos & Analysis</h3>
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className={`text-xs ${selectedCategory === category ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
              data-testid={`button-category-${category}`}
            >
              {formatCategoryName(category)} ({getCategoryPhotoCount(category)})
            </Button>
          ))}
        </div>
      </div>
      
      {/* Main Photo with AI Highlights */}
      <div
        className={`relative bg-gray-100 rounded-lg overflow-hidden mb-3 ${isAdjustingDamage ? 'cursor-crosshair' : ''}`}
        style={{ aspectRatio: "16/9" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDrawing(false);
          setCurrentBox(null);
          setStartPoint(null);
        }}
      >
        {primaryPhoto ? (
          <img
            src={primaryPhoto.url}
            alt="Damage assessment"
            className="w-full h-full object-cover"
            data-testid="img-primary-photo"
            onError={(e) => {
              console.error('Failed to load image:', primaryPhoto.url);
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">No photo selected</p>
              <p className="text-sm">Select a category to view photos</p>
            </div>
          </div>
        )}
        
        {/* AI Damage Highlights */}
        {showAIHighlights && displayDamageItems.map((item) => (
          <div
            key={item.id}
            className={`absolute border-2 rounded ${
              isAdjustingDamage && item.id.startsWith('adjusted-')
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-red-500 bg-red-500/10'
            }`}
            style={{
              top: `${(item.coordinates as any)?.y || 0}%`,
              left: `${(item.coordinates as any)?.x || 0}%`,
              width: `${(item.coordinates as any)?.width || 0}%`,
              height: `${(item.coordinates as any)?.height || 0}%`,
            }}
            data-testid={`damage-highlight-${item.id}`}
          />
        ))}

        {/* Current Drawing Box */}
        {isDrawing && currentBox && (
          <div
            className="absolute border-2 border-orange-400 bg-orange-400/20 rounded"
            style={{
              top: `${currentBox.y}%`,
              left: `${currentBox.x}%`,
              width: `${currentBox.width}%`,
              height: `${currentBox.height}%`,
            }}
          />
        )}
        
        {/* Adjust Damage Area Button - Only for active claims */}
        {!isApproved && (
          <div className="absolute top-3 right-3 bg-card/95 backdrop-blur-sm rounded-lg p-2">
            <Button
              size="sm"
              className={`text-white text-xs px-3 ${
                isAdjustingDamage
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
              onClick={handleAdjustDamageClick}
              data-testid="button-adjust-damage"
              title={isAdjustingDamage ? "Save adjustments" : "Adjust damage area"}
            >
              <Pen className="w-3 h-3 mr-1" />
              {isAdjustingDamage ? 'Save Changes' : 'Adjust Damage Area'}
            </Button>
          </div>
        )}
        
        {/* Photo Controls */}
        <div className="absolute bottom-3 left-3 bg-card/95 backdrop-blur-sm rounded-lg p-2 flex space-x-2">
          <Button size="sm" variant="secondary" className="text-xs" data-testid="button-zoom-in">
            <ZoomIn className="w-3 h-3 mr-1" />
            Zoom
          </Button>
          <Button
            size="sm"
            variant={showAIHighlights ? "default" : "secondary"}
            onClick={() => setShowAIHighlights(!showAIHighlights)}
            className="text-xs"
            data-testid="button-toggle-ai"
          >
            <Eye className="w-3 h-3 mr-1" />
            Show Damages
          </Button>
        </div>
      </div>
      
      {/* Thumbnail Strip */}
      <div className="flex space-x-2">
        {photos.slice(0, 4).map((photo, index) => (
          <div
            key={photo.id}
            className={`w-16 h-16 rounded-md overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 ${
              photo.isPrimary ? 'border-primary' : 'border-gray-300 hover:border-gray-400'
            }`}
            data-testid={`thumbnail-${index}`}
            onClick={() => {
              // TODO: Set as primary photo when clicked
            }}
          >
            <img
              src={photo.thumbnailUrl || photo.url}
              alt={`Damage photo ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5OL0E8L3RleHQ+PC9zdmc+';
              }}
            />
          </div>
        ))}
        {photos.length > 4 && (
          <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-muted-foreground text-xs border-2 border-dashed border-gray-300">
            +{photos.length - 4}
          </div>
        )}
      </div>
    </div>
  );
}
