import express from "express";
import client from "prom-client";

const app = express();
const PORT = 3000;

// Collect standard Node.js metrics
client.collectDefaultMetrics();

// Count HTTP requests
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

// Count every incoming HTTP request
app.use((req, res, next) => {
 res.on("finish", () => {
  httpRequestsTotal.inc({
	method: req.method,
	route: req.route?.path || req.path,
	status_code: res.statusCode.toString(),
	});
});
  next();
});

// Home route
app.get("/", (_req, res) => {
  res.send("Hello from TypeScript!");
});

// Health check route
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// API status route
app.get("/api/status", (_req, res) => {
  res.json({
    service: "typescript-service",
    status: "running"
  });
});

// Prometheus metrics endpoint
app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Start server
app.listen(PORT, () => {
  console.log(`TypeScript service listening on port ${PORT}`);
});
