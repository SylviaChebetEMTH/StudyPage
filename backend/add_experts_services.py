#!/usr/bin/env python3
"""
Script to add experts and services to the database
Run this after the main server is running
"""

from app import app, db
from models import Service, Expert, User
from generate_services_data import generate_services_data
from generate_experts import generate_experts

def add_services():
    """Add services to the database"""
    print("🔧 Adding services to database...")
    
    with app.app_context():
        services_data = generate_services_data()
        
        for service_data in services_data:
            # Check if service already exists
            existing_service = Service.query.filter_by(
                name=service_data['name'],
                project_type=service_data['project_type'],
                subject=service_data['subject']
            ).first()
            
            if not existing_service:
                service = Service(**service_data)
                db.session.add(service)
                print(f"✅ Added service: {service_data['name']}")
            else:
                print(f"⚠️ Service already exists: {service_data['name']}")
        
        db.session.commit()
        print("✅ Services added successfully!")

def add_experts():
    """Add experts to the database"""
    print("👥 Adding experts to database...")
    
    with app.app_context():
        experts_data = generate_experts()
        
        for expert_data in experts_data:
            # Check if expert already exists
            existing_expert = Expert.query.filter_by(
                name=expert_data['name'],
                email=expert_data['email']
            ).first()
            
            if not existing_expert:
                expert = Expert(**expert_data)
                db.session.add(expert)
                print(f"✅ Added expert: {expert_data['name']}")
            else:
                print(f"⚠️ Expert already exists: {expert_data['name']}")
        
        db.session.commit()
        print("✅ Experts added successfully!")

def create_admin_user():
    """Create admin user if it doesn't exist"""
    print("👤 Creating admin user...")
    
    with app.app_context():
        admin_email = os.environ.get('ADMIN_EMAIL', 'admin@studypage.com')
        admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
        admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
        
        existing_admin = User.query.filter_by(email=admin_email).first()
        
        if not existing_admin:
            from werkzeug.security import generate_password_hash
            
            admin_user = User(
                username=admin_username,
                email=admin_email,
                password=generate_password_hash(admin_password),
                is_admin=True,
                is_verified=True
            )
            db.session.add(admin_user)
            db.session.commit()
            print(f"✅ Admin user created: {admin_email}")
        else:
            print(f"⚠️ Admin user already exists: {admin_email}")

if __name__ == '__main__':
    import os
    
    print("🚀 Starting database population...")
    
    try:
        add_services()
        add_experts()
        create_admin_user()
        print("🎉 Database population completed successfully!")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
