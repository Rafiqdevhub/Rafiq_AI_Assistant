import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { config } from "../config/config";

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;
let pdfContext = "";

function ensureModel(): GenerativeModel {
  if (!config.geminiApiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in environment variables",
    );
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
  }
  if (!model) {
    model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
  }
  return model;
}

function loadPDFContext(context: string): void {
  pdfContext = context;
}

function getPDFContext(): string {
  return pdfContext;
}

async function askQuestion(question: string): Promise<string> {
  try {
    if (!pdfContext) {
      throw new Error("No PDF context loaded. Please upload a PDF first.");
    }

    const prompt = `
You are an AI assistant helping users understand the content of a document.

Document Content:
${pdfContext}

User Question: ${question}

Please provide a clear, accurate, and helpful answer based on the document content above. If the answer cannot be found in the document, please state that clearly.
`;

    const mdl = ensureModel();
    const result = await mdl.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(
      `Failed to generate AI response: ${(error as Error).message}`,
    );
  }
}

async function generateSummary(): Promise<string> {
  try {
    if (!pdfContext) {
      throw new Error("No PDF context loaded. Please upload a PDF first.");
    }

    const prompt = `
Please provide a comprehensive summary of the following document:

${pdfContext}

Include the main points, key information, and important details.
`;

    const mdl = ensureModel();
    const result = await mdl.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(`Failed to generate summary: ${(error as Error).message}`);
  }
}

async function extractKeyInfo(infoType?: string): Promise<string> {
  try {
    if (!pdfContext) {
      throw new Error("No PDF context loaded. Please upload a PDF first.");
    }

    const specificRequest = infoType
      ? `Focus specifically on extracting information about: ${infoType}`
      : "Extract all key information including skills, experience, education, and contact details";

    const prompt = `
Analyze the following document and extract key information:

${pdfContext}

${specificRequest}

Present the information in a clear, structured format.
`;

    const mdl = ensureModel();
    const result = await mdl.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(
      `Failed to extract key information: ${(error as Error).message}`,
    );
  }
}

async function chat(
  messages: Array<{ role: string; content: string }>,
): Promise<string> {
  try {
    if (!pdfContext) {
      throw new Error("No PDF context loaded. Please upload a PDF first.");
    }

    const conversationHistory = messages
      .map(
        (msg) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
      )
      .join("\n");

    const prompt = `
You are an AI assistant helping users understand the content of a document.

Document Content:
${pdfContext}

Conversation History:
${conversationHistory}

User: ${messages[messages.length - 1].content}

Please provide a helpful response based on the document content and conversation context.
`;

    const mdl = ensureModel();
    const result = await mdl.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(
      `Failed to generate chat response: ${(error as Error).message}`,
    );
  }
}

function clearContext(): void {
  pdfContext = "";
}

export const geminiService = {
  loadPDFContext,
  getPDFContext,
  askQuestion,
  generateSummary,
  extractKeyInfo,
  chat,
  clearContext,
};
