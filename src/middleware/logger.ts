import morgan, { StreamOptions } from "morgan";
import { Request } from "express";

// Use stdout for logs
const stream: StreamOptions = {
  write: (message) => process.stdout.write(message),
};

// Skip logging for health checks to reduce noise
const skip = (req: Request): boolean => req.path === "/health";

// Define custom tokens for clarity (cast to Express Request for typing)
morgan.token("remote-addr", (req) => {
  const r = req as Request;
  return r.ip || r.socket?.remoteAddress || "-";
});

morgan.token("user-agent", (req) => {
  const ua = (req as Request).headers["user-agent"];
  if (typeof ua === "string") return ua;
  if (Array.isArray(ua)) return (ua as string[]).join(" ");
  return "-";
});

export const httpLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :remote-addr :user-agent",
  { stream, skip },
);
