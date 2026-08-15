import "dotenv/config";
import http from "http";

import app from "./app";
import { connectDatabase } from "./config/db";
import { initializeSocket } from "./socket/socket";

const PORT = Number(process.env.PORT) || 8008;

const startServer = async () => {
  try {
    
     //  Connect database
    await connectDatabase();

    
    // Create HTTP server
    const httpServer = http.createServer(app);

    
    // Initialize Socket.IO
    initializeSocket(httpServer);

    // Start server
    
    httpServer.listen(PORT, () => {
      console.log(`V-EGAL Socket Server running on port ${PORT}`);
      console.log(`Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start V-EGAL Socket Server:", error );
    process.exit(1);
  }
};

startServer();