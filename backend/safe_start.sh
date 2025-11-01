#!/bin/bash
# Safe start script that handles migrations correctly on redeploy

set -e  # Exit on any error

echo "🚀 Starting StudyPage backend deployment..."

# Set database URL from environment
export FLASK_APP=app.py

# Check if migrations folder exists, initialize only if it doesn't
if [ ! -d "migrations" ]; then
    echo "📁 Initializing migrations (first run)..."
    flask db init
else
    echo "✅ Migrations folder already exists, skipping init"
fi

# Always create and apply migrations (safe to run multiple times)
echo "🔄 Creating migration..."
flask db migrate -m "Auto migration" || echo "⚠️ No changes to migrate"

# Apply migrations
echo "⬆️  Applying migrations..."
flask db upgrade

# Run deployment script (will skip experts if they exist)
echo "🌱 Running deployment script..."
python deploy_with_data.py

echo "✅ Deployment complete!"

