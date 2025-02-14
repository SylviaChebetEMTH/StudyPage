#!/usr/bin/env bash
# run.sh

# Make the script executable
chmod +x run.sh

# Install gevent and gevent-websocket
pip install gevent gevent-websocket

# Run gunicorn with the proper worker class
exec gunicorn --worker-class geventwebsocket.gunicorn.workers.GeventWebSocketWorker \
              --workers 1 \
              --bind 0.0.0.0:$PORT \
              --timeout 120 \
              --log-level debug \
              app:app
              