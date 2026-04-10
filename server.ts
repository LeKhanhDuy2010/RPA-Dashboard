import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mock RPA Data API
  app.get("/api/rpa/summary", (req, res) => {
    res.json({
      totalQueue: 1250,
      successRate: 94.5,
      errorRate: 5.5,
      activeBots: 12,
      pendingTasks: 45,
      completedToday: 1180,
      failedToday: 70
    });
  });

  app.get("/api/rpa/hourly-stats", (req, res) => {
    const stats = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      success: Math.floor(Math.random() * 100) + 50,
      error: Math.floor(Math.random() * 10)
    }));
    res.json(stats);
  });

  app.get("/api/rpa/queues", (req, res) => {
    res.json([
      { id: "Q-001", name: "Invoice Processing", status: "Active", priority: "High", load: 85 },
      { id: "Q-002", name: "Customer Onboarding", status: "Active", priority: "Medium", load: 42 },
      { id: "Q-003", name: "Data Migration", status: "Idle", priority: "Low", load: 0 },
      { id: "Q-004", name: "Email Automation", status: "Active", priority: "High", load: 91 },
      { id: "Q-005", name: "Report Generation", status: "Error", priority: "Medium", load: 15 }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
