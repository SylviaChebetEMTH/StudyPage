# import random
# from app import db, app
# from models import Expert, ProjectType, Subject

# FIRST_NAMES = ["James", "Sarah", "Michael", "Emily", "David", "Sophia", "John", "Emma", "Daniel", "Olivia"]
# LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Davis", "Miller", "Wilson", "Anderson"]

# def generate_experts():
#     print("🌱 Generating 72 experts...")

#     existing_experts = Expert.query.count()
#     if existing_experts > 0:
#         print(f"⚠️ Skipping expert generation: {existing_experts} experts already exist.")
#         return
#     # Fetch all project types & subjects
#     project_types = ProjectType.query.all()
#     subjects = Subject.query.all()

#     if not project_types or not subjects:
#         print("❌ ERROR: No project types or subjects found. Check your database!")
#         return
    
#     experts = []
#     profile_pics = [
#         "https://randomuser.me/api/portraits/men/1.jpg",
#         "https://randomuser.me/api/portraits/women/2.jpg",
#         "https://randomuser.me/api/portraits/men/5.jpg",
#         "https://randomuser.me/api/portraits/women/8.jpg",
#     ]

#     for project_type in project_types:
#         assigned_subjects = random.sample(subjects, k=min(4, len(subjects)))  # Pick 4 random subjects

#         for i in range(3):  # 3 experts per project type
#             first_name = random.choice(FIRST_NAMES)
#             last_name = random.choice(LAST_NAMES)
#             full_name = f"{first_name} {last_name}"
#         for i in range(72):
#             project_type = project_types[i % len(project_types)]  # Assign randomly
#             subject = subjects[i % len(subjects)] 
#             expert = Expert(
#                 name=full_name,
#                 title=f"{project_type.name} Specialist",
#                 expertise=f"Experienced in {project_type.name}, {', '.join([s.name for s in assigned_subjects])}",
#                 description=f"{full_name} is an expert in {project_type.name} with a strong background in {', '.join([s.name for s in assigned_subjects])}.",
#                 biography="With over 10 years of experience, I provide top-notch academic assistance.",
#                 education="PhD in Relevant Field",
#                 languages="English, French",
#                 profile_picture=random.choice(profile_pics),
#                 project_type=project_type,
#                 project_type_id=project_type.id,
#                 subject_id=subject.id
#             )

#             experts.append(expert)

#     # Bulk insert all experts
#     db.session.bulk_save_objects(experts)
#     db.session.commit()
#     print(f"✅ Successfully added {len(experts)} experts!")

# if __name__ == "__main__":
#     with app.app_context():
#         generate_experts()



import random
from app import db, app
from models import Expert, ProjectType, Subject

# Sample names for generating experts
FIRST_NAMES = ["James", "Sarah", "Michael", "Emily", "David", "Sophia", "John", "Emma", "Daniel", "Olivia"]
LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Davis", "Miller", "Wilson", "Anderson"]

# Sample profile pictures
PROFILE_PICS = [
    "https://randomuser.me/api/portraits/men/1.jpg",
    "https://randomuser.me/api/portraits/women/2.jpg",
    "https://randomuser.me/api/portraits/men/5.jpg",
    "https://randomuser.me/api/portraits/women/8.jpg",
]

def generate_experts():
    print("🌱 Generating experts...")

    # Prevent duplication: If experts exist, stop execution
    existing_experts = Expert.query.count()
    if existing_experts > 0:
        print(f"⚠️ Skipping expert generation: {existing_experts} experts already exist.")
        return

    # Fetch all project types & subjects from DB
    project_types = ProjectType.query.all()
    subjects = Subject.query.all()

    if not project_types or not subjects:
        print("❌ ERROR: No project types or subjects found. Check your database!")
        return

    experts = []

    for project_type in project_types:
        assigned_subjects = random.sample(subjects, k=min(4, len(subjects)))  # Assign up to 4 random subjects

        for _ in range(3):  # Generate 3 experts per project type
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            full_name = f"{first_name} {last_name}"

            subject = random.choice(assigned_subjects)  # Select one subject per expert

            expert = Expert(
                name=full_name,
                title=f"{project_type.name} Specialist",
                expertise=f"Expert in {project_type.name}, {subject.name}",
                description=f"{full_name} specializes in {project_type.name} with strong expertise in {subject.name}.",
                biography="With over 10 years of experience, I provide top-notch academic assistance.",
                education="PhD in Relevant Field",
                languages="English, French",
                profile_picture=random.choice(PROFILE_PICS),
                project_type_id=project_type.id,
                subject_id=subject.id  # Ensure this is a valid ID
            )

            experts.append(expert)

    # Bulk insert all experts
    db.session.bulk_save_objects(experts)
    db.session.commit()
    print(f"✅ Successfully added {len(experts)} experts!")

if __name__ == "__main__":
    with app.app_context():
        generate_experts()
