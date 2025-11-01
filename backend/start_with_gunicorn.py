#!/usr/bin/env python3
"""
Production start script that seeds data then starts gunicorn.
This avoids migration issues and works reliably on Render.
"""

import os
import sys
import subprocess

def main():
    """Main start sequence for production."""
    print("🚀 Starting StudyPage backend (Production Mode)...")
    print("="*60)
    
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    # Set Flask app
    os.environ['FLASK_APP'] = 'app.py'
    
    # Get database URL
    database_url = os.environ.get('DATABASE_URL') or os.environ.get('database_url')
    if database_url:
        print(f"🔗 Database: {database_url[:50]}...")
    else:
        print("⚠️ No DATABASE_URL found, using default SQLite")
    
    # Step 1: Seed database if needed
    print("\n🌱 Seeding database (will skip if data exists)...")
    try:
        from deploy_with_data import seed_all_data
        from app import app
        
        if database_url:
            app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        
        seed_all_data()
    except Exception as e:
        print(f"⚠️ Database seeding failed: {e}")
        print("   Continuing anyway - app will start but may have incomplete data")
        import traceback
        traceback.print_exc()
    
    # Step 2: Start gunicorn
    print("\n🚀 Starting Gunicorn server...")
    port = os.environ.get('PORT', '8000')
    
    # Build gunicorn command
    cmd = [
        'gunicorn',
        '--worker-class', 'geventwebsocket.gunicorn.workers.GeventWebSocketWorker',
        '--workers', '1',
        '--bind', f'0.0.0.0:{port}',
        '--timeout', '120',
        '--log-level', 'info',
        '--access-logfile', '-',
        '--error-logfile', '-',
        'app:app'
    ]
    
    print(f"   Command: {' '.join(cmd)}")
    print("="*60)
    
    # Start gunicorn (this will replace the current process)
    os.execvp('gunicorn', cmd)

if __name__ == '__main__':
    main()

