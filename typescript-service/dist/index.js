"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prom_client_1 = __importDefault(require("prom-client"));
const app = (0, express_1.default)();
const PORT = 3000;
// Collect standard Node.js metrics
prom_client_1.default.collectDefaultMetrics();
// Count HTTP requests
const httpRequestsTotal = new prom_client_1.default.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
});
// Count every incoming HTTP request
app.use((_req, _res, next) => {
    httpRequestsTotal.inc();
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
    res.set("Content-Type", prom_client_1.default.register.contentType);
    res.end(await prom_client_1.default.register.metrics());
});
// Start server
app.listen(PORT, () => {
    console.log(`TypeScript service listening on port ${PORT}`);
});
