#!/usr/bin/env python3
"""
Script to clean up duplicate experts from the database.

This script removes duplicate experts, keeping only 3 experts per service.
It's safe to run and will show what it's doing before making changes.
"""

from gevent import monkey
monkey.patch_all()

import os
from app import app, db
from models import Expert, Service, expert_services, User
from sqlalchemy import func

def cleanup_duplicate_experts():
    """Remove duplicate experts, keeping only 3 per service."""
    print("🔍 Analyzing expert-service relationships...")
    
    with app.app_context():
        # Get all services
        services = Service.query.all()
        total_experts_before = Expert.query.count()
        experts_to_delete = []
        users_to_delete = []
        
        for service in services:
            # Get all experts for this service
            experts_for_service = Expert.query.join(
                expert_services
            ).filter(
                expert_services.c.service_id == service.id
            ).all()
            
            if len(experts_for_service) > 3:
                print(f"\n⚠️  Service '{service.title}' has {len(experts_for_service)} experts (should be 3)")
                # Keep the first 3, mark the rest for deletion
                experts_to_keep = experts_for_service[:3]
                experts_to_remove = experts_for_service[3:]
                
                print(f"   ✅ Keeping: {[e.name for e in experts_to_keep]}")
                print(f"   ❌ Removing: {[e.name for e in experts_to_remove]}")
                
                for expert in experts_to_remove:
                    # Remove expert-service relationship
                    expert.services.remove(service)
                    # Mark expert for deletion if not assigned to any other service
                    other_services = Expert.query.join(
                        expert_services
                    ).filter(
                        expert_services.c.expert_id == expert.id
                    ).count()
                    
                    if other_services == 0:
                        experts_to_delete.append(expert)
                        if expert.id:
                            users_to_delete.append(expert.id)
        
        print(f"\n📊 Summary:")
        print(f"   Total experts before: {total_experts_before}")
        print(f"   Experts to delete: {len(experts_to_delete)}")
        print(f"   Users to delete: {len(users_to_delete)}")
        
        if experts_to_delete:
            confirm = input("\n❓ Proceed with deletion? (yes/no): ").strip().lower()
            if confirm == 'yes':
                # Delete experts (this will also cascade to expert_services table)
                for expert in experts_to_delete:
                    print(f"   🗑️  Deleting expert: {expert.name} (ID: {expert.id})")
                    db.session.delete(expert)
                
                # Delete associated users
                for user_id in users_to_delete:
                    user = User.query.get(user_id)
                    if user and not user.is_admin:
                        print(f"   🗑️  Deleting user: {user.username} (ID: {user_id})")
                        db.session.delete(user)
                
                db.session.commit()
                
                total_experts_after = Expert.query.count()
                print(f"\n✅ Cleanup complete!")
                print(f"   Total experts after: {total_experts_after}")
                print(f"   Removed: {total_experts_before - total_experts_after} duplicates")
            else:
                print("❌ Cleanup cancelled.")
        else:
            print("✅ No duplicate experts found. Database is clean!")

if __name__ == '__main__':
    # Set the database URL from environment variable
    database_url = os.environ.get('DATABASE_URL') or os.environ.get('database_url')
    if database_url:
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        print(f"🔗 Using database: {database_url[:50]}...")
    else:
        print("⚠️ No DATABASE_URL found, using default SQLite")
    
    cleanup_duplicate_experts()

