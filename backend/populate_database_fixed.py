#!/usr/bin/env python3
"""
Database Population Script for StudyPage (Fixed Version)
This script populates the database with services and experts data
"""

import os
import sys
from app import app, db
from models import ProjectType, Subject, Service, User, Expert
from generate_services_data import generate_services_data
from generate_experts import generate_experts
from werkzeug.security import generate_password_hash

def create_admin_user():
    """Create admin user if it doesn't exist"""
    print("👤 Creating admin user...")
    
    admin_email = os.environ.get('ADMIN_EMAIL', 'admin@studypage.com')
    admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
    admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
    
    existing_admin = User.query.filter_by(email=admin_email).first()
    
    if not existing_admin:
        # Use pbkdf2:sha256 method which produces shorter hashes
        admin_user = User(
            username=admin_username,
            email=admin_email,
            password=generate_password_hash(admin_password, method='pbkdf2:sha256'),
            is_admin=True
        )
        db.session.add(admin_user)
        db.session.commit()
        print(f"✅ Admin user created: {admin_email}")
    else:
        print(f"⚠️ Admin user already exists: {admin_email}")

def add_services():
    """Add services to the database"""
    print("🔧 Adding services to database...")
    
    services_data = generate_services_data()
    added_count = 0
    
    for service_data in services_data:
        # Check if service already exists
        existing_service = Service.query.filter_by(
            title=service_data['title'],
            project_type_id=service_data['project_type_id'],
            subject_id=service_data['subject_id']
        ).first()
        
        if not existing_service:
            service = Service(**service_data)
            db.session.add(service)
            added_count += 1
            print(f"✅ Added service: {service_data['title']}")
        else:
            print(f"⚠️ Service already exists: {service_data['title']}")
    
    db.session.commit()
    print(f"✅ {added_count} services added successfully!")

def add_experts():
    """Add experts to the database"""
    print("👥 Adding experts to database...")
    
    try:
        # Check if we have services first
        services = Service.query.all()
        if not services:
            print("❌ No services found! Please add services first.")
            return False
        
        print(f"Found {len(services)} services")
        
        # Generate experts data
        experts_data = generate_experts()
        
        if not experts_data:
            print("❌ Failed to generate experts data")
            return False
        
        added_count = 0
        for expert_data in experts_data:
            # Check if expert already exists
            existing_expert = Expert.query.filter_by(
                name=expert_data['name']
            ).first()
            
            if not existing_expert:
                # Create user first with shorter password hash
                user = User(
                    username=expert_data['name'].lower().replace(' ', '_'),
                    email=expert_data['email'],
                    password=generate_password_hash('password123', method='pbkdf2:sha256'),
                    is_admin=False
                )
                db.session.add(user)
                db.session.flush()  # Get the user ID
                
                # Create expert
                expert = Expert(
                    id=user.id,  # Use user ID as expert ID
                    name=expert_data['name'],
                    title=expert_data['title'],
                    expertise=expert_data['expertise'],
                    description=expert_data['description'],
                    biography=expert_data['biography'],
                    education=expert_data['education'],
                    languages=expert_data['languages'],
                    profile_picture=expert_data['profile_picture'],
                    rating_avg=expert_data['rating_avg'],
                    total_reviews=expert_data['total_reviews'],
                    success_rate=expert_data['success_rate'],
                    is_ai_free=expert_data['is_ai_free']
                )
                db.session.add(expert)
                added_count += 1
                print(f"✅ Added expert: {expert_data['name']}")
            else:
                print(f"⚠️ Expert already exists: {expert_data['name']}")
        
        db.session.commit()
        print(f"✅ {added_count} experts added successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error adding experts: {e}")
        db.session.rollback()
        return False

def main():
    """Main function to populate the database"""
    print("🚀 Starting database population...")
    
    with app.app_context():
        try:
            # Create admin user
            create_admin_user()
            
            # Add services
            add_services()
            
            # Add experts
            add_experts()
            
            print("🎉 Database population completed successfully!")
            
        except Exception as e:
            print(f"❌ Error during database population: {e}")
            import traceback
            traceback.print_exc()
            sys.exit(1)

if __name__ == '__main__':
    main()
