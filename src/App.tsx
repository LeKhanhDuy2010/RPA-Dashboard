import { useEffect, useState, ReactNode } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
  Zap,
  TrendingUp,
  Bot,
  Sun,
  Moon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { RPASummary, HourlyStat, QueueInfo } from "./types";

export default function App() {
  const [summary, setSummary] = useState<RPASummary | null>(null);
  const [hourlyStats, setHourlyStats] = useState<HourlyStat[]>([]);
  const [queues, setQueues] = useState<QueueInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fetchQueues = async (pageParam: number) => {
    try {
      const res = await fetch(
        `/api/rpa/queues?page=${pageParam}&pageSize=${pageSize}`,
      );
      const json = await res.json();

      setQueues(json.data); // 👈 set lại data theo page
      setTotal(json.total);
    } catch (err) {
      console.error("Fetch queues failed", err);
    }
  };

  useEffect(() => {
    fetchQueues(page);
  }, [page]);
  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (page * pageSize < total) {
      setPage((prev) => prev + 1);
    }
  };
  useEffect(() => {
    // Apply dark mode class
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, statsRes, queuesRes] = await Promise.all([
          fetch("/api/rpa/summary"),
          fetch("/api/rpa/hourly-stats"),
          fetch("/api/rpa/queues"),
        ]);

        const summaryData = await summaryRes.json();
        const statsData = await statsRes.json();
        const queuesData = await queuesRes.json();

        setSummary(summaryData);
        setHourlyStats(statsData);
        setQueues(queuesData.data);
        setTotal(queuesData.total);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-primary">
        <div className="flex flex-col items-center gap-4">
          <Zap className="h-12 w-12 animate-pulse" />
          <p className="font-mono text-xl uppercase tracking-widest">
            Initializing RPA Core...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-current flex flex-col bg-muted/50 transition-colors duration-300">
        <div className="p-6 border-b-2 border-current">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 border-2 border-black">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="font-bold text-xl tracking-tighter uppercase">
              RPA Insight
            </h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            active
          />
          <NavItem icon={<ListTodo className="h-5 w-5" />} label="Queues" />
          <NavItem icon={<Users className="h-5 w-5" />} label="Bot Fleet" />
          <NavItem icon={<Activity className="h-5 w-5" />} label="Logs" />
          <NavItem icon={<Settings className="h-5 w-5" />} label="Config" />
        </nav>

        <div className="p-4 border-t-2 border-current bg-primary/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-foreground text-background border-2 border-current rounded-full flex items-center justify-center font-bold">
              ID
            </div>
            <div>
              <p className="text-xs font-bold uppercase">Admin Node</p>
              <p className="text-[10px] text-muted-foreground">ID-8829-X</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Header */}
        <header className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">
              System Overview
            </h2>
            <p className="text-muted-foreground font-mono">
              Real-time automation performance metrics
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="brutalist-card bg-card hover:bg-muted"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <div className="text-right">
              <p className="text-xs font-bold uppercase text-muted-foreground">
                System Status
              </p>
              <div className="flex items-center gap-2 text-primary">
                <div className="h-2 w-2 bg-primary rounded-full animate-ping" />
                <span className="font-mono font-bold">OPERATIONAL</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Queue"
            value={summary?.totalQueue.toLocaleString() || "0"}
            icon={<Clock className="text-secondary" />}
            trend="+12% vs yesterday"
            color="secondary"
          />
          <StatCard
            title="Success Rate"
            value={`${summary?.successRate}%`}
            icon={<CheckCircle2 className="text-primary" />}
            trend="Stable"
            color="primary"
          />
          <StatCard
            title="Error Rate"
            value={`${summary?.errorRate}%`}
            icon={<AlertCircle className="text-destructive" />}
            trend="-2% improvement"
            color="destructive"
          />
          <StatCard
            title="Active Bots"
            value={summary?.activeBots.toString() || "0"}
            icon={<Bot className="text-accent" />}
            trend="Max Capacity"
            color="accent"
          />
        </div>

        {/* Charts & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <Card className="lg:col-span-2 brutalist-card bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 uppercase italic tracking-tight">
                <TrendingUp className="h-5 w-5 text-primary" />
                Hourly Performance (Success vs Error)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyStats}>
                  <defs>
                    <linearGradient
                      id="colorSuccess"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF007F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF007F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#333" : "#ddd"}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="hour"
                    stroke={isDarkMode ? "#888" : "#666"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={isDarkMode ? "#888" : "#666"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#121212" : "#ffffff",
                      border: "2px solid currentColor",
                      borderRadius: "0px",
                    }}
                    itemStyle={{ color: isDarkMode ? "#fff" : "#000" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="success"
                    stroke="#39FF14"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSuccess)"
                  />
                  <Area
                    type="monotone"
                    dataKey="error"
                    stroke="#FF007F"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorError)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Queue Status */}
          <Card className="brutalist-card bg-card">
            <CardHeader>
              <CardTitle className="uppercase italic tracking-tight">
                Queue Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold uppercase">
                  <span>Processing</span>
                  <span className="text-primary">75%</span>
                </div>
                <Progress
                  value={75}
                  className="h-3 bg-muted border border-current"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold uppercase">
                  <span>Waiting</span>
                  <span className="text-primary">20%</span>
                </div>
                <Progress
                  value={75}
                  className="h-3 bg-muted border border-current"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold uppercase">
                  <span>Failed</span>
                  <span className="text-destructive">5%</span>
                </div>
                <Progress
                  value={5}
                  className="h-3 bg-muted border border-current"
                />
              </div>

              <div className="pt-4 border-t border-current/20">
                <div className="grid grid-cols-2 gap-4">                  
                  <div className="p-4 border-2 border-current bg-primary/10 text-center">
                    <p className="text-2xl font-black italic">
                      {summary?.completedToday}
                    </p>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">
                      Completed
                    </p>
                  </div>
                  <div className="p-4 border-2 border-current bg-destructive/10 text-center">
                    <p className="text-2xl font-black italic">
                      {summary?.failedToday}
                    </p>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">
                      Failed
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Queue Table */}
        <Card className="brutalist-card bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="uppercase italic tracking-tight">
              Active Queues
            </CardTitle>
            <Badge
              variant="outline"
              className="border-current text-foreground rounded-none uppercase px-4 py-1"
            >
              Live Feed
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <select
                className="border px-2 py-1 text-xs"
                value={statusFilter}
                onChange={(e) => {
                  setPage(1);
                  setStatusFilter(e.target.value);
                }}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Idle">Idle</option>
                <option value="Error">Error</option>
              </select>

              <select
                className="border px-2 py-1 text-xs"
                value={priorityFilter}
                onChange={(e) => {
                  setPage(1);
                  setPriorityFilter(e.target.value);
                }}
              >
                <option value="">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-current hover:bg-transparent">
                  <TableHead className="text-foreground font-bold uppercase italic">
                    Queue ID
                  </TableHead>
                  <TableHead className="text-foreground font-bold uppercase italic">
                    Process Name
                  </TableHead>
                  <TableHead className="text-foreground font-bold uppercase italic">
                    Robot Name
                  </TableHead>
                  <TableHead className="text-foreground font-bold uppercase italic">
                    Status
                  </TableHead>
                  <TableHead className="text-foreground font-bold uppercase italic">
                    Priority
                  </TableHead>
                  <TableHead className="text-foreground font-bold uppercase italic text-right">
                    Created Time
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queues.map((q) => (
                  <TableRow
                    key={q.id}
                    className="border-b border-current/20 hover:bg-foreground/5 transition-colors"
                  >
                    <TableCell className="font-mono text-primary font-bold">
                      {q.id}
                    </TableCell>
                    <TableCell className="font-bold">{q.name}</TableCell>
                    <TableCell className="font-bold">{q.robot}</TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-none uppercase px-3 ${
                          q.status === "Active"
                            ? "bg-primary text-black"
                            : q.status === "Error"
                              ? "bg-destructive text-white"
                              : "bg-muted text-foreground border border-current"
                        }`}
                      >
                        {q.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-bold uppercase ${
                          q.priority === "High"
                            ? "text-accent"
                            : "text-muted-foreground"
                        }`}
                      >
                        {q.priority}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      {q.createdTime}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-between">
            {/* Left: Info */}
            <div className="text-xs text-muted-foreground font-mono">
              Showing {(page - 1) * pageSize + 1} -{" "}
              {Math.min(page * pageSize, total)} of {total}
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border border-current text-xs uppercase"
                onClick={handlePrev}
                disabled={page === 1}
              >
                Prev
              </button>

              <span className="text-xs font-bold">{page}</span>

              <button
                className="px-3 py-1 border border-current text-xs uppercase"
                onClick={handleNext}
                disabled={page * pageSize >= total}
              >
                Next
              </button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`
      flex items-center gap-3 px-4 py-3 cursor-pointer transition-all
      ${active ? "bg-foreground text-background font-bold" : "hover:bg-foreground/10 text-muted-foreground"}
    `}
    >
      {icon}
      <span className="uppercase text-sm tracking-wider">{label}</span>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
  color,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  trend: string;
  color: "primary" | "secondary" | "destructive" | "accent";
}) {
  const colorMap = {
    primary: "border-primary text-primary",
    secondary: "border-secondary text-secondary",
    destructive: "border-destructive text-destructive",
    accent: "border-accent text-accent",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-6 border-2 bg-card brutalist-card ${colorMap[color]}`}
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {title}
        </p>
        <div className="p-2 border border-current">{icon}</div>
      </div>
      <div className="space-y-1">
        <h3 className="text-3xl font-black italic">{value}</h3>
        <p className="text-[10px] font-mono opacity-70">{trend}</p>
      </div>
    </motion.div>
  );
}
