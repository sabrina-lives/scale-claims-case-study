import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crosshair, Pen, Ruler, ZoomIn, Eye } from "lucide-react";
import type { Photo, DamageItem } from "@shared/schema";

interface PhotoViewerProps {
  photos: Photo[];
  primaryPhoto?: Photo;
  damageItems: DamageItem[];
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function PhotoViewer({ 
  photos, 
  primaryPhoto, 
  damageItems, 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: PhotoViewerProps) {
  const [showAIHighlights, setShowAIHighlights] = useState(true);
  
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

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Damage Photos & Analysis</h3>
        <div className="flex space-x-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className={selectedCategory === category ? "bg-primary text-primary-foreground" : ""}
              data-testid={`button-category-${category}`}
            >
              {formatCategoryName(category)} ({getCategoryPhotoCount(category)})
            </Button>
          ))}
        </div>
      </div>
      
      {/* Main Photo with AI Highlights */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: "16/9" }}>
        {primaryPhoto && (
          <img 
            src={primaryPhoto.url} 
            alt="Damage assessment" 
            className="w-full h-full object-cover"
            data-testid="img-primary-photo"
          />
        )}
        
        {/* AI Damage Highlights */}
        {showAIHighlights && relevantDamageItems.map((item) => (
          <div
            key={item.id}
            className="absolute border-2 border-red-500 bg-red-500/10 rounded"
            style={{
              top: `${(item.coordinates as any)?.y || 0}%`,
              left: `${(item.coordinates as any)?.x || 0}%`,
              width: `${(item.coordinates as any)?.width || 0}%`,
              height: `${(item.coordinates as any)?.height || 0}%`,
            }}
            data-testid={`damage-highlight-${item.id}`}
          />
        ))}
        
        {/* Annotation Tools */}
        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 space-y-4">
          <Button
            size="sm"
            className="w-10 h-10 p-0 bg-primary text-primary-foreground"
            data-testid="button-crosshairs"
          >
            <Crosshair className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 p-0"
            data-testid="button-pen"
          >
            <Pen className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 p-0"
            data-testid="button-ruler"
          >
            <Ruler className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Photo Controls */}
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-2 flex space-x-2">
          <Button size="sm" className="bg-primary text-primary-foreground" data-testid="button-zoom-in">
            <ZoomIn className="w-4 h-4 mr-1" />
            Zoom In
          </Button>
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => setShowAIHighlights(!showAIHighlights)}
            data-testid="button-toggle-ai"
          >
            <Eye className="w-4 h-4 mr-1" />
            Toggle AI
          </Button>
        </div>
      </div>
      
      {/* Thumbnail Strip */}
      <div className="flex space-x-3">
        {photos.slice(0, 3).map((photo, index) => (
          <div 
            key={photo.id}
            className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
              photo.isPrimary ? 'border-primary' : 'border-gray-200'
            }`}
            data-testid={`thumbnail-${index}`}
          >
            <img 
              src={photo.thumbnailUrl || photo.url} 
              alt={`Damage photo ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {photos.length > 3 && (
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-muted-foreground text-sm">
            +{photos.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
}
