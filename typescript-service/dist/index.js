"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
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
