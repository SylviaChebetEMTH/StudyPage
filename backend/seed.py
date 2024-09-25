from app import db, app
from models import User, Expert, Service, ProjectRequest
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def seed_database():
    # Create some users
    user1 = User(
        username='john_doe',
        email='john@example.com',
        phone_number='123-456-7890',
        is_admin=False
    )
    user1.set_password('password123')

    admin1 = User(
        username='admin_user',
        email='admin@example.com',
        phone_number='987-654-3210',
        is_admin=True
    )
    admin1.set_password('adminpassword')

    # Create some experts
    expert1 = Expert(
        title='Software Engineer',
        name='John Doe',
        expertise='Backend Development, APIs, Microservices',
        description='An experienced engineer with expertise in building scalable backend services.',
        biography='John has over 10 years of experience working in the tech industry.',
        education='BS in Computer Science',
        languages='English, Spanish',
        project_types='Web Applications, API Development',
        subjects='Computer Science, Software Engineering',
        profile_picture='https://example.com/picture1.jpg'
    )

    expert2 = Expert(
        name='Faith Ayla',
        title='Data Scientist',
        expertise='Machine Learning, Data Analysis',
        description='An expert in machine learning and data science with a focus on predictive modeling.',
        biography='Jane has worked in data science for over 7 years, building AI models for multiple industries.',
        education='MS in Data Science',
        languages='English, French',
        project_types='Data Analysis, AI Models',
        subjects='Data Science, Machine Learning',
        profile_picture='https://example.com/picture2.jpg'
    )

    # Create some services
    service1 = Service(
        title='Website Development',
        description='Build a custom website tailored to your needs.',
        price=1500.00
    )

    service2 = Service(
        title='Data Analysis',
        description='Comprehensive data analysis services for business insights.',
        price=2000.00
    )

    # Create some project requests
    request1 = ProjectRequest(
        user_id=1,  # assuming user1 will get id=1
        expert_id=1,  # assuming expert1 will get id=1
        project_description='Need a backend API for an e-commerce platform',
        status='Pending'
    )

    request2 = ProjectRequest(
        user_id=1,  # assuming user1 will get id=1
        expert_id=2,  # assuming expert2 will get id=2
        project_description='Analyze customer purchase data to identify trends',
        status='Pending'
    )

    # Add users, experts, services, and requests to the session
    db.session.add_all([user1, admin1, expert1, expert2, service1, service2, request1, request2])

    # Commit the session to the database
    db.session.commit()

# Drop and create all tables (be cautious, this will delete all data)
if __name__ == '__main__':
    with app.app_context():
        db.drop_all()
        db.create_all()
        seed_database()
        print("Database seeded successfully!")
