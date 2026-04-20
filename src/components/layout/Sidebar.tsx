import { ReactNode } from "react";
import { 
  Bot, 
  LayoutDashboard, 
  ListTodo, 
  Cpu, 
  Activity, 
  Settings 
} from "lucide-react";

type Page = "Dashboard" | "Queues" | "Robot" | "Analytics" | "Logs" | "Config";

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <aside className="w-64 border-r-2 border-current flex flex-col bg-muted/50 transition-colors duration-300">
      <div className="p-6 border-b-2 border-current">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 border-2 border-black">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-bold text-xl tracking-tighter uppercase">RPA Insight</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <NavItem 
          icon={<LayoutDashboard className="h-5 w-5" />} 
          label="Dashboard" 
          active={activePage === "Dashboard"} 
          onClick={() => setActivePage("Dashboard")}
        />
        <NavItem 
          icon={<Activity className="h-5 w-5" />} 
          label="Analytics" 
          active={activePage === "Analytics"} 
          onClick={() => setActivePage("Analytics")}
        />
        <NavItem 
          icon={<ListTodo className="h-5 w-5" />} 
          label="Queues" 
          active={activePage === "Queues"} 
          onClick={() => setActivePage("Queues")}
        />
        <NavItem 
          icon={<Cpu className="h-5 w-5" />} 
          label="Robot" 
          active={activePage === "Robot"} 
          onClick={() => setActivePage("Robot")}
        />
        <NavItem 
          icon={<Activity className="h-5 w-5" />} 
          label="Logs" 
          active={activePage === "Logs"} 
          onClick={() => setActivePage("Logs")}
        />
        <NavItem 
          icon={<Settings className="h-5 w-5" />} 
          label="Config" 
          active={activePage === "Config"} 
          onClick={() => setActivePage("Config")}
        />
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
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
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
