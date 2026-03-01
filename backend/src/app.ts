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
import userOrdersRoutes from "./routes/userOrders.routes.js";
import addressRoutes from "./routes/address.routes.js";
import pushRoutes from "./routes/push.routes.js";
import serviceContentRoutes from "./routes/serviceContent.routes.js";
import serviceDetailsRoutes from "./routes/serviceDetails.routes.js";



const app = express();
app.use(cookieParser())



/* =========================
   🔥 CORS (FINAL FIX)
========================= */

const allowedOrigins = [
  "http://localhost:3000",
  "https://metro-cool.vercel.app",
  "https://metro-cool-p3g4.vercel.app",
  "https://metro-cool.com",
  "https://www.metro-cool.com"
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization"
  ],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions))

// ⭐ REAL PREVENTION FOR PREFLIGHT LOOP
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204)
  }
  next()
})




/* =========================
   HEALTH CHECK
========================= */

app.get("/", (_req, res) => {
  res.send("Metro Cool API running 🚀");
});

app.use((req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    return next(); // 🔥 skip body parser for file uploads
  }
  express.json({ limit: "10mb" })(req, res, next);
});

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/service-content", serviceContentRoutes);
app.use("/api/service-details", serviceDetailsRoutes);


app.use("/api/admin", adminBookingRoutes)

app.use("/api/user", userRoutes);
app.use("/api/technician", technicianRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes)
app.use("/api/feedbacks", feedbackRoutes)
app.use("/api/settlements", settlementRoutes)

app.use("/api/service-report", serviceReportRoutes);

app.use("/api/tech-jobs", technicianJobRoutes);

app.use("/api/users", userOrdersRoutes)

app.use("/api/addresses", addressRoutes)


app.use("/api/push", pushRoutes)

app.use("/api/technicians", technicianRoutes)

// Payment 

app.use("/api/payments", paymentRoutes)


// 🔥 Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));




export default app;