import random
from app import db, app
from models import Expert, ProjectType, Subject

FIRST_NAMES = ["James", "Sarah", "Michael", "Emily", "David", "Sophia", "John", "Emma", "Daniel", "Olivia"]
LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Davis", "Miller", "Wilson", "Anderson"]

def generate_experts():
    print("🌱 Generating 72 experts...")

    # Fetch all project types & subjects
    project_types = ProjectType.query.all()
    subjects = Subject.query.all()
    subject_map = {s.id: s for s in subjects}

    experts = []
    profile_pics = [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/women/2.jpg",
        "https://randomuser.me/api/portraits/men/5.jpg",
        "https://randomuser.me/api/portraits/women/8.jpg",
    ]

    for project_type in project_types:
        assigned_subjects = random.sample(subjects, k=min(4, len(subjects)))  # Pick 4 random subjects

        for i in range(3):  # 3 experts per project type
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            full_name = f"{first_name} {last_name}"

            expert = Expert(
                name=full_name,
                title=f"{project_type.name} Specialist",
                expertise=f"Experienced in {project_type.name}, {', '.join([s.name for s in assigned_subjects])}",
                description=f"{full_name} is an expert in {project_type.name} with a strong background in {', '.join([s.name for s in assigned_subjects])}.",
                biography="With over 10 years of experience, I provide top-notch academic assistance.",
                education="PhD in Relevant Field",
                languages="English, French",
                profile_picture=random.choice(profile_pics),
                project_type=project_type,
            )
            expert.subjects = assigned_subjects
            experts.append(expert)

    # Bulk insert all experts
    db.session.bulk_save_objects(experts)
    db.session.commit()
    print(f"✅ Successfully added {len(experts)} experts!")

if __name__ == "__main__":
    with app.app_context():
        generate_experts()
