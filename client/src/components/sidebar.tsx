import { Car, ClipboardList, CheckCircle2, Clock, BarChart3, User, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo and Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Car className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Scale AI</h1>
            <p className="text-sm text-muted-foreground">Claims Review</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant="secondary"
          className="w-full justify-start bg-accent text-accent-foreground"
          data-testid="nav-active-claims"
        >
          <ClipboardList className="w-5 h-5 mr-3" />
          <span>Active Claims</span>
          <Badge className="ml-auto bg-primary text-primary-foreground">23</Badge>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          data-testid="nav-approved"
        >
          <CheckCircle2 className="w-5 h-5 mr-3" />
          <span>Approved</span>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          data-testid="nav-pending"
        >
          <Clock className="w-5 h-5 mr-3" />
          <span>Pending Review</span>
          <Badge className="ml-auto bg-amber-500 text-white">8</Badge>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          data-testid="nav-analytics"
        >
          <BarChart3 className="w-5 h-5 mr-3" />
          <span>Analytics</span>
        </Button>
      </nav>
      
      {/* User Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm" data-testid="text-agent-name">Sarah Johnson</p>
            <p className="text-xs text-muted-foreground">Claims Agent</p>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
