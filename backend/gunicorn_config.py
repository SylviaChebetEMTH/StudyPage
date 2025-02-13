# gunicorn_config.py
from gevent import monkey
monkey.patch_all()

import os
from flask_socketio import SocketIO

# Gunicorn config variables
workers = 1
worker_class = "geventwebsocket.gunicorn.workers.GeventWebSocketWorker"
bind = "0.0.0.0:" + str(os.environ.get("PORT", 8000))
reload = True
# Increase timeout for WebSocket connections
timeout = 120

# Application config
wsgi_app = "app:app"  # replace with your app's import path