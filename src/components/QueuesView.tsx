import { useState } from "react";
import { Search, Filter, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SortableHead, Pagination } from "./shared/DashboardComponents";
import { QueueInfo } from "@/types";

interface QueuesViewProps {
  activePage: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortConfig: any;
  handleSort: (key: string) => void;
  paginatedData: QueueInfo[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filteredDataLength: number;
  onUpdateQueue: (id: string, data: Partial<QueueInfo>) => Promise<void>;
}

export function QueuesView({
  activePage,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortConfig,
  handleSort,
  paginatedData,
  totalPages,
  currentPage,
  setCurrentPage,
  filteredDataLength,
  onUpdateQueue,
}: QueuesViewProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingQueue, setEditingQueue] = useState<QueueInfo | null>(null);

  const handleRowClick = (queue: QueueInfo) => {
    setEditingQueue({ ...queue });
    setIsEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingQueue) {
      await onUpdateQueue(editingQueue.id, {
        factory: editingQueue.factory,
        robotName: editingQueue.robotName,
        status: editingQueue.status,
        priority: editingQueue.priority,
        createdAt: editingQueue.createdAt,
        startTime: editingQueue.startTime,
        finishTime: editingQueue.finishTime,
        reasonFail: editingQueue.reasonFail,
      });
      setIsEditDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="brutalist-card bg-card">
        <CardHeader className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="uppercase italic tracking-tight">
              {activePage === "Dashboard"
                ? "Active Queues"
                : "Queue Management"}
            </CardTitle>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="border-current text-foreground rounded-none uppercase px-4 py-1"
              >
                Live Feed
              </Badge>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by factory, name or ID..."
                className="pl-10 brutalist-card bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="brutalist-card bg-background">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="brutalist-card bg-card">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[1200px]">
              <TableHeader>
                <TableRow className="border-b-2 border-current hover:bg-transparent">
                  <SortableHead
                    label="No."
                    column="index"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableHead
                    label="Factory"
                    column="factory"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableHead
                    label="Queue ID"
                    column="id"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableHead
                    label="Process Name"
                    column="name"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableHead
                    label="Robot"
                    column="robotName"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableHead
                    label="Status"
                    column="status"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableHead
                    label="Priority"
                    column="priority"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableHead
                    label="User Code"
                    column="userCode"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableHead
                    label="User Name"
                    column="userName"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableHead
                    label="Created Time"
                    column="createdAt"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableHead
                    label="Start Time"
                    column="startTime"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableHead
                    label="Finish Time"
                    column="finishTime"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableHead
                    label="Reason Fail"
                    column="reasonFail"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableHead
                    label="Json Config"
                    column="jsonConfig"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableHead
                    label="File Path"
                    column="filePath"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((q, idx) => (
                  <TableRow
                    key={q.id}
                    className="border-b border-current/20 hover:bg-foreground/5 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(q)}
                  >
                    <TableCell className="font-mono text-xs">
                      {(currentPage - 1) * 5 + idx + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold">
                      {q.factory}
                    </TableCell>
                    <TableCell className="font-mono text-primary font-bold">
                      {q.id}
                    </TableCell>
                    <TableCell className="font-bold">{q.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {q.robotName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-none uppercase px-3 font-semibold border shadow-sm
                            ${
                              q.status === "in progress"
                                ? "bg-blue-600 text-white border-blue-700"
                                : q.status === "complete"
                                  ? "bg-green-600 text-white border-green-700"
                                  : q.status === "error"
                                    ? "bg-red-600 text-white border-red-700"
                                    : q.status === "waiting"
                                      ? "bg-yellow-400 text-black border-yellow-500"
                                      : "bg-gray-200 text-gray-800 border-gray-300"
                            }`}
                      >
                        {q.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-bold uppercase ${q.priority === "High" ? "text-accent" : "text-muted-foreground"}`}
                      >
                        {q.priority}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {q.userCode}
                    </TableCell>
                    <TableCell className="text-sm">{q.userName}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {q.createdAt}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {q.startTime}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {q.finishTime}
                    </TableCell>
                    <TableCell
                      className="text-xs text-destructive font-medium max-w-[150px] truncate"
                      title={q.reasonFail}
                    >
                      {q.reasonFail}
                    </TableCell>
                    <TableCell
                      className="font-mono text-[10px] max-w-[150px] truncate"
                      title={q.jsonConfig}
                    >
                      {q.jsonConfig}
                    </TableCell>
                    <TableCell
                      className="text-xs max-w-[150px] truncate"
                      title={q.filePath}
                    >
                      {q.filePath}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalResults={filteredDataLength}
            currentResults={paginatedData.length}
          />
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="brutalist-card bg-card sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="uppercase italic tracking-tight">
              Edit Queue: {editingQueue?.id}
            </DialogTitle>
          </DialogHeader>
          {editingQueue && (
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="factory"
                  className="text-right font-bold uppercase text-xs"
                >
                  Queue ID
                </Label>
                <Input
                  id="id"
                  value={editingQueue.id}
                  readOnly
                  className="col-span-3 brutalist-card bg-background"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="factory"
                  className="text-right font-bold uppercase text-xs"
                >
                  Factory
                </Label>
                <Input
                  id="factory"
                  value={editingQueue.factory}
                  readOnly
                  className="col-span-3 brutalist-card bg-background"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="robotName"
                  className="text-right font-bold uppercase text-xs"
                >
                  Robot
                </Label>
                <Input
                  id="robotName"
                  value={editingQueue.robotName}
                  readOnly
                  className="col-span-3 brutalist-card bg-background"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="status"
                  className="text-right font-bold uppercase text-xs text-cyan-600 dark:text-cyan-400"
                >
                  Status
                </Label>
                <Select
                  value={editingQueue.status}
                  onValueChange={(value: any) =>
                    setEditingQueue({ ...editingQueue, status: value })
                  }
                >
                  <SelectTrigger className="col-span-3 brutalist-card bg-blue-50 dark:bg-blue-900/20 border-blue-500 focus:ring-2 focus:ring-blue-500/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="brutalist-card bg-card">
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="waiting">Waiting</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="priority"
                  className="text-right font-bold uppercase text-xs text-cyan-600 dark:text-cyan-400"
                >
                  Priority
                </Label>
                <Select
                  value={editingQueue.priority}
                  onValueChange={(value: any) =>
                    setEditingQueue({ ...editingQueue, priority: value })
                  }
                >
                  <SelectTrigger className="col-span-3 brutalist-card bg-blue-50 dark:bg-blue-900/20 border-blue-500 focus:ring-2 focus:ring-blue-500/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="brutalist-card bg-card">
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="userCode"
                  className="text-right font-bold uppercase text-xs"
                >
                  User Code
                </Label>
                <Input
                  id="userCode"
                  value={editingQueue.userCode}
                  readOnly
                  className="col-span-3 brutalist-card bg-background"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="userName"
                  className="text-right font-bold uppercase text-xs"
                >
                  User Name
                </Label>
                <Input
                  id="userName"
                  value={editingQueue.userName}
                  readOnly
                  className="col-span-3 brutalist-card bg-background"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="createdAt"
                  className="text-right font-bold uppercase text-xs"
                >
                  Created
                </Label>
                <Input
                  id="createdAt"
                  type="datetime-local"
                  value={
                    editingQueue.createdAt
                      ? new Date(editingQueue.createdAt)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEditingQueue({
                      ...editingQueue,
                      createdAt: e.target.value,
                    })
                  }
                  className="col-span-3 brutalist-card bg-background"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSave}
              className="brutalist-card bg-primary text-black font-bold uppercase"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
