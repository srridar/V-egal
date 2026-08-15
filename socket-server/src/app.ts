import express from "express";
import cors from "cors";

const app = express();

const clientUrl = process.env.CLIENT_URL;

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

app.use(express.json());


//  Health check
 
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "v-egal-socket-server",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

export default app;