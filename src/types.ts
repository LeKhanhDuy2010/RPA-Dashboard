export interface RPASummary {
  totalQueue: number;
  successRate: number;
  errorRate: number;
  activeBots: number;
  totalBots: number;
  waitingRate: number;
  processingRate: number;
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
  factory: string;
  name: string;
  robot: string;
  status: "in progress" | "complete" | "error" | "waiting" | "pending";
  priority: "High" | "Medium" | "Low";
  createdAt: TimeRanges;
  startTime: string;
  finishTime: string;
  reasonFail: string;
  userCode: string;
  userName: string;
  jsonConfig: string;
  filePath: string;
}

export interface QueueUpdate {
  status?: "in progress" | "complete" | "error" | "waiting" | "pending";
  priority?: "High" | "Medium" | "Low";
  createdAt: TimeRanges;
}

export interface RobotInfo {
  id: string;
  name: string;
  status: "Online" | "Offline" | "Busy";
  lastActive: string;
  tasksCompleted: number;
  successRate: number;
}

export interface AnalyticsStat {
  label: string;
  success: number;
  error: number;
  performance: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
