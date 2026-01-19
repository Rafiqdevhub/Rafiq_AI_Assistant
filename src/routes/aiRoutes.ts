/// <reference path="../types/express.d.ts" />
import { Router, Request, Response } from "express";
import { upload } from "../middleware/upload";
import { pdfService } from "../services/pdfService";
import { geminiService } from "../services/geminiService";
import path from "path";

const router = Router();

// Load default PDF (Rafiq CV.pdf) on startup
const defaultPDFPath = path.join(process.cwd(), "Rafiq CV.pdf");

// Initialize with default PDF
(async () => {
  try {
    const exists = await pdfService.fileExists(defaultPDFPath);
    if (exists) {
      const text = await pdfService.extractText(defaultPDFPath);
      geminiService.loadPDFContext(text);
      console.log("✅ Default PDF (Rafiq CV.pdf) loaded successfully");
    }
  } catch (error) {
    console.error("⚠️ Could not load default PDF:", (error as Error).message);
  }
})();

/**
 * GET /api/ai/status
 * Check if PDF context is loaded
 */
router.get("/status", (_req: Request, res: Response) => {
  const hasContext = geminiService.getPDFContext().length > 0;
  res.json({
    success: true,
    contextLoaded: hasContext,
    message: hasContext
      ? "PDF context is loaded and ready"
      : "No PDF context loaded. Please upload a PDF.",
  });
});

/**
 * POST /api/ai/upload
 * Upload and process a PDF file
 */
router.post(
  "/upload",
  upload.single("pdf"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: "No PDF file uploaded",
        });
        return;
      }

      // Extract text from uploaded PDF
      const text = await pdfService.extractText(req.file.path);

      // Load context into Gemini service
      geminiService.loadPDFContext(text);

      // Get metadata
      const metadata = await pdfService.getMetadata(req.file.path);

      res.json({
        success: true,
        message: "PDF uploaded and processed successfully",
        file: {
          originalName: req.file.originalname,
          size: req.file.size,
          pages: metadata.numpages,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  },
);

/**
 * POST /api/ai/ask
 * Ask a question about the loaded PDF
 */
router.post("/ask", async (req: Request, res: Response): Promise<void> => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      res.status(400).json({
        success: false,
        error: "Question is required and must be a string",
      });
      return;
    }

    const answer = await geminiService.askQuestion(question);

    res.json({
      success: true,
      question,
      answer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * GET /api/ai/summary
 * Get a summary of the loaded PDF
 */
router.get("/summary", async (_req: Request, res: Response) => {
  try {
    const summary = await geminiService.generateSummary();

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * POST /api/ai/extract
 * Extract specific information from the PDF
 */
router.post("/extract", async (req: Request, res: Response) => {
  try {
    const { infoType } = req.body;

    const info = await geminiService.extractKeyInfo(infoType);

    res.json({
      success: true,
      infoType: infoType || "all",
      info,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * POST /api/ai/chat
 * Have a conversation with the AI about the PDF
 */
router.post("/chat", async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({
        success: false,
        error: "Messages array is required",
      });
      return;
    }

    const response = await geminiService.chat(messages);

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * POST /api/ai/load-default
 * Load the default PDF (Rafiq CV.pdf)
 */
router.post(
  "/load-default",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const exists = await pdfService.fileExists(defaultPDFPath);

      if (!exists) {
        res.status(404).json({
          success: false,
          error: "Default PDF (Rafiq CV.pdf) not found",
        });
        return;
      }

      const text = await pdfService.extractText(defaultPDFPath);
      geminiService.loadPDFContext(text);

      const metadata = await pdfService.getMetadata(defaultPDFPath);

      res.json({
        success: true,
        message: "Default PDF loaded successfully",
        file: {
          name: "Rafiq CV.pdf",
          pages: metadata.numpages,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  },
);

/**
 * DELETE /api/ai/context
 * Clear the loaded PDF context
 */
router.delete("/context", (_req: Request, res: Response) => {
  try {
    geminiService.clearContext();
    res.json({
      success: true,
      message: "PDF context cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

export default router;
