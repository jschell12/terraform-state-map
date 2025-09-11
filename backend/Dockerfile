FROM golang:1.22 AS build
WORKDIR /src

# deps layer
COPY go.mod ./
RUN go mod download

# source
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /apiserver ./cmd/apiserver

FROM gcr.io/distroless/static-debian12
COPY --from=build /apiserver /apiserver
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/apiserver"]
