import express, { type Request, type Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import recipeRoutes from "./routes/recipeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { getDatabase } from "./services/database.js";
import { swaggerSpec } from "./config/swagger.js";
import { promises as fs } from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 */
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Recipe Organizer API is running",
    timestamp: new Date().toISOString(),
  });
});

// Initialize database
getDatabase();

// Ensure uploads directory exists
(async () => {
  try {
    await fs.mkdir("uploads", { recursive: true });
  } catch (error) {
    console.error("Error creating uploads directory:", error);
  }
})();

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/upload", uploadRoutes);

// Root endpoint
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Welcome to Recipe Organizer API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      recipes: "/api/recipes",
      docs: "/api-docs",
    },
  });
});

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🍳 Recipes API: http://localhost:${PORT}/api/recipes`);
});

