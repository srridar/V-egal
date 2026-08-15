import "dotenv/config";
import http from "http";
import app from "./app";
import { connectDatabase } from "./config/db";
import { initializeSocket } from "./socket/socket";

const PORT = Number(process.env.PORT) || 8008;

const startServer = async () => {
  try {
    await connectDatabase();

    const httpServer = http.createServer(app);

    initializeSocket(httpServer);

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`V-EGAL Socket Server running on port ${PORT}`);
      console.log(`Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start V-EGAL Socket Server:", error);
    process.exit(1);
  }
};

startServer();  