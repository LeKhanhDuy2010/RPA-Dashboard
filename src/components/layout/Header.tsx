import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activePage: string;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export function Header({ activePage, isDarkMode, setIsDarkMode }: HeaderProps) {
  return (
    <header className="flex justify-between items-end">
      <div>
        <h2 className="text-4xl font-black uppercase tracking-tighter italic">
          {activePage === "Dashboard" ? "System Overview" : activePage}
        </h2>
        <p className="text-muted-foreground font-mono">
          {activePage === "Dashboard" ? "Real-time automation performance metrics" : `Manage and monitor ${activePage.toLowerCase()} status`}
        </p>
      </div>
      <div className="flex items-center gap-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="brutalist-card bg-card hover:bg-muted"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <div className="text-right">
          <p className="text-xs font-bold uppercase text-muted-foreground">System Status</p>
          <div className="flex items-center gap-2 text-primary">
            <div className="h-2 w-2 bg-primary rounded-full animate-ping" />
            <span className="font-mono font-bold">OPERATIONAL</span>
          </div>
        </div>
      </div>
    </header>
  );
}
