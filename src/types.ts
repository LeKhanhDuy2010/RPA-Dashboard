export interface RPASummary {
  totalQueue: number;
  successRate: number;
  errorRate: number;
  activeBots: number;
  pendingTasks: number;
  completedToday: number;
  failedToday: number;
  waitingToday: number;
}

export interface HourlyStat {
  hour: string;
  success: number;
  error: number;
}

export interface QueueInfo {
  id: string;
  name: string;
  robot: string;
  status: "Active" | "Idle" | "Error";
  priority: "High" | "Medium" | "Low";
  createdTime: TimeRanges;
}
