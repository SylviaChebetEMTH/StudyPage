#!/bin/bash
# Build script for Render deployment

echo "🔧 Installing Python dependencies..."
cd backend
pip install -r requirements.txt

echo "✅ Build completed successfully!"
