from app import db, app
from models import User, Expert, Service, ProjectRequest, ProjectType, Subject
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
        username='bett',
        email='admin@example.com',
        phone_number='987-654-3210',
        is_admin=True
    )
    admin1.set_password('admin_password')

    # Create project types
    project_types = [
        ProjectType(name='Annotated Bibliography'),
        ProjectType(name='Application Essay'),
        ProjectType(name='Article'),
        ProjectType(name='Business Plan'),
        ProjectType(name='Capstone project'),
        ProjectType(name='Case Study'),
        ProjectType(name='Code'),
        ProjectType(name='Content Writing'),
        ProjectType(name='Coursework'),
        ProjectType(name='Creative Writing'),
        ProjectType(name='Dissertation'),
        ProjectType(name='Editing'),
        ProjectType(name='Essay'),
        ProjectType(name='Excel assignment'),
        ProjectType(name='Math solving'),
        ProjectType(name='Other types'),
        ProjectType(name='Outline'),
        ProjectType(name='Personal Statement'),
        ProjectType(name='Presentation'),
        ProjectType(name='Proposal'),
    ]

    # Define subjects
    subjects = [
    "Accounting",
    "Algebra",
    "Anatomy",
    "Anthropology",
    "Architecture",
    "Art",
    "Biochemistry",
    "Biology",
    "Business",
    "Chemistry",
    "Communications",
    "Creative Writing",
    "Criminal Justice",
    "Cultural Studies",
    "Economics",
    "Education",
    "Engineering",
    "English",
    "Environmental Science",
    "Finance",
    "Geography",
    "History",
    "Information Technology",
    "International Relations",
    "Law",
    "Literature",
    "Mathematics",
    "Nursing",
    "Philosophy",
    "Physics",
    "Political Science",
    "Psychology",
    "Public Administration",
    "Sociology",
    "Statistics",
    "Theology",
    "Web Development"
]
    # Seed subjects into the database
    for subject_name in subjects:
        subject = Subject(name=subject_name)
        db.session.add(subject)

    # Create some experts
    expert1 = Expert(
        title='Academic Writer',
        name='Jane Smith',
        expertise='Essay Writing, Research Papers, Admissions Essays',
        description='Experienced academic writer specializing in essays and research papers.',
        biography='Jane has been helping students with academic writing for over 8 years.',
        education='PhD in Literature',
        languages='English, French',
        project_type=project_types[0],  # Linking expert to the first project type
        profile_picture='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJVe6__2JCii1tDMVzlrt0vYYT9QIxVBsjLJE8aFLTR3ikm5HvDLN8m_VXhmSfwU6OzoU&usqp=CAU'
    )

    expert2 = Expert(
        name='Mike Johnson',
        title='Technical Writer',
        expertise='Reports, Presentations, Case Studies',
        description='Technical writer focused on case studies, lab reports, and presentations.',
        biography='Mike has a background in engineering and technical documentation.',
        education='MS in Engineering',
        languages='English, Spanish',
        project_type=project_types[1],  # Linking expert to the second project type
        profile_picture='https://media.istockphoto.com/id/1337575989/photo/close-up-of-young-red-bearded-man-posing-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=CMWClxp0azh3lzE0tR3GjZzwjXxedmzNjmvvtlCbx9U='
    )

    expert4 = Expert(
        name='Sam Johnson',
        title='Technical Writer',
        expertise='Reports, Presentations, Case Studies, Research Papers',
        description='Technical writer focused on case studies, lab reports, and presentations.',
        biography='Sam has a background in engineering and technical documentation.',
        education='Bsc in Computer science',
        languages='English, Kis',
        project_type=project_types[1],  # Linking expert to the second project type
        profile_picture='data:image/jpeg;base64,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'
    )
    

    services = [
    Service(
        title='Essays',
        description='cool proj',
        base_price=5.00,
        price_per_page=10.00,
        unit='per page',
        project_type_id=1,  # Ensure you reference the ID, not the object itself
        subject_id=1
    ),
    Service(
        title='Admissions Essay',
        description='cool proj',
        base_price=15.00,
        price_per_page=20.00,
        unit='per page',
        project_type_id=2, 
        subject_id=2
    ),
        Service(
        title='PowerPoint Presentation',
        description='cool proj',
        base_price=15.00,
        price_per_page=20.00,
        unit='per page',
        project_type_id=3, 
        subject_id=2
    ),
        Service(
        title='Research Paper',
        description='cool proj',
        base_price=15.00,
        price_per_page=20.00,
        unit='per page',
        project_type_id=4, 
        subject_id=2
    ),
        Service(
        title='Assignments',
        description='cool proj',
        base_price=15.00,
        price_per_page=20.00,
        unit='per page',
        project_type_id=5, 
        subject_id=2
    ),
        Service(
        title='Homework',
        description='cool proj',
        base_price=15.00,
        price_per_page=20.00,
        unit='per page',
        project_type_id=6, 
        subject_id=2
    ),
        Service(
        title='Speech',
        description='cool proj',
        base_price=15.00,
        price_per_page=20.00,
        unit='per page',
        project_type_id=7, 
        subject_id=2
    ),
        Service(
        title='Book Reviews',
        description='cool proj',
        base_price=15.00,
        price_per_page=20.00,
        unit='per page',
        project_type_id=8, 
        subject_id=2
    ),
        Service(
        title='Coursework',
        description='cool proj',
        base_price=15.00,
        price_per_page=20.00,
        unit='per page',
        project_type_id=9, 
        subject_id=2
    ),
        Service(
        title='Personal Statement',
        description='cool proj',
        base_price=15.00,
        price_per_page=20.00,
        unit='per page',
        project_type_id=10, 
        subject_id=2
    ),
        Service(
        title='PhD Dissertation',
        description='cool proj',
        base_price=15.00,
        price_per_page=20.00,
        unit='per page',
        project_type_id=11, 
        subject_id=2
    ),
        Service(
        title='Thesis',
        description='cool proj',
        base_price=15.00,
        price_per_page=20.00,
        unit='per page',
        project_type_id=12, 
        subject_id=2
    ),
        Service(
        title='Case Study',
        description='cool proj',
        base_price=15.00,
        price_per_page=20.00,
        unit='per page',
        project_type_id=13, 
        subject_id=2
    ),
        Service(
        title='Term Paper',
        description='cool proj',
        base_price=15.00,
        price_per_page=20.00,
        unit='per page',
        project_type_id=14, 
        subject_id=14
    ),
        Service(
        title='Lab Report',
        description='cool proj',
        base_price=15.00,
        price_per_page=15.00,
        unit='per page',
        project_type_id=15, 
        subject_id=2
    ),
        Service(
        title='Editing',
        description='cool proj',
        base_price=15.00,
        price_per_page=5.00,
        unit='per page',
        project_type_id=16, 
        subject_id=2
    ),
        Service(
        title='Proofreading',
        description='cool proj',
        base_price=15.00,
        price_per_page=5.00,
        unit='per page',
        project_type_id=17, 
        subject_id=6
    ),
        Service(
        title='Rewrite',
        description='cool proj',
        base_price=2.00,
        price_per_page=7.00,
        unit='per page',
        project_type_id=18, 
        subject_id=1
    )

]


    # Create services with pricing per page
    # services = [
    #     Service(title='Essays',price=10.00, unit='per page', project_type=project_types[0], subject_id=1),
    #     Service(title='Admissions Essay', price=15.00, unit='per page', project_type=project_types[0], subject_id=2),
    #     Service(title='PowerPoint Presentation', price=8.00, unit='per slide', project_type=project_types[1], subject_id=3),
    #     Service(title='Research Paper', price=20.00, unit='per page', project_type=project_types[0], subject_id=1),
    #     Service(title='Assignments', price=12.00, unit='per page', project_type=project_types[0], subject_id=4),
    #     Service(title='Homework', price=12.00, unit='per page', project_type=project_types[0], subject_id=6),
    #     Service(title='Speech', price=10.00, unit='per page', project_type=project_types[0], subject_id=2),
    #     Service(title='Book Reviews', price=10.00, unit='per page', project_type=project_types[0], subject_id=8),
    #     Service(title='Coursework', price=15.00, unit='per page', project_type=project_types[0], subject_id=11),
    #     Service(title='Personal Statement', price=18.00, unit='per page', project_type=project_types[0], subject_id=3),
    #     Service(title='PhD Dissertation', price=30.00, unit='per page', project_type=project_types[0], subject_id=1),
    #     Service(title='Thesis', price=25.00, unit='per page', project_type=project_types[0], subject_id=4),
    #     Service(title='Case Study', price=22.00, unit='per page', project_type=project_types[1], subject_id=6),
    #     Service(title='Term Paper', price=15.00, unit='per page', project_type=project_types[0], subject_id=12),
    #     Service(title='Lab Report', price=20.00, unit='per page', project_type=project_types[1], subject_id=8),
    #     Service(title='Editing', price=5.00, unit='per page', project_type=project_types[0], subject_id=2),
    #     Service(title='Proofreading', price=4.00, unit='per page', project_type=project_types[0], subject_id=6),
    #     Service(title='Rewrite', price=7.00, unit='per page', project_type=project_types[0], subject_id=1),
    # ]

    # Create project requests
    # request1 = ProjectRequest(
    #     user_id=1,  # assuming user1 will get id=1
    #     expert_id=1,  # assuming expert1 will get id=1
    #     project_description='I need help with writing my research paper on literature review.',
    #     status='Pending'
    # )

    # request2 = ProjectRequest(
    #     user_id=1,  # assuming user1 will get id=1
    #     expert_id=2,  # assuming expert2 will get id=2
    #     project_description='Need a PowerPoint presentation on my engineering case study.',
    #     status='Pending'
    # )

    # Add users, experts, project types, services, and requests to the session
    db.session.add_all([user1, admin1, *project_types, expert1, expert2, expert4, *services])

    # Commit the session to the database
    db.session.commit()

# Drop and create all tables (be cautious, this will delete all data)
if __name__ == '__main__':
    with app.app_context():
        db.drop_all()
        db.create_all()
        seed_database()
        print("Database seeded successfully!")
