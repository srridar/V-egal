import http from "http";
import next from "next";

const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handler = app.getRequestHandler();

const port = Number(process.env.PORT) || 3000;

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handler(req, res);
  });

  server.listen(port, () => {
    console.log(`Next.js server running on port ${port}`);
  });
});