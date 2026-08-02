import http from 'http';
import next from 'next';

import { initializeSocket } from './socket/server/socket';

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();
const port = 3000;


app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handler(req, res);
  });

  initializeSocket(server);

  server.listen(port, () => {
    console.log(` Server running at http://localhost:${port}`);
  });
});