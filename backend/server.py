
from gevent import monkey
monkey.patch_all()

import os
from app import app, db, socketio
from models import ProjectType, Subject 

def seed_database():
    """Seed database with project types and subjects if they don’t exist."""
    print("🌱 Seeding database...")

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

    # ✅ Add Project Types if they don’t exist
    for name in project_types:
        if not ProjectType.query.filter_by(name=name).first():
            db.session.add(ProjectType(name=name))

    # ✅ Add Subjects if they don’t exist
    for name in subjects:
        if not Subject.query.filter_by(name=name).first():
            db.session.add(Subject(name=name))

    db.session.commit()
    print("✅ Database seeding complete!")

if __name__ == '__main__':
    should_seed = os.environ.get("SEED_DB", "false").lower() == "true"
    if should_seed:
        with app.app_context():
            db.create_all()  
            seed_database()  
    
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


# from gevent import monkey
# monkey.patch_all()

# import os
# from app import app, socketio

# if __name__ == '__main__':
#     # Get port from environment variable or use default
#     port = int(os.environ.get('PORT', 8000))
    
#     # Run the app with socketio
#     socketio.run(
#         app,
#         host='0.0.0.0',
#         port=port,
#         debug=True,
#         use_reloader=True
#     )