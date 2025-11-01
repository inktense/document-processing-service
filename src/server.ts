import "dotenv/config";
import pino from "pino";
import { createApp } from "./app.js";
import { connectToDatabase } from "./db/mongoose.js";
import "./services/queue.service.js";

const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });

async function main(): Promise<void> {
  if (!process.env.MONGODB_URI) {
    logger.warn("MONGODB_URI not set. API will run without database connection.");
  } else {
    await connectToDatabase(process.env.MONGODB_URI);
    logger.info("connected to MongoDB");
  }

  const app = createApp();
  const port = Number(process.env.PORT ?? 3000);

  app.listen(port, () => {
    logger.info({ port }, "server started");
  });
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error) => {
  // Do not leak secrets in logs
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.error("Failed to start server:", error?.message ?? error);
  process.exitCode = 1;
});


