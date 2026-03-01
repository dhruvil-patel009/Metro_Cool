// server.ts
import "dotenv/config";
import http from "http";
import app from "./app.js";
import "./jobs/settlement.cron.js"

const PORT = Number(process.env.PORT) || 5000;

/**
 * ❗ Create HTTP server manually
 * This keeps Node's event loop alive on Windows
 */
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/**
 * graceful shutdown (VERY important for nodemon + tsx)
 */
const shutdown = () => {
  console.log("🛑 Closing server...");
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);