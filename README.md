# My Simple Service

A small Go HTTP service used as the foundation for a hands-on DevOps and infrastructure monitoring lab.

The project progressively integrates:

* Go
* Docker
* Docker Compose
* Traefik
* Container health checks
* Prometheus
* Grafana
* Loki
* Sentry
* Failure simulation
* Incident investigation and recovery
* Deployment and rollback practices

## Current Architecture

```text
                    Client
                      |
                      | HTTP
                      v
               +--------------+
               |   Traefik    |
               |    :80       |
               +------+-------+
                      |
                Docker network
                      |
                      v
               +--------------+
               | Go Service   |
               |    :8080     |
               +------+-------+
                      |
                /health
                      |
                      v
                {"status":"ok"}
```

## Project Structure

```text
my-simple-service/
├── Dockerfile
├── compose.yml
├── go.mod
├── main.go
└── README.md
```

## Application Endpoints

### `/`

Returns:

```text
Hello, World!
```

### `/health`

Returns:

```json
{"status":"ok"}
```

The health endpoint is used by the Docker health check.

## Running the Project

From this directory:

```bash
docker compose up -d
```

Check the containers:

```bash
docker compose ps
```

Test the service through Traefik:

```bash
curl http://my-simple-service.localhost/health
```

Expected response:

```json
{"status":"ok"}
```

Stop the stack:

```bash
docker compose down
```

## Docker

The application is packaged into a Docker image using a multi-stage Dockerfile.

Build the image manually:

```bash
docker build -t my-simple-service:1.0.0 .
```

The final container runs the compiled Go binary on port `8080`.

## Traefik

Traefik acts as the reverse proxy for the application.

The routing configuration is defined through Docker labels in `compose.yml`.

Requests to:

```text
http://my-simple-service.localhost
```

are routed by Traefik to the Go application on port `8080`.

## Health Check

Docker periodically requests:

```text
http://localhost:8080/health
```

The container is considered healthy when the endpoint responds successfully.

Health-check configuration:

```yaml
healthcheck:
  test: ["CMD", "wget", "-qO-", "http://localhost:8080/health"]
  interval: 30s
  timeout: 5s
  retries: 3
  start_period: 5s
```

This allows us to distinguish between:

```text
Container running
```

and:

```text
Application healthy
```

## DevOps Learning Objectives

This project is intentionally being developed incrementally to simulate a real service-management workflow.

The planned progression is:

1. Build the application
2. Containerize the application
3. Manage it with Docker Compose
4. Route traffic through Traefik
5. Add health checks
6. Collect application and infrastructure metrics with Prometheus
7. Visualize metrics with Grafana
8. Collect and search logs with Loki
9. Track application errors with Sentry
10. Simulate service failures
11. Investigate incidents
12. Recover failed services
13. Implement deployment and rollback procedures
14. Expand the setup into multiple services

## Useful Commands

Check running containers:

```bash
docker compose ps
```

View application logs:

```bash
docker compose logs my-simple-service
```

View Traefik logs:

```bash
docker compose logs traefik
```

Follow logs:

```bash
docker compose logs -f
```

Validate Compose configuration:

```bash
docker compose config --quiet
```

Stop and remove the Compose stack:

```bash
docker compose down
```

## Status

Current components:

* [x] Go HTTP service
* [x] Dockerfile
* [x] Docker image
* [x] Docker Compose
* [x] Traefik reverse proxy
* [x] Traefik routing
* [x] Docker health check
* [ ] Prometheus
* [ ] Grafana
* [ ] Loki
* [ ] Sentry
* [ ] Failure simulation
* [ ] Incident response exercises
* [ ] Deployment automation
* [ ] Rollback workflow
* [ ] Multiple-service architecture

