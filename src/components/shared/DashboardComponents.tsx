import { ReactNode } from "react";
import { motion } from "motion/react";
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function StatCard({ title, value, icon, trend, color }: { 
  title: string, value: string, icon: ReactNode, trend: string, color: "primary" | "secondary" | "destructive" | "accent"
}) {
  const colorMap = {
    primary: "border-primary text-primary",
    secondary: "border-secondary text-secondary",
    destructive: "border-destructive text-destructive",
    accent: "border-accent text-accent"
  };
  return (
    <motion.div whileHover={{ scale: 1.02 }} className={`p-6 border-2 bg-card brutalist-card ${colorMap[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-bold uppercase text-muted-foreground">{title}</p>
        <div className="p-2 border border-current">{icon}</div>
      </div>
      <div className="space-y-1">
        <h3 className="text-3xl font-black italic">{value}</h3>
        <p className="text-[10px] font-mono opacity-70">{trend}</p>
      </div>
    </motion.div>
  );
}

export function DistributionItem({ label, value, color }: { label: string, value: number, color: "primary" | "secondary" | "destructive" }) {
  const colorClass = color === "primary" ? "text-primary" : color === "secondary" ? "text-secondary" : "text-destructive";
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-bold uppercase">
        <span>{label}</span>
        <span className={colorClass}>{value}%</span>
      </div>
      <Progress value={value} className="h-3 bg-muted border border-current" />
    </div>
  );
}

export function SummaryBox({ value, label, color }: { value: number, label: string, color: "primary" | "destructive" }) {
  const bgClass = color === "primary" ? "bg-primary/10" : "bg-destructive/10";
  return (
    <div className={`p-4 border-2 border-current ${bgClass} text-center`}>
      <p className="text-2xl font-black italic">{value}</p>
      <p className="text-[10px] font-bold uppercase text-muted-foreground">{label}</p>
    </div>
  );
}

export function SortableHead({ label, column, sortConfig, onSort, align = "left" }: { 
  label: string, column: string, sortConfig: any, onSort: (key: string) => void, align?: "left" | "right" 
}) {
  const SortIcon = () => {
    if (sortConfig.key !== column || !sortConfig.direction) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-30" />;
    return sortConfig.direction === "asc" ? <ArrowUp className="h-3 w-3 ml-1 text-primary" /> : <ArrowDown className="h-3 w-3 ml-1 text-primary" />;
  };
  return (
    <TableHead 
      className={`text-foreground font-bold uppercase italic cursor-pointer hover:bg-foreground/5 transition-colors ${align === "right" ? "text-right" : ""}`}
      onClick={() => onSort(column)}
    >
      <div className={`flex items-center ${align === "right" ? "justify-end" : ""}`}>
        {label} <SortIcon />
      </div>
    </TableHead>
  );
}

export function Pagination({ totalPages, currentPage, onPageChange, totalResults, currentResults }: { 
  totalPages: number, currentPage: number, onPageChange: (p: number) => void, totalResults: number, currentResults: number 
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-xs font-mono text-muted-foreground uppercase">Showing {currentResults} of {totalResults} results</p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="brutalist-card bg-background" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" className={`w-8 brutalist-card ${currentPage === page ? "bg-primary text-black" : "bg-background"}`} onClick={() => onPageChange(page)}>
              {page}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="brutalist-card bg-background" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
