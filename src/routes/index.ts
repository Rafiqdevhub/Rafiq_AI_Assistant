import { Router, Request, Response } from "express";
import aiRoutes from "./aiRoutes";

const router = Router();

// Welcome route
router.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Welcome to Rafiq Portfolio AI Assistant API",
    version: "1.0.0",
    description:
      "AI-powered assistant for analyzing PDF documents using Google Gemini",
    endpoints: {
      health: "/health",
      api: "/api",
      ai: {
        status: "/api/ai/status",
        upload: "/api/ai/upload (POST)",
        ask: "/api/ai/ask (POST)",
        summary: "/api/ai/summary (GET)",
        extract: "/api/ai/extract (POST)",
        chat: "/api/ai/chat (POST)",
        loadDefault: "/api/ai/load-default (POST)",
        clearContext: "/api/ai/context (DELETE)",
      },
    },
  });
});

// Example route
router.get("/example", (_req: Request, res: Response) => {
  res.json({
    message: "This is an example endpoint",
    data: {
      timestamp: new Date().toISOString(),
    },
  });
});

// AI Assistant routes
router.use("/ai", aiRoutes);

export default router;
