import "dotenv/config";
import http from "http";
import { initializeSocket } from "./socket/server/socket";

const port = Number(process.env.PORT) || 3001;

const server = http.createServer();

initializeSocket(server);

server.listen(port, () => {
  console.log(`Socket.IO server running on port ${port}`);
});