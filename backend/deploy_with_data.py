from gevent import monkey
monkey.patch_all()

import os
from app import app, db, socketio
from models import ProjectType, Subject, Service, User, Expert
from generate_services_data import generate_services_data
from generate_experts import generate_experts

def create_database():
    """Create all database tables"""
    print("🗄️ Creating database tables...")
    with app.app_context():
        db.create_all()
        print("✅ Database tables created!")

def seed_project_types_and_subjects():
    """Seed database with project types and subjects if they don't exist."""
    print("🌱 Seeding project types and subjects...")
    with app.app_context():
        project_types = [
            "Annotated Bibliography", "Application Essay", "Article", "Business Plan", "Case Study", "Code",
            "Content Writing", "Coursework", "Creative Writing", "Data Analysis", "Dissertation", "Editing",
            "Essay", "Excel Assignment", "Lab Report", "Literature Review", "Math Solving", "Outline",
            "Personal Statement", "Presentation", "Proposal", "Research Paper", "Technical Report", "Thesis"
        ]

        subjects = [
            "Accounting", "Algebra", "Anatomy", "Anthropology", "Architecture", "Art", "Biochemistry", "Biology",
            "Business", "Chemistry", "Communications", "Computer Science", "Creative Writing", "Criminal Justice",
            "Cultural Studies", "Data Analysis", "Digital Media", "Economics", "Education", "Engineering", "English",
            "Entrepreneurship", "Environmental Science", "Film Studies", "Finance", "Geography", "Healthcare Administration",
            "History", "Information Technology", "International Business", "International Relations", "Journalism", "Law",
            "Literature", "Management", "Marketing", "Mathematics", "Medicine", "Nursing", "Operations Management",
            "Operations Research", "Philosophy", "Physics", "Political Science", "Psychology", "Public Administration",
            "Public Relations", "Research Methods", "Social Work", "Sociology", "Statistics", "Technical Writing",
            "Theater Arts", "Theology", "Web Development"
        ]

        for name in project_types:
            if not ProjectType.query.filter_by(name=name).first():
                db.session.add(ProjectType(name=name))
        
        for name in subjects:
            if not Subject.query.filter_by(name=name).first():
                db.session.add(Subject(name=name))
        
        db.session.commit()
        print("✅ Project types and subjects seeding complete!")

def seed_services():
    """Generate and seed services data."""
    print("⚙️ Generating and seeding services...")
    with app.app_context():
        services_data = generate_services_data()
        for service_data in services_data:
            # Check if service already exists to prevent duplicates
            existing_service = Service.query.filter_by(
                title=service_data['title'],
                project_type_id=service_data['project_type_id'],
                subject_id=service_data['subject_id']
            ).first()
            if not existing_service:
                new_service = Service(
                    title=service_data['title'],
                    description=service_data['description'],
                    base_price=service_data['base_price'],
                    price_per_page=service_data['price_per_page'],
                    project_type_id=service_data['project_type_id'],
                    subject_id=service_data['subject_id'],
                    unit=service_data['unit']
                )
                db.session.add(new_service)
        db.session.commit()
        print(f"✅ {len(services_data)} services seeded!")

def seed_experts():
    """Generate and seed expert data."""
    print("🧑‍🏫 Generating and seeding experts...")
    with app.app_context():
        generate_experts()  # This function handles its own session adds/commits
        print("✅ Experts seeded!")

def create_admin_user():
    """Create a default admin user if one doesn't exist."""
    print("👤 Creating admin user...")
    with app.app_context():
        admin_email = os.environ.get("ADMIN_EMAIL", "admin@studypage.com")
        admin_username = os.environ.get("ADMIN_USERNAME", "admin")
        admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")

        if not User.query.filter_by(email=admin_email).first():
            admin_user = User(
                username=admin_username,
                email=admin_email,
                is_admin=True
            )
            admin_user.set_password(admin_password)
            db.session.add(admin_user)
            db.session.commit()
            print(f"✅ Admin user '{admin_username}' created with email '{admin_email}'")
        else:
            print(f"ℹ️ Admin user '{admin_username}' already exists.")

def main():
    """Main deployment function"""
    print("🚀 Starting full deployment with data seeding...")
    
    # Set the database URL from environment variable
    database_url = os.environ.get('DATABASE_URL') or os.environ.get('database_url')
    if database_url:
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        print(f"🔗 Using database: {database_url[:50]}...")
    else:
        print("⚠️ No DATABASE_URL found, using default SQLite")
    
    with app.app_context():
        create_database()
        seed_project_types_and_subjects()
        seed_services()
        seed_experts()
        create_admin_user()
        print("🚀 Full deployment script finished!")
    
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 8000))

    # Run the app with socketio
    socketio.run(
        app,
        host='0.0.0.0',
        port=port,
        debug=False,
        use_reloader=False
    )

if __name__ == '__main__':
    main()
