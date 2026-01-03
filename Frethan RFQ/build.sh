#!/bin/bash
set -e

echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la

echo "Checking for frontend directory..."
if [ -d "frontend" ]; then
  echo "Frontend directory found!"
  cd frontend
  echo "Current directory after cd: $(pwd)"
  npm install
  npm run build
  echo "Build completed successfully!"
else
  echo "ERROR: frontend directory not found!"
  echo "Available directories:"
  ls -la
  exit 1
fi

