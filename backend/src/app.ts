import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();


// 🔥 CORS FIX (MOST IMPORTANT)
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,               // allow cookies
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);


export default app;