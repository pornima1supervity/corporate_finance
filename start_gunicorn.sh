#!/bin/sh

# Unified entrypoint script for the application
# Handles both development and production environments

set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting application..."

# Wait for database to be ready
echo "🔍 Waiting for database..."
python utils/wait_for_db.py

# Run database migrations
echo "📄 Running database migrations..."
alembic upgrade head

# Determine which gunicorn config to use based on environment
if [ "${APP_ENV}" = "production" ]; then
    echo "🏭 Starting production server..."
    exec gunicorn -c gunicorn/prod.py app.main:app
else
    echo "🛠️  Starting development server..."
    exec gunicorn -c gunicorn/dev.py app.main:app
fi
