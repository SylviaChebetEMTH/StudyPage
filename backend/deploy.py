#!/usr/bin/env python3
"""
Deployment script for StudyPage backend
This script handles database initialization and data seeding
"""

import os
import json
from app import app, db
from models import ProjectType, Subject, Service, User, Expert
from generate_services import generate_services_data
from generate_experts import generate_experts

def create_database():
    """Create all database tables"""
    print("🗄️ Creating database tables...")
    with app.app_context():
        db.create_all()
    print("✅ Database tables created successfully!")

def seed_basic_data():
    """Seed project types and subjects"""
    print("🌱 Seeding basic data (project types and subjects)...")
    
    with app.app_context():
        # Project types
        project_types = [
            "Annotated Bibliography", "Application Essay", "Article", "Business Plan", 
            "Case Study", "Code", "Content Writing", "Coursework", "Creative Writing", 
            "Data Analysis", "Dissertation", "Editing", "Essay", "Excel Assignment", 
            "Lab Report", "Literature Review", "Math Solving", "Outline",
            "Personal Statement", "Presentation", "Proposal", "Research Paper", 
            "Technical Report", "Thesis"
        ]

        # Subjects
        subjects = [
            "Accounting", "Algebra", "Anatomy", "Anthropology", "Architecture", "Art",
            "Biochemistry", "Biology", "Business", "Chemistry", "Communications",
            "Computer Science", "Creative Writing", "Criminal Justice", "Cultural Studies",
            "Data Analysis", "Digital Media", "Economics", "Education", "Engineering",
            "English", "Entrepreneurship", "Environmental Science", "Film Studies",
            "Finance", "Geography", "Healthcare Administration", "History",
            "Information Technology", "International Business", "International Relations",
            "Journalism", "Law", "Literature", "Management", "Marketing", "Mathematics",
            "Medicine", "Nursing", "Operations Management", "Operations Research",
            "Philosophy", "Physics", "Political Science", "Psychology", "Public Administration",
            "Public Relations", "Research Methods", "Social Work", "Sociology", "Statistics",
            "Technical Writing", "Theater Arts", "Theology", "Web Development"
        ]

        # Add project types if they don't exist
        for name in project_types:
            if not ProjectType.query.filter_by(name=name).first():
                db.session.add(ProjectType(name=name))

        # Add subjects if they don't exist
        for name in subjects:
            if not Subject.query.filter_by(name=name).first():
                db.session.add(Subject(name=name))

        db.session.commit()
        print("✅ Basic data seeded successfully!")

def seed_services():
    """Generate and seed services"""
    print("🔧 Generating and seeding services...")
    
    with app.app_context():
        # Generate services data
        services_data = generate_services_data()
        
        # Clear existing services
        Service.query.delete()
        db.session.commit()
        
        # Add services to database
        for service_data in services_data:
            service = Service(
                title=service_data['title'],
                description=service_data['description'],
                base_price=service_data['base_price'],
                price_per_page=service_data['price_per_page'],
                project_type_id=service_data['project_type_id'],
                subject_id=service_data['subject_id'],
                unit=service_data['unit']
            )
            db.session.add(service)
        
        db.session.commit()
        print(f"✅ {len(services_data)} services seeded successfully!")

def seed_experts():
    """Generate and seed experts"""
    print("👥 Generating and seeding experts...")
    
    with app.app_context():
        # Clear existing experts
        Expert.query.delete()
        User.query.filter(User.expert_profile.isnot(None)).delete(synchronize_session=False)
        db.session.commit()
        
        # Generate experts
        success = generate_experts()
        if success:
            print("✅ Experts generated and seeded successfully!")
        else:
            print("❌ Failed to generate experts!")

def create_admin_user():
    """Create admin user if it doesn't exist"""
    print("👤 Creating admin user...")
    
    with app.app_context():
        admin_email = os.environ.get('ADMIN_EMAIL', 'admin@studypage.com')
        admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
        admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
        
        # Check if admin exists
        existing_admin = User.query.filter_by(email=admin_email).first()
        if not existing_admin:
            admin_user = User(
                username=admin_username,
                email=admin_email,
                is_admin=True,
                phone_number='000-000-0000'
            )
            admin_user.set_password(admin_password)
            db.session.add(admin_user)
            db.session.commit()
            print(f"✅ Admin user created: {admin_email}")
        else:
            print("ℹ️ Admin user already exists")

def main():
    """Main deployment function"""
    print("🚀 Starting StudyPage backend deployment...")
    
    try:
        # Step 1: Create database
        create_database()
        
        # Step 2: Seed basic data
        seed_basic_data()
        
        # Step 3: Seed services
        seed_services()
        
        # Step 4: Seed experts
        seed_experts()
        
        # Step 5: Create admin user
        create_admin_user()
        
        print("🎉 Deployment completed successfully!")
        
    except Exception as e:
        print(f"❌ Deployment failed: {str(e)}")
        raise

if __name__ == "__main__":
    main()
