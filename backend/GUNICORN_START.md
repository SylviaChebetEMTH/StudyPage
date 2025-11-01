# Gunicorn Start Command Guide

## ✅ Simple Solution: Use Gunicorn Directly

Since you're having migration issues and your database already has the schema, you can skip migrations entirely and use Gunicorn directly.

## 🎯 Recommended Start Commands

### Option 1: Python Script (Recommended)
**Start Command:**
```bash
cd backend && python start_with_gunicorn.py
```

**What it does:**
1. ✅ Seeds database (skips if data exists)
2. ✅ Starts Gunicorn with SocketIO support
3. ✅ No migration issues - uses `db.create_all()` directly

### Option 2: Bash Script
**Start Command:**
```bash
cd backend && bash start_production.sh
```

**What it does:**
Same as Python script, just in bash.

### Option 3: Pure Gunicorn (If data already seeded)
**Start Command:**
```bash
cd backend && gunicorn --worker-class geventwebsocket.gunicorn.workers.GeventWebSocketWorker --workers 1 --bind 0.0.0.0:$PORT --timeout 120 app:app
```

⚠️ **Note:** This won't seed data, so use only if:
- Data is already in the database
- You seed data separately
- First deployment

## 📊 What Happens

### First Deployment:
1. ✅ Seeds project types, subjects, services
2. ✅ Generates 213 experts
3. ✅ Creates admin user
4. ✅ Starts Gunicorn server

### Subsequent Deployments:
1. ✅ Skips data seeding (experts, services already exist)
2. ✅ Starts Gunicorn server immediately
3. ✅ Your code changes deploy successfully

## 🔧 Gunicorn Configuration

The scripts use these settings:
- **Worker Class:** `geventwebsocket.gunicorn.workers.GeventWebSocketWorker` (for SocketIO)
- **Workers:** 1 (for SocketIO compatibility)
- **Timeout:** 120 seconds (for WebSocket connections)
- **Port:** From `$PORT` environment variable

## 🚀 Render Dashboard Setup

**Start Command:**
```
cd backend && python start_with_gunicorn.py
```

**Or:**
```
cd backend && bash start_production.sh
```

## ✅ Benefits

- ✅ **No migration issues** - Uses `db.create_all()` directly
- ✅ **Fast redeploys** - Skips data seeding if exists
- ✅ **Production ready** - Gunicorn is industry standard
- ✅ **SocketIO support** - Proper worker class for WebSockets
- ✅ **Simple** - No complex migration logic

## 🔄 If You Need to Reset Data

If you ever need to regenerate experts:
```bash
FORCE_REGEN_EXPERTS=true python deploy_with_data.py
```

Then restart your server.

## 📝 Migration Notes

- Migrations folder is **not needed** with this approach
- `db.create_all()` creates/updates tables automatically
- Schema changes require manual handling or going back to migrations
- For schema changes, consider committing migrations folder to git

