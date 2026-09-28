FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o my-simple-service .

FROM alpine:latest

RUN adduser -D appuser

WORKDIR /app

COPY --from=builder /app/my-simple-service .

USER appuser

EXPOSE 8080

CMD ["./my-simple-service"]
