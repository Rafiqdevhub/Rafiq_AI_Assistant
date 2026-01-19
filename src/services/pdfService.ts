import fs from "fs/promises";
import path from "path";

let pdfParseClass: any = null;

// Initialize pdf-parse
const initPdfParse = async () => {
  try {
    const pdfModule = eval("require")("pdf-parse");
    pdfParseClass = pdfModule.PDFParse;
    console.log("PDF-Parse loaded successfully");
  } catch (error) {
    console.error("Failed to load pdf-parse:", error);
  }
};

// Initialize on module load
initPdfParse();

// Helper function to parse PDF
async function parsePDF(buffer: Buffer): Promise<any> {
  if (!pdfParseClass) {
    throw new Error("PDF-Parse is not initialized");
  }

  // Use a writable path: Vercel serverless allows writing to /tmp
  const writableRoot = process.env.VERCEL ? "/tmp" : process.cwd();

  // Create a temporary file to write the buffer
  const tempFilePath = path.join(
    writableRoot,
    ".temp-pdf-" + Date.now() + ".pdf",
  );
  await fs.writeFile(tempFilePath, buffer);

  try {
    // Create file URL
    const fileUrl = "file://" + tempFilePath.replace(/\\/g, "/");

    // Create parser instance with file URL
    const options = { verbosity: 0, url: fileUrl };
    const parser = new pdfParseClass(options);

    // Load the PDF
    await parser.load();

    // Get text
    const textData = await parser.getText();

    return {
      text: textData.text || "",
      numpages: textData.total || 0,
      pages: textData.pages || [],
      info: textData.info || {},
      metadata: textData.metadata || {},
      version: "2.4.5",
    };
  } finally {
    // Clean up temp file
    try {
      await fs.unlink(tempFilePath);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

export class PDFService {
  /**
   * Extract text content from a PDF file
   * @param filePath Path to the PDF file
   * @returns Extracted text content
   */
  async extractText(filePath: string): Promise<string> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await parsePDF(dataBuffer);
      return data.text;
    } catch (error) {
      throw new Error(
        `Failed to extract PDF text: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Extract text from PDF buffer (for uploaded files)
   * @param buffer PDF file buffer
   * @returns Extracted text content
   */
  async extractTextFromBuffer(buffer: Buffer): Promise<string> {
    try {
      const data = await parsePDF(buffer);
      return data.text;
    } catch (error) {
      throw new Error(
        `Failed to extract PDF text from buffer: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Get PDF metadata
   * @param filePath Path to the PDF file
   * @returns PDF metadata including number of pages, title, etc.
   */
  async getMetadata(filePath: string): Promise<{
    numpages: number;
    info: any;
    metadata: any;
    version: string;
  }> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await parsePDF(dataBuffer);
      return {
        numpages: data.numpages,
        info: data.info,
        metadata: data.metadata,
        version: data.version,
      };
    } catch (error) {
      throw new Error(
        `Failed to get PDF metadata: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Check if file exists
   * @param filePath Path to check
   * @returns boolean
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

export const pdfService = new PDFService();
