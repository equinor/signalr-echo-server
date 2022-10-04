#!/bin/sh

# Autogenerates a version file using git semver
OUTPUT_FILE="BuildInformation.json"

# Set Build Details
APP_NAME="SignalR Echo Server"
GIT_VERSION=$(git describe --tags --always)
CURRENT_DATE=$(date +"%Y-%m-%dT%T%z")

# Write data to file
printf '{
  "name":"%s",
  "version":"%s",
  "created":"%s"
}
' "$APP_NAME" "$GIT_VERSION" "$CURRENT_DATE" > $OUTPUT_FILE

