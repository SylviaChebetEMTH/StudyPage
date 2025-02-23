# import random
# from app import db, app
# from models import Expert, ProjectType, Subject

# def generate_experts():
#     print("🌱 Generating Experts...")

#     existing_experts = Expert.query.count()
#     if existing_experts > 0:
#         print(f"⚠️ {existing_experts} experts already exist. Skipping generation.")
#         return

#     project_types = ProjectType.query.all()
#     subjects = Subject.query.all()

#     if not project_types or not subjects:
#         print("❌ ERROR: No project types or subjects found. Check your database!")
#         return

#     profile_pics = [
#         "https://randomuser.me/api/portraits/men/1.jpg",
#         "https://randomuser.me/api/portraits/women/2.jpg",
#         "https://randomuser.me/api/portraits/men/11.jpg",
#         "https://randomuser.me/api/portraits/women/8.jpg",
#     ]

#     for _ in range(72):
#         full_name = f"{random.choice(['James', 'Sarah', 'Michael', 'Emily'])} {random.choice(['Smith', 'Johnson', 'Brown', 'Garcia'])}"
#         assigned_project_types = random.sample(project_types, k=3)  # Each expert gets 3 project types
#         assigned_subjects = random.sample(subjects, k=3)  # Each expert gets 3 subjects

#         expert = Expert(
#             name=full_name,
#             title=f"{random.choice(assigned_project_types).name} Specialist",
#             expertise=f"Experienced in {', '.join([s.name for s in assigned_subjects])}",
#             description=f"{full_name} specializes in {', '.join([p.name for p in assigned_project_types])}.",
#             biography="With over 10 years of experience, I provide top-notch academic assistance.",
#             education="PhD in Relevant Field",
#             languages="English, French",
#             profile_picture=random.choice(profile_pics),
#         )
        
#         # ✅ Explicitly associate many-to-many relationships
#         expert.project_types.extend(assigned_project_types)
#         expert.subjects.extend(assigned_subjects)
        
#         # ✅ Add and commit each expert individually
#         db.session.add(expert)
#         db.session.commit()  # Important! This ensures many-to-many tables are populated.

#     print("✅ Experts and their relationships have been successfully added!")

# if __name__ == "__main__":
#     with app.app_context():
#         generate_experts()



import random
from app import db, app
from models import Expert, ProjectType, Subject

def generate_experts():
    print("🌱 Generating Experts...")

    existing_experts = Expert.query.count()
    if existing_experts > 0:
        print(f"⚠️ {existing_experts} experts already exist. Skipping generation.")
        return

    project_types = ProjectType.query.all()
    subjects = Subject.query.all()

    if not project_types or not subjects:
        print("❌ ERROR: No project types or subjects found. Check your database!")
        return

    profile_pics = [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/women/2.jpg",
        "https://randomuser.me/api/portraits/men/11.jpg",
        "https://randomuser.me/api/portraits/women/8.jpg",
    ]

    # ✅ Ensure each project type gets at least 3 experts
    for project_type in project_types:
        project_subjects = [s for s in subjects if s in project_type.services]  # Subjects linked to this project type
        if not project_subjects:
            continue  # Skip project types without subjects

        for i in range(3):  # Ensure at least 3 experts per project type
            full_name = f"{random.choice(['James', 'Sarah', 'Michael', 'Emily'])} {random.choice(['Smith', 'Johnson', 'Brown', 'Garcia'])}"
            assigned_subjects = random.sample(project_subjects, k=min(3, len(project_subjects)))  # Avoid picking more subjects than available

            expert = Expert(
                name=full_name,
                title=f"{project_type.name} Specialist",
                expertise=f"Experienced in {', '.join([s.name for s in assigned_subjects])}",
                description=f"{full_name} specializes in {project_type.name} for {', '.join([s.name for s in assigned_subjects])}.",
                biography="With over 10 years of experience, I provide top-notch academic assistance.",
                education="PhD in Relevant Field",
                languages="English, French",
                profile_picture=random.choice(profile_pics),
            )

            # ✅ Assign this expert to the project type and subjects
            expert.project_types.append(project_type)
            expert.subjects.extend(assigned_subjects)

            db.session.add(expert)
            db.session.commit()  # Commit after each expert

    print("✅ Experts have been successfully assigned to every category!")

if __name__ == "__main__":
    with app.app_context():
        generate_experts()
