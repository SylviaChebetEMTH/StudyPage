#!/bin/bash
# Production start script - seeds data if needed, then starts gunicorn

set -e

echo "🚀 Starting StudyPage backend (Production Mode)..."

cd "$(dirname "$0")"

# Step 1: Seed database if needed (runs quickly if data exists)
echo "🌱 Checking and seeding database..."
python -c "
import os
from deploy_with_data import create_database, seed_project_types_and_subjects, seed_services, seed_experts, create_admin_user
from app import app

# Set database URL
database_url = os.environ.get('DATABASE_URL') or os.environ.get('database_url')
if database_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url

with app.app_context():
    create_database()
    seed_project_types_and_subjects()
    seed_services()
    seed_experts()
    create_admin_user()
    print('✅ Database seeding complete!')
"

# Step 2: Start gunicorn with SocketIO support
echo "🚀 Starting Gunicorn server..."
PORT=${PORT:-8000}

exec gunicorn \
    --worker-class geventwebsocket.gunicorn.workers.GeventWebSocketWorker \
    --workers 1 \
    --bind "0.0.0.0:$PORT" \
    --timeout 120 \
    --log-level info \
    --access-logfile - \
    --error-logfile - \
    app:app

