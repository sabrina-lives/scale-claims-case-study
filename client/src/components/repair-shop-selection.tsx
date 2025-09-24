import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Star, Clock, Phone, Send, CheckCircle2 } from "lucide-react";
import type { Claim } from "@shared/schema";

interface RepairShop {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  distance: string;
  specialties: string[];
  estimatedDays: string;
  certified: boolean;
  availability: "immediate" | "next_week" | "2_weeks";
}

interface RepairShopSelectionProps {
  claim: Claim;
  totalEstimate: number;
  selectedShop: string;
  onShopChange: (shopId: string) => void;
  adjusterNotes: string;
  onNotesChange: (notes: string) => void;
}

const mockRepairShops: RepairShop[] = [
  {
    id: "shop-1",
    name: "Premier Auto Body",
    address: "1245 Main St, San Francisco, CA",
    phone: "(415) 555-0123",
    rating: 4.8,
    distance: "2.3 miles",
    specialties: ["Collision Repair", "Paint & Bodywork", "BMW Certified"],
    estimatedDays: "3-4 days",
    certified: true,
    availability: "immediate"
  },
  {
    id: "shop-2",
    name: "Golden Gate Collision",
    address: "567 Market St, San Francisco, CA",
    phone: "(415) 555-0456",
    rating: 4.6,
    distance: "4.1 miles",
    specialties: ["Insurance Claims", "Foreign Vehicles", "Paint Matching"],
    estimatedDays: "4-5 days",
    certified: true,
    availability: "next_week"
  },
  {
    id: "shop-3",
    name: "Bay Area Auto Restoration",
    address: "890 Industrial Blvd, San Francisco, CA",
    phone: "(415) 555-0789",
    rating: 4.9,
    distance: "6.8 miles",
    specialties: ["High-End Vehicles", "Custom Paint", "European Cars"],
    estimatedDays: "5-7 days",
    certified: true,
    availability: "2_weeks"
  }
];

export default function RepairShopSelection({
  claim,
  totalEstimate,
  selectedShop,
  onShopChange,
  adjusterNotes,
  onNotesChange
}: RepairShopSelectionProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "immediate": return "text-green-600 bg-green-50 border-green-200";
      case "next_week": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "2_weeks": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "immediate": return "Available Now";
      case "next_week": return "Next Week";
      case "2_weeks": return "2+ Weeks";
      default: return "Unknown";
    }
  };


  const selectedShopData = mockRepairShops.find(shop => shop.id === selectedShop);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold mb-2">Select Repair Shop</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Approved estimate: {formatCurrency(totalEstimate)}
          </p>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {mockRepairShops.length} Qualified Shops
          </Badge>
        </div>
      </div>

      {/* Shop Selection */}
      <div className="space-y-3">
        {mockRepairShops.map((shop) => (
          <div
            key={shop.id}
            className={`cursor-pointer transition-all hover:shadow-lg rounded-xl border-2 p-6 ${
              selectedShop === shop.id
                ? 'ring-1 ring-primary border-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-lg'
                : 'hover:border-gray-300 bg-white border-gray-200 shadow-sm hover:shadow-md'
            }`}
            onClick={() => onShopChange(shop.id)}
          >
            {/* Header Section */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-bold text-gray-900">{shop.name}</h4>
                </div>

                {/* Rating and Distance */}
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{shop.rating}</span>
                    <span className="text-sm text-gray-500">rating</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">{shop.distance}</span>
                  </div>
                </div>
              </div>

              {/* Availability Badge */}
              <div className="text-right">
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold ${getAvailabilityColor(shop.availability)} border-current`}
                >
                  {getAvailabilityText(shop.availability)}
                </Badge>
                <div className="text-sm text-gray-600 mt-2 font-medium">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {shop.estimatedDays}
                </div>
              </div>
            </div>

            {/* Address and Contact */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2 font-medium">{shop.address}</p>
              <div className="flex items-center space-x-1 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">{shop.phone}</span>
              </div>
            </div>

            {/* Specialties */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Specialties</p>
              <div className="flex flex-wrap gap-2">
                {shop.specialties.map((specialty) => (
                  <Badge
                    key={specialty}
                    variant="outline"
                    className="text-xs font-medium bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Adjuster Notes */}
      <div className="bg-card rounded-lg border border-border p-4">
        <Label htmlFor="adjuster-notes" className="text-sm font-medium">
          Notes for Repair Shop
        </Label>
        <Textarea
          id="adjuster-notes"
          placeholder="Add any special instructions or notes for the repair shop..."
          value={adjusterNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          className="mt-2"
        />
      </div>

      {/* Selected Shop Summary */}
      {selectedShopData && (
        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="font-medium text-sm mb-2">Selected Repair Shop:</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-800">{selectedShopData.name}</p>
            <p className="text-xs text-blue-600">{selectedShopData.address}</p>
            <p className="text-xs text-blue-600 mt-1">
              {selectedShopData.estimatedDays} • {getAvailabilityText(selectedShopData.availability)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}