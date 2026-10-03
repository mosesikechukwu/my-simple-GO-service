# My Simple Service

A hands-on DevOps and infrastructure engineering lab built around a small Go HTTP service.

The project started as a simple HTTP application and is being progressively expanded into a multi-service environment for learning:

* Linux
* Git and GitHub
* Go
* TypeScript
* Docker
* Docker Compose
* Traefik
* Networking
* Health checks
* Monitoring
* Logging
* Application error tracking
* Incident response
* Deployment
* Rollback
* Cloud infrastructure concepts

The goal is not just to build the application, but to learn how to **operate, monitor, troubleshoot, deploy, and recover services in a realistic environment.**

---

# Learning Journey

This project is being built incrementally rather than all at once.

Each stage introduces a new infrastructure or operational concept.

## Stage 1 — Build a Simple Go Service

The project started with a basic Go HTTP server.

Initial functionality:

```text
GET /
```

Response:

```text
Hello, World!
```

A health endpoint was then added:

```text
GET /health
```

Response:

```json
{"status":"ok"}
```

### What I learned

* Basic Go HTTP servers
* HTTP routes
* Listening on ports
* Health endpoints
* Testing services with `curl`
* The difference between an application and the infrastructure running it

---

# Stage 2 — Containerize the Application

The Go application was packaged into a Docker image.

A multi-stage Dockerfile was introduced so that the application could be compiled in one image and run in a smaller runtime image.

```text
Go source code
      |
      v
Builder container
      |
      | go build
      v
Compiled binary
      |
      v
Runtime container
```

### What I learned

* Docker images
* Containers
* Dockerfiles
* Build contexts
* Multi-stage builds
* Image tagging
* Container ports
* Container lifecycle

Example:

```bash
docker build -t my-simple-service:1.0.0 .
```

Run the container:

```bash
docker run -d \
  --name my-simple-service \
  -p 8080:8080 \
  my-simple-service:1.0.0
```

---

# Stage 3 — Docker Compose

The project was moved from manually running individual containers to Docker Compose.

This made it possible to define the service infrastructure as configuration.

```bash
docker compose up -d
```

Check the environment:

```bash
docker compose ps
```

### What I learned

* Compose services
* Declarative infrastructure
* Service configuration
* Docker networking
* Container lifecycle management
* Environment reproducibility

---

# Stage 4 — Add Traefik

Traefik was introduced as a reverse proxy.

Instead of accessing the Go service directly:

```text
Client → Go :8080
```

traffic now flows through:

```text
Client
   |
   v
Traefik :80
   |
   v
Go Service :8080
```

Traefik discovers the service through Docker labels.

Example:

```text
http://my-simple-service.localhost
```

is routed to:

```text
Go Service :8080
```

### What I learned

* Reverse proxies
* HTTP routing
* Docker labels
* Entry points
* Service discovery
* Layer 7 routing
* The difference between an application port and an exposed entry point

---

# Stage 5 — Health Checks

A Docker health check was added to determine whether the application is actually responding.

```yaml
healthcheck:
  test: ["CMD", "wget", "-qO-", "http://localhost:8080/health"]
  interval: 30s
  timeout: 5s
  retries: 3
  start_period: 5s
```

This introduced an important operational distinction:

```text
Container running
        ≠
Application healthy
```

A container can be running while the application inside it is broken.

### What I learned

* Application health
* Container health
* Health endpoints
* Automated health checks
* Basic service monitoring concepts

---

# Stage 6 — Add a TypeScript Microservice

The project is now being expanded beyond a single service.

A second microservice is being developed using TypeScript and Express.

```text
                    Traefik
                       |
             +---------+---------+
             |                   |
             v                   v
       Go Service        TypeScript Service
          :8080                :3000
```

The TypeScript service currently provides:

```text
GET /
GET /health
GET /api/status
```

Example:

```json
{
  "service": "typescript-service",
  "status": "running"
}
```

### What I learned

* TypeScript compilation
* Node.js services
* Express
* `package.json`
* `tsconfig.json`
* Build vs runtime dependencies
* Multi-stage Node.js Docker builds
* Running multiple services
* Port conflicts

A real operational issue occurred when port `3000` was already being used by a locally running Node process.

This reinforced the concept that:

```text
Host port → Container port
```

and that two processes cannot normally bind to the same host port.

---

# Current Architecture

The architecture is currently evolving toward:

```text
                         Client
                           |
                           v
                       Traefik
                         :80
                           |
                 Docker network
                    /          \
                   /            \
                  v              v
           Go Service      TypeScript Service
              :8080              :3000
                  \              /
                   \            /
                    \          /
                     Monitoring
```

The next stage is to integrate both services into the same Compose environment and route them through Traefik.

---

# Planned Monitoring Architecture

The monitoring layer will progressively introduce:

```text
                    Applications
                         |
              +----------+----------+
              |          |          |
              v          v          v
         Prometheus     Loki      Sentry
              |          |          |
              +----------+----------+
                         |
                         v
                       Grafana
```

### Prometheus

Used for metrics such as:

* CPU usage
* Memory usage
* Request counts
* Request latency
* Service availability

### Loki

Used for:

* Application logs
* Container logs
* Searching historical events
* Investigating incidents

### Grafana

Used to visualize:

* Metrics
* Logs
* Service health
* Dashboards
* Operational trends

### Sentry

Used for application-level errors and exceptions.

---

# Incident Response Learning

A major goal of this project is learning what happens when things break.

Instead of only learning how to make services work, I will intentionally introduce failures and investigate them.

Examples:

```text
Stop a container
      ↓
Detect failure
      ↓
Check service status
      ↓
Inspect logs
      ↓
Check health
      ↓
Identify root cause
      ↓
Recover service
      ↓
Verify recovery
      ↓
Document incident
```

Planned failure scenarios include:

* Container stopped
* Application crash
* Failed health check
* HTTP 500 errors
* Broken configuration
* Port conflicts
* Failed deployment
* Resource problems
* Reverse-proxy routing problems
* Broken service dependencies

---

# Deployment and Rollback

The project will eventually simulate a basic production deployment workflow:

```text
Developer changes code
        |
        v
Git commit
        |
        v
Build
        |
        v
Docker image
        |
        v
Deploy
        |
        v
Health check
        |
        +---- Healthy ----> Continue
        |
        +---- Failed -----> Investigate / Rollback
```

The goal is to understand not only how to deploy a service, but also what to do when a deployment fails.

---

# Security Considerations

**SECURITY CONSCIOUS**

This lab intentionally exposes and experiments with infrastructure components, but production systems should not be configured exactly like a learning environment.

Important areas I am learning to consider include:

* Avoiding unnecessary exposed ports
* Protecting administrative dashboards
* Limiting Docker socket access
* Managing secrets safely
* Using HTTPS/TLS
* Authentication and authorization
* Network segmentation
* Least-privilege access
* Secure container configuration
* Monitoring suspicious activity

For example, directly publishing:

```bash
-p 3000:3000
```

is useful for local testing, but the eventual architecture should prefer:

```text
Client
   |
   v
Traefik
   |
   +----> Go Service
   |
   +----> TypeScript Service
```

rather than exposing every microservice directly to the network.

---

# Git and GitHub Learning

The project is also being used to practice a real Git workflow.

The basic workflow is:

```text
Working directory
       |
       v
git add
       |
       v
Staging area
       |
       v
git commit
       |
       v
Local repository
       |
       v
git push
       |
       v
GitHub
```

Useful commands:

```bash
git status
git diff
git add .
git diff --cached
git commit
git push
```

The goal is to understand what each Git operation does rather than relying on automated workflows without understanding the underlying process.

---

# Project Structure

Current project structure:

```text
my-simple-service/
├── Dockerfile
├── compose.yml
├── go.mod
├── main.go
├── typescript-service/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── src/
│       └── index.ts
└── README.md
```

---

# Useful Commands

## Start the environment

```bash
docker compose up -d
```

## Check services

```bash
docker compose ps
```

## View logs

```bash
docker compose logs
```

## Follow logs

```bash
docker compose logs -f
```

## View a specific service

```bash
docker compose logs my-simple-service
```

## Validate Compose configuration

```bash
docker compose config --quiet
```

## Stop the environment

```bash
docker compose down
```

## Check Docker containers

```bash
docker ps
```

## Check Docker images

```bash
docker images
```

---

# Current Status

## Completed

* [x] Basic Go HTTP service
* [x] `/health` endpoint
* [x] Dockerfile
* [x] Multi-stage Go Docker build
* [x] Docker image
* [x] Docker Compose
* [x] Traefik reverse proxy
* [x] Traefik routing
* [x] Docker health check
* [x] LAN connectivity testing
* [x] Git/GitHub workflow
* [x] TypeScript service
* [x] TypeScript health endpoint
* [x] TypeScript Dockerfile
* [x] TypeScript Docker image
* [x] Running multiple services

## In Progress

* [ ] Integrate TypeScript service into Docker Compose
* [ ] Route both services through Traefik
* [ ] Improve service networking
* [ ] Add Prometheus
* [ ] Add Grafana
* [ ] Add Loki
* [ ] Add Sentry

## Planned

* [ ] Host monitoring
* [ ] Node Exporter
* [ ] Service dashboards
* [ ] Failure simulation
* [ ] Incident investigation
* [ ] Incident documentation
* [ ] Deployment workflow
* [ ] Rollback workflow
* [ ] Cloudflare integration
* [ ] Expand the architecture with additional services
* [ ] Introduce CI/CD

---

# What This Project Is Teaching Me

The main objective is to move beyond simply knowing individual tools.

I am learning how the pieces work together:

```text
Application
    ↓
Container
    ↓
Docker Compose
    ↓
Networking
    ↓
Reverse Proxy
    ↓
Monitoring
    ↓
Logging
    ↓
Error Tracking
    ↓
Incident Response
    ↓
Deployment
    ↓
Rollback
```

The project is intentionally being built step-by-step so that each new component solves a real operational problem introduced by the previous stage.

This repository documents that progression from a simple HTTP server toward a small, observable, multi-service infrastructure environment.

### Monitoring & Observability

Added a basic monitoring stack for the services in this lab.

#### Current Stack

* **Prometheus** — collects and stores metrics
* **Node Exporter** — exposes host-level metrics such as CPU, memory, disk, and network usage
* **Grafana** — visualizes collected metrics through dashboards
* **Go Prometheus Client** — exposes application/runtime metrics from the Go service
* **Traefik** — reverse proxy and HTTP routing layer

#### Monitoring Flow

```text
Host
 │
 └── Node Exporter
        │
        │ host metrics
        ↓
     Prometheus
        │
        │ time-series data
        ↓
      Grafana
```

Application monitoring:

```text
Go Service
    │
    └── /metrics
          │
          ↓
      Prometheus
          │
          ↓
       Grafana
```

#### Metrics Currently Monitored

**Infrastructure:**

* CPU utilization
* Memory utilization
* Disk utilization
* Network receive traffic
* Network transmit traffic

**Go Application:**

* Go runtime metrics
* Goroutine count
* Process/runtime metrics
* `/health` endpoint
* `/metrics` endpoint

#### Prometheus Targets

The current Prometheus configuration monitors:

```text
prometheus       → UP
node-exporter    → UP
go-service       → UP
```

This project has now progressed from simply running containers to monitoring both **infrastructure health and application-level metrics**.

### Next Monitoring Goals

* Add application request counters
* Monitor HTTP status codes and errors
* Monitor request latency
* Configure Prometheus alerting rules
* Add centralized logging with Loki
* Explore application error monitoring with Sentry
* Explore distributed tracing
