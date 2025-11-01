#!/usr/bin/env python3
"""
Safe start script that handles migrations and deployment correctly on redeploy.
This script is designed to work reliably whether it's the first run or a redeploy.
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(cmd, description, ignore_errors=False):
    """Run a shell command and handle errors gracefully."""
    print(f"\n{'='*60}")
    print(f"📌 {description}")
    print(f"🔧 Running: {cmd}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            check=not ignore_errors,
            capture_output=True,
            text=True
        )
        if result.stdout:
            print(result.stdout)
        if result.returncode == 0:
            print(f"✅ {description} - Success!")
        else:
            if ignore_errors:
                print(f"⚠️ {description} - Skipped (non-critical)")
            else:
                print(f"❌ {description} - Failed!")
                print(result.stderr)
                return False
        return True
    except subprocess.CalledProcessError as e:
        if ignore_errors:
            print(f"⚠️ {description} - Skipped (expected)")
            return True
        print(f"❌ {description} - Error: {e}")
        print(e.stderr)
        return False

def main():
    """Main start sequence."""
    print("🚀 Starting StudyPage backend deployment...")
    print("="*60)
    
    # Set Flask app
    os.environ['FLASK_APP'] = 'app.py'
    
    # Get database URL
    database_url = os.environ.get('DATABASE_URL') or os.environ.get('database_url')
    if database_url:
        print(f"🔗 Database: {database_url[:50]}...")
    else:
        print("⚠️ No DATABASE_URL found, using default SQLite")
    
    # Step 1: Initialize migrations (only if needed)
    migrations_dir = Path("migrations")
    if not migrations_dir.exists():
        print("\n📁 Migrations folder not found - this is the first run")
        if not run_command("flask db init", "Initialize migrations"):
            print("❌ Failed to initialize migrations!")
            sys.exit(1)
    else:
        print("\n✅ Migrations folder exists - skipping init (safe for redeploy)")
    
    # Step 2: Create migration (safe to run multiple times)
    # This will only create a migration if there are model changes
    run_command(
        "flask db migrate -m 'Auto migration'",
        "Create migration",
        ignore_errors=True  # No changes = no error, just skip
    )
    
    # Step 3: Apply migrations (idempotent - safe to run multiple times)
    if not run_command("flask db upgrade", "Apply migrations"):
        print("❌ Failed to apply migrations!")
        sys.exit(1)
    
    # Step 4: Run deployment script
    # This will:
    # - Create tables (if needed, though migrations should handle this)
    # - Seed project types and subjects (only if missing)
    # - Seed services (only if missing)
    # - Seed experts (only if missing - won't duplicate!)
    # - Create admin user (only if missing)
    print("\n🌱 Running deployment script...")
    print("   Note: This will skip existing data (experts, services, etc.)")
    try:
        # Import and run the deployment
        from deploy_with_data import main as deploy_main
        deploy_main()
    except Exception as e:
        print(f"❌ Deployment script failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    
    print("\n" + "="*60)
    print("✅ Deployment complete!")
    print("="*60)

if __name__ == '__main__':
    main()

