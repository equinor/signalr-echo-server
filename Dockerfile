FROM mcr.microsoft.com/dotnet/sdk:6.0-alpine AS build-env
WORKDIR /app/signalr_echo

# Copy and build
COPY . .
RUN dotnet publish SignalrEchoServer -c Release -o out

# Set build information
RUN chmod +x ./build_information.sh \
    && ./build_information.sh \
    && cp BuildInformation.json out/

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine

LABEL org.opencontainers.image.source=https://github.com/equinor/signalr-echo-server
LABEL org.opencontainers.image.description="SignalR Echo Server"
LABEL org.opencontainers.image.licenses=MIT

WORKDIR /app
COPY --from=build-env /app/signalr_echo/out .

# expose port 5000
ENV ASPNETCORE_URLS http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "SignalrEchoServer.dll"]