import { Search, Cpu, ShieldCheck, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard, Pagination } from "./shared/DashboardComponents";
import { RobotCard } from "./RobotCard";
import { RobotInfo } from "@/types";

interface RobotViewProps {
  robots: RobotInfo[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredData: RobotInfo[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalResults: number;
}

export function RobotView({ 
  robots, 
  searchTerm, 
  setSearchTerm, 
  filteredData,
  totalPages,
  currentPage,
  setCurrentPage,
  totalResults
}: RobotViewProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Robots" value={totalResults.toString()} icon={<Cpu className="text-primary" />} trend="All systems go" color="primary" />
        <StatCard title="Online" value={robots.filter(r => r.status !== "Offline").length.toString()} icon={<ShieldCheck className="text-secondary" />} trend="Active fleet" color="secondary" />
        <StatCard title="Avg Success" value="96.2%" icon={<TrendingUp className="text-accent" />} trend="Fleet average" color="accent" />
      </div>

      <Card className="brutalist-card bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="uppercase italic tracking-tight">Robot Fleet Management</CardTitle>
          <div className="flex gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search robots..." 
                className="pl-10 brutalist-card bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((robot) => (
              <RobotCard key={robot.id} robot={robot} />
            ))}
          </div>
          <Pagination 
            totalPages={totalPages} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
            totalResults={totalResults} 
            currentResults={filteredData.length} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
