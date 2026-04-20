import { useEffect, useState, useMemo } from "react";
import { Zap, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RPASummary, HourlyStat, QueueInfo, RobotInfo, QueueUpdate } from "./types";

// Modular Components
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DashboardView } from "@/components/DashboardView";
import { QueuesView } from "@/components/QueuesView";
import { RobotView } from "@/components/RobotView";
import { AnalyticsView } from "@/components/AnalyticsView";
import { useDebounce } from "@/hooks/useDebounce";

const ITEMS_PER_PAGE = 10;

type Page = "Dashboard" | "Queues" | "Robot" | "Analytics" | "Logs" | "Config";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("Dashboard");
  const [summary, setSummary] = useState<RPASummary | null>(null);
  const [hourlyStats, setHourlyStats] = useState<HourlyStat[]>([]);
  const [dashboardChartRange, setDashboardChartRange] = useState<
    "Today" | "Last 7 days"
  >("Today");
  const [queues, setQueues] = useState<QueueInfo[]>([]);
  const [robots, setRobots] = useState<RobotInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "createdTime",
    direction: null,
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const fetchSummaryAndStats = async (chartRange = dashboardChartRange) => {
    try {
      const [summaryRes, statsRes] = await Promise.all([
        fetch("/api/rpa/summary"),
        fetch(`/api/rpa/hourly-stats?range=${chartRange}`),
      ]);
      setSummary(await summaryRes.json());
      setHourlyStats(await statsRes.json());
    } catch (error) {
      console.error("Failed to fetch summary data:", error);
    }
  };

  const fetchDashboardChartOnly = async (chartRange: string) => {
    try {
      const res = await fetch(`/api/rpa/hourly-stats?range=${chartRange}`);
      setHourlyStats(await res.json());
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    }
  };

  const fetchQueues = async () => {
    try {
      // Fetch all queues to handle sorting/filtering on FE
      const res = await fetch(`/api/rpa/queues?limit=1000`);
      const result = await res.json();
      setQueues(result.data);
    } catch (error) {
      console.error("Failed to fetch queues:", error);
    }
  };

  const fetchRobots = async (searchVal = debouncedSearchTerm) => {
    try {
      const params = new URLSearchParams({
        search: searchVal,
        page: String(currentPage),
        limit: "6", // Robots use a different limit for the grid
      });
      const res = await fetch(`/api/rpa/robots?${params}`);
      const result = await res.json();
      setRobots(result.data);
      setTotalPages(result.totalPages);
      setTotalResults(result.total);
    } catch (error) {
      console.error("Failed to fetch robots:", error);
    }
  };

  const updateQueue = async (id: string, data: Partial<QueueUpdate>) => {
    try {
      const res = await fetch(`/api/rpa/queues/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchQueues();
      } else {
        console.error("Failed to update queue");
      }
    } catch (error) {
      console.error("Error updating queue:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchSummaryAndStats();
      await fetchQueues();
      if (activePage === "Robot") {
        await fetchRobots("");
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (activePage === "Robot") {
      fetchRobots();
    }
    // Queues are now handled via useMemo on the full list
  }, [activePage, debouncedSearchTerm, currentPage, dashboardChartRange]);

  //Fetch Dashboard
  useEffect(() => {
    if (activePage !== "Dashboard") return;

    const fetchAll = async () => {
      if (document.hidden) return;

      await Promise.all([
        fetchSummaryAndStats(dashboardChartRange),
        fetchQueues(),
      ]);
    };

    fetchAll();

    const interval = setInterval(fetchAll, 60000);

    return () => clearInterval(interval);
  }, [activePage, dashboardChartRange]);

  const filteredAndSortedQueues = useMemo(() => {
    let result = [...queues];

    // Filter
    if (debouncedSearchTerm) {
      const lowerSearch = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        (q) =>
          q.name.toLowerCase().includes(lowerSearch) ||
          q.id.toLowerCase().includes(lowerSearch),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((q) => q.status === statusFilter);
    }

    // Sort
    if (sortConfig.direction) {
      result.sort((a: any, b: any) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [queues, debouncedSearchTerm, statusFilter, sortConfig]);

  const paginatedQueues = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedQueues.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedQueues, currentPage]);

  const queueTotalPages = Math.ceil(
    filteredAndSortedQueues.length / ITEMS_PER_PAGE,
  );

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key, direction: null };
        return { key, direction: "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm("");
    setStatusFilter("all");
    setSortConfig({ key: "id", direction: null });
  }, [activePage]);

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
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        <Header
          activePage={activePage}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {activePage === "Dashboard" && (
              <>
                <DashboardView
                  summary={summary}
                  hourlyStats={hourlyStats}
                  isDarkMode={isDarkMode}
                  chartRange={dashboardChartRange}
                  setChartRange={setDashboardChartRange}
                />
                <QueuesView
                  activePage={activePage}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  sortConfig={sortConfig}
                  handleSort={handleSort}
                  paginatedData={paginatedQueues}
                  totalPages={queueTotalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  filteredDataLength={filteredAndSortedQueues.length}
                  onUpdateQueue={updateQueue}
                />
              </>
            )}

            {activePage === "Queues" && (
              <QueuesView
                activePage={activePage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                sortConfig={sortConfig}
                handleSort={handleSort}
                paginatedData={paginatedQueues}
                totalPages={queueTotalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                filteredDataLength={filteredAndSortedQueues.length}
                onUpdateQueue={updateQueue}
              />
            )}

            {activePage === "Robot" && (
              <RobotView
                robots={robots}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredData={robots}
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalResults={totalResults}
              />
            )}

            {activePage === "Analytics" && <AnalyticsView />}

            {(activePage === "Logs" || activePage === "Config") && (
              <div className="flex flex-col items-center justify-center py-20 border-4 border-dashed border-current bg-muted/20">
                <Settings className="h-16 w-16 mb-4 animate-spin-slow" />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                  {activePage} Module
                </h3>
                <p className="text-muted-foreground font-mono">
                  This module is currently under construction.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
