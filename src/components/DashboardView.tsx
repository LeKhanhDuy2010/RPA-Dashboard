import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Bot, 
  TrendingUp 
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard, DistributionItem, SummaryBox } from "./shared/DashboardComponents";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RPASummary, HourlyStat } from "@/types";

interface DashboardViewProps {
  summary: RPASummary | null;
  hourlyStats: HourlyStat[];
  isDarkMode: boolean;
  chartRange: "Today" | "Last 7 days";
  setChartRange: (range: "Today" | "Last 7 days") => void;
}

export function DashboardView({ 
  summary, 
  hourlyStats, 
  isDarkMode,
  chartRange,
  setChartRange
}: DashboardViewProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Queue" value={summary?.totalQueue.toLocaleString() || "0"} icon={<Clock className="text-secondary" />} trend="Updated just now" color="secondary" />
        <StatCard title="Success Rate" value={`${summary?.successRate}%`} icon={<CheckCircle2 className="text-primary" />} trend="System running normally" color="primary" />
        <StatCard title="Error Rate" value={`${summary?.errorRate}%`} icon={<AlertCircle className="text-destructive" />} trend={summary?.errorRate > 10 ? "Needs attention" : "Under control"} color="destructive" />
        <StatCard title="Active Robots" value={summary?.activeBots.toString() || "0"} icon={<Bot className="text-accent" />} trend={`${summary?.activeBots}/${summary?.totalBots} running`} color="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 brutalist-card bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 uppercase italic tracking-tight">
              <TrendingUp className="h-5 w-5 text-primary" />
              {chartRange === "Today" ? "Hourly Performance" : "Daily Performance (Last 7 Days)"}
            </CardTitle>
            <Select value={chartRange} onValueChange={(v: any) => setChartRange(v)}>
              <SelectTrigger className="w-[140px] brutalist-card bg-background h-8 text-xs uppercase font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="brutalist-card bg-card">
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="Last 7 days">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyStats}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF007F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF007F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#ddd"} vertical={false} />
                <XAxis dataKey="hour" stroke={isDarkMode ? "#888" : "#666"} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={isDarkMode ? "#888" : "#666"} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#121212' : '#ffffff', border: '2px solid currentColor', borderRadius: '0px' }} itemStyle={{ color: isDarkMode ? '#fff' : '#000' }} />
                <Area type="monotone" dataKey="success" stroke={isDarkMode ? "#39FF14" : "#3b82f6"} strokeWidth={3} fillOpacity={1} fill="url(#colorSuccess)" />
                <Area type="monotone" dataKey="error" stroke={isDarkMode ? "#FF007F" : "#ef4444"} strokeWidth={3} fillOpacity={1} fill="url(#colorError)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="brutalist-card bg-card">
          <CardHeader>
            <CardTitle className="uppercase italic tracking-tight">Queue Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DistributionItem label="Processing" value={summary?.processingRate || 0} color="primary" />
            <DistributionItem label="Waiting" value={summary?.waitingRate || 0} color="secondary" />
            <DistributionItem label="Failed" value={summary?.errorRate || 0} color="destructive" />
            <div className="pt-4 border-t border-current/20">
              <div className="grid grid-cols-2 gap-4">
                <SummaryBox value={summary?.completedToday || 0} label="Completed" color="primary" />
                <SummaryBox value={summary?.failedToday || 0} label="Failed" color="destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
