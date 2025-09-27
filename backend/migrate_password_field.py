#!/usr/bin/env python3
"""
Database Migration Script
Updates the password field length from 128 to 255 characters
"""

import os
from app import app, db

def migrate_password_field():
    """Update password field length in the database"""
    print("🔧 Migrating password field...")
    
    try:
        with app.app_context():
            # Check if we need to migrate
            result = db.engine.execute("""
                SELECT character_maximum_length 
                FROM information_schema.columns 
                WHERE table_name = 'users' 
                AND column_name = 'password'
            """).fetchone()
            
            if result and result[0] == 128:
                print("📝 Updating password field from VARCHAR(128) to VARCHAR(255)...")
                
                # Update the column
                db.engine.execute("""
                    ALTER TABLE users 
                    ALTER COLUMN password TYPE VARCHAR(255)
                """)
                
                print("✅ Password field migration completed!")
            else:
                print("ℹ️ Password field is already up to date")
                
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        # If the error is about the column not existing, that's okay
        if "column" not in str(e).lower():
            raise

if __name__ == '__main__':
    migrate_password_field()
