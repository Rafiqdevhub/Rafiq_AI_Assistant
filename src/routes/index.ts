import { Router, Request, Response } from "express";

const router = Router();

// Welcome route
router.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Welcome to Portfolio AI Assistant API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api",
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

export default router;
