import { useState, useEffect, useRef } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Brush
} from "recharts";
import { Calendar, TrendingUp, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AnalyticsStat } from "@/types";
import { startOfMonth, endOfMonth, format } from "date-fns";

export function AnalyticsView() {
  const [range, setRange] = useState<"daily" | "weekly" | "monthly">("daily");
  
  // Default to start and end of current month
  const [startDate, setStartDate] = useState(() => format(startOfMonth(new Date()), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(() => format(endOfMonth(new Date()), "yyyy-MM-dd"));
  
  const [stats, setStats] = useState<AnalyticsStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomIndices, setZoomIndices] = useState({ start: 0, end: 0 });
  const barChartRef = useRef<HTMLDivElement>(null);
  const lineChartRef = useRef<HTMLDivElement>(null);

  const getYearRange = () => {
    if (!startDate || !endDate) return "";
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    return startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;
  };

  const currentYearDisplay = getYearRange();

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        range,
        ...(startDate && { start: startDate }),
        ...(endDate && { end: endDate })
      });
      const res = await fetch(`/api/rpa/analytics?${params}`);
      const data = await res.json();
      setStats(data);
      setZoomIndices({ start: 0, end: data.length - 1 });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range, startDate, endDate]);

  useEffect(() => {
    const handleNativeWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY;
        const sensitivity = 0.1;
        
        setZoomIndices(prev => {
          const rangeSize = prev.end - prev.start;
          const step = Math.max(1, Math.round(rangeSize * sensitivity));
          
          if (delta < 0) {
            // Zoom in
            if (rangeSize > 5) {
              return {
                start: Math.min(prev.end - 5, prev.start + step),
                end: Math.max(prev.start + 5, prev.end - step)
              };
            }
          } else {
            // Zoom out
            return {
              start: Math.max(0, prev.start - step),
              end: Math.min(stats.length - 1, prev.end + step)
            };
          }
          return prev;
        });
      }
    };

    const barChart = barChartRef.current;
    const lineChart = lineChartRef.current;

    if (barChart) barChart.addEventListener('wheel', handleNativeWheel, { passive: false });
    if (lineChart) lineChart.addEventListener('wheel', handleNativeWheel, { passive: false });

    return () => {
      if (barChart) barChart.removeEventListener('wheel', handleNativeWheel);
      if (lineChart) lineChart.removeEventListener('wheel', handleNativeWheel);
    };
  }, [stats.length]); // Only re-bind if stats length changes

  const visibleStats = stats.slice(zoomIndices.start, zoomIndices.end + 1);

  const totalSuccess = stats.reduce((acc, curr) => acc + curr.success, 0);
  const totalError = stats.reduce((acc, curr) => acc + curr.error, 0);
  const avgPerformance = stats.length > 0 
    ? (stats.reduce((acc, curr) => acc + curr.performance, 0) / stats.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Analytics Engine</h2>
          <p className="text-muted-foreground font-mono text-sm">Deep dive into RPA performance metrics</p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 brutalist-card bg-card p-1">
            <Input 
              type="date" 
              className="border-none bg-transparent h-8 w-32 text-xs font-mono"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-muted-foreground font-mono">to</span>
            <Input 
              type="date" 
              className="border-none bg-transparent h-8 w-32 text-xs font-mono"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          
          <Select value={range} onValueChange={(v: any) => setRange(v)}>
            <SelectTrigger className="w-[120px] brutalist-card bg-primary text-black font-bold uppercase text-xs h-10">
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent className="brutalist-card bg-card">
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="brutalist-card border-2 border-current h-10 px-4"
            onClick={fetchAnalytics}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Apply
          </Button>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="brutalist-card bg-primary text-black">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-black uppercase tracking-widest">Total Success</p>
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="text-4xl font-black italic tracking-tighter">{totalSuccess.toLocaleString()}</h3>
            <p className="text-[10px] font-mono mt-2 opacity-80">Processed items in selected range</p>
          </CardContent>
        </Card>
        
        <Card className="brutalist-card bg-destructive text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-black uppercase tracking-widest">Total Errors</p>
              <AlertCircle className="h-5 w-5" />
            </div>
            <h3 className="text-4xl font-black italic tracking-tighter">{totalError.toLocaleString()}</h3>
            <p className="text-[10px] font-mono mt-2 opacity-80">Failed items requiring attention</p>
          </CardContent>
        </Card>
        
        <Card className="brutalist-card bg-accent text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-black uppercase tracking-widest">Avg Performance</p>
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-4xl font-black italic tracking-tighter">{avgPerformance}%</h3>
            <p className="text-[10px] font-mono mt-2 opacity-80">Efficiency score across all bots</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="brutalist-card bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="uppercase italic tracking-tight flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Execution Volume
            </CardTitle>
            <div className="text-xs font-black uppercase bg-primary text-black px-2 py-1 brutalist-card">
              {currentYearDisplay}
            </div>
          </CardHeader>
          <CardContent>
            <div 
              ref={barChartRef}
              className="h-[300px] w-full cursor-crosshair select-none"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visibleStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    stroke="#888" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#888" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '2px solid #fff', borderRadius: '0' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="success" name="Success" fill="var(--color-primary)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="error" name="Error" fill="var(--color-destructive)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {stats.length > visibleStats.length && (
              <p className="text-[10px] font-mono text-center mt-2 text-muted-foreground uppercase">
                Ctrl + Wheel to zoom • Showing {visibleStats.length} of {stats.length} points
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="brutalist-card bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="uppercase italic tracking-tight flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Performance Trend
            </CardTitle>
            <div className="text-xs font-black uppercase bg-accent text-white px-2 py-1 brutalist-card">
              {currentYearDisplay}
            </div>
          </CardHeader>
          <CardContent>
            <div 
              ref={lineChartRef}
              className="h-[300px] w-full cursor-crosshair select-none"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visibleStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    stroke="#888" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#888" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '2px solid #fff', borderRadius: '0' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="performance" 
                    name="Efficiency %" 
                    stroke="var(--color-accent)" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: 'var(--color-accent)', strokeWidth: 2, stroke: '#000' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {stats.length > visibleStats.length && (
              <p className="text-[10px] font-mono text-center mt-2 text-muted-foreground uppercase">
                Ctrl + Wheel to zoom • Showing {visibleStats.length} of {stats.length} points
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
