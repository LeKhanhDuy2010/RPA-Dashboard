import React from "react";
import { motion } from "motion/react";
import { Bot, Clock, RefreshCw, Power } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RobotInfo } from "@/types";

export const RobotCard: React.FC<{ robot: RobotInfo }> = ({ robot }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="border-2 border-current bg-card p-6 brutalist-card space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`p-2 border-2 border-current ${robot.status === "Busy" ? "bg-accent" : robot.status === "Online" ? "bg-primary" : "bg-destructive"}`}>
            <Bot className="h-6 w-6 text-black" />
          </div>
          <div>
            <h4 className="font-black uppercase italic tracking-tight">{robot.name}</h4>
            <p className="text-[10px] font-mono text-muted-foreground">{robot.id}</p>
          </div>
        </div>
        <Badge className={`rounded-none uppercase text-[10px] ${robot.status === "Online" ? "bg-primary text-black" : robot.status === "Busy" ? "bg-accent text-black" : "bg-destructive text-white"}`}>
          {robot.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 py-2 border-y border-current/10">
        <div>
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Tasks</p>
          <p className="font-black italic">{robot.tasksCompleted}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Success</p>
          <p className="font-black italic text-primary">{robot.successRate}%</p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
          <Clock className="h-3 w-3" />
          {robot.lastActive}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon-xs" className="brutalist-card bg-background hover:bg-primary hover:text-black">
            <RefreshCw className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="icon-xs" className="brutalist-card bg-background hover:bg-destructive hover:text-white">
            <Power className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
