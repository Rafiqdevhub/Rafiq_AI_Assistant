import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { config } from "../config/config";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private pdfContext: string = "";

  constructor() {
    if (!config.geminiApiKey) {
      throw new Error(
        "GEMINI_API_KEY is not configured in environment variables",
      );
    }

    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });
  }

  /**
   * Load PDF context for the AI assistant
   * @param context The extracted PDF text content
   */
  loadPDFContext(context: string): void {
    this.pdfContext = context;
  }

  /**
   * Get the current PDF context
   */
  getPDFContext(): string {
    return this.pdfContext;
  }

  /**
   * Ask a question to the AI assistant about the PDF content
   * @param question User's question
   * @returns AI response
   */
  async askQuestion(question: string): Promise<string> {
    try {
      if (!this.pdfContext) {
        throw new Error("No PDF context loaded. Please upload a PDF first.");
      }

      const prompt = `
You are an AI assistant helping users understand the content of a document.

Document Content:
${this.pdfContext}

User Question: ${question}

Please provide a clear, accurate, and helpful answer based on the document content above. If the answer cannot be found in the document, please state that clearly.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      throw new Error(
        `Failed to generate AI response: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Generate a summary of the PDF content
   * @returns Summary of the PDF
   */
  async generateSummary(): Promise<string> {
    try {
      if (!this.pdfContext) {
        throw new Error("No PDF context loaded. Please upload a PDF first.");
      }

      const prompt = `
Please provide a comprehensive summary of the following document:

${this.pdfContext}

Include the main points, key information, and important details.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      throw new Error(
        `Failed to generate summary: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Extract key information from the PDF
   * @param infoType Type of information to extract (e.g., 'skills', 'experience', 'education')
   * @returns Extracted information
   */
  async extractKeyInfo(infoType?: string): Promise<string> {
    try {
      if (!this.pdfContext) {
        throw new Error("No PDF context loaded. Please upload a PDF first.");
      }

      const specificRequest = infoType
        ? `Focus specifically on extracting information about: ${infoType}`
        : "Extract all key information including skills, experience, education, and contact details";

      const prompt = `
Analyze the following document and extract key information:

${this.pdfContext}

${specificRequest}

Present the information in a clear, structured format.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      throw new Error(
        `Failed to extract key information: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Chat with the AI using conversation history
   * @param messages Array of conversation messages
   * @returns AI response
   */
  async chat(
    messages: Array<{ role: string; content: string }>,
  ): Promise<string> {
    try {
      if (!this.pdfContext) {
        throw new Error("No PDF context loaded. Please upload a PDF first.");
      }

      // Build conversation context
      const conversationHistory = messages
        .map(
          (msg) =>
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
        )
        .join("\n");

      const prompt = `
You are an AI assistant helping users understand the content of a document.

Document Content:
${this.pdfContext}

Conversation History:
${conversationHistory}

User: ${messages[messages.length - 1].content}

Please provide a helpful response based on the document content and conversation context.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      throw new Error(
        `Failed to generate chat response: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Clear the loaded PDF context
   */
  clearContext(): void {
    this.pdfContext = "";
  }
}

export const geminiService = new GeminiService();
