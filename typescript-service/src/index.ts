import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (_req, res) => {
  res.send("Hello from TypeScript!");
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/status", (_req, res) => {
  res.json({
    service: "typescript-service",
    status: "running"
  });
});

app.listen(PORT, () => {
  console.log(`TypeScript service listening on port ${PORT}`);
});
