//app.ts

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import userRoutes from "./routes/user.routes.js";
import technicianRoutes from "./routes/technician.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import productRoutes from "./routes/product.routes.js";
import bookingRoutes from "./routes/bookings.routes.js"
import feedbackRoutes from "./routes/feedback.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import cookieParser from "cookie-parser"
import adminBookingRoutes from "./routes/admin.booking.routes.js";
import settlementRoutes from "./routes/settlement.routes.js";
import serviceReportRoutes from "./routes/service-report.routes.js";
import technicianJobRoutes from "./routes/technicianJob.routes.js";



const app = express();
app.use(cookieParser())



// 🔥 CORS FIX (MOST IMPORTANT)
// CORS
const allowedOrigins = [
  "https://metro-cool.vercel.app",
  "https://metro-cool-p3g4.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// 🔥 THIS IS THE REAL FIX
app.options(/.*/, cors());


// ✅ Health check
app.get("/", (_req, res) => {
  res.send("Metro Cool API running 🚀")
})

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/products", productRoutes);


app.use("/api/admin", adminBookingRoutes)

app.use("/api/user", userRoutes);
app.use("/api/technician", technicianRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes)
app.use("/api/feedbacks", feedbackRoutes)
app.use("/api/settlements", settlementRoutes)

app.use("/api/service-report", serviceReportRoutes);

app.use("/api/tech-jobs", technicianJobRoutes);




// Payment 

app.use("/api/payments", paymentRoutes)


// 🔥 Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


export default app;