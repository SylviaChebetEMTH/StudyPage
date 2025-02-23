# import random
# from app import db, app
# from models import Expert, ProjectType, Subject, Service

# FIRST_NAMES = ["James", "Sarah", "Michael", "Emily", "David", "Sophia", "John", "Emma", "Daniel", "Olivia"]
# LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Davis", "Miller", "Wilson", "Anderson"]

# PROFILE_PICS = [
#     "https://randomuser.me/api/portraits/men/1.jpg",
#     "https://randomuser.me/api/portraits/women/2.jpg",
#     "https://randomuser.me/api/portraits/men/5.jpg",
#     "https://randomuser.me/api/portraits/women/8.jpg",
# ]

# def generate_experts():
#     print("🌱 Generating experts...")
    
#     # Get all valid combinations from services table
#     valid_combinations = db.session.query(
#         Service.project_type_id,
#         Service.subject_id
#     ).distinct().all()
    
#     if not valid_combinations:
#         print("❌ ERROR: No valid project type & subject combinations found in services!")
#         return
        
#     experts = []
#     existing_expert_count = Expert.query.count()
    
#     # Calculate expected total based on combinations
#     expected_total = len(valid_combinations) * 3
    
#     if existing_expert_count >= expected_total:
#         print(f"⚠️ Skipping expert generation: {existing_expert_count} experts already exist.")
#         return
        
#     for project_type_id, subject_id in valid_combinations:
#         project_type = ProjectType.query.get(project_type_id)
#         subject = Subject.query.get(subject_id)
        
#         if not project_type or not subject:
#             print(f"⚠️ Skipping invalid pair: project_type_id={project_type_id}, subject_id={subject_id}")
#             continue
            
#         # Create 3 experts per combination with unique names
#         used_names = set()
#         expert_count = 0
        
#         while expert_count < 3:
#             first_name = random.choice(FIRST_NAMES)
#             last_name = random.choice(LAST_NAMES)
#             full_name = f"{first_name} {last_name}"
            
#             if full_name in used_names:
#                 continue
                
#             used_names.add(full_name)
            
#             expert = Expert(
#                 name=full_name,
#                 title=f"Expert in {project_type.name}",
#                 expertise=f"Highly experienced in {project_type.name} and {subject.name}.",
#                 description=f"{full_name} specializes in {project_type.name} with deep knowledge in {subject.name}.",
#                 biography="With over 10 years of experience, I provide top-notch academic assistance.",
#                 education="PhD in Relevant Field",
#                 languages="English, French",
#                 profile_picture=random.choice(PROFILE_PICS),
#                 project_type_id=project_type.id,
#                 subject_id=subject.id
#             )
            
#             experts.append(expert)
#             expert_count += 1
    
#     try:
#         db.session.bulk_save_objects(experts)
#         db.session.commit()
#         print(f"✅ Successfully added {len(experts)} experts!")
#     except Exception as e:
#         db.session.rollback()
#         print(f"❌ Error saving experts: {str(e)}")
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

    experts = []
    profile_pics = [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/women/2.jpg",
        "https://randomuser.me/api/portraits/men/5.jpg",
        "https://randomuser.me/api/portraits/women/8.jpg",
    ]

    for _ in range(72):  # Generate 72 experts
        full_name = f"{random.choice(['James', 'Sarah', 'Michael', 'Emily'])} {random.choice(['Smith', 'Johnson', 'Brown', 'Garcia'])}"
        assigned_project_types = random.sample(project_types, k=3)  # Each expert gets 3 project types
        assigned_subjects = random.sample(subjects, k=3)  # Each expert gets 3 subjects

        expert = Expert(
            name=full_name,
            title=f"{random.choice(assigned_project_types).name} Specialist",
            expertise=f"Experienced in {', '.join([s.name for s in assigned_subjects])}",
            description=f"{full_name} specializes in {', '.join([p.name for p in assigned_project_types])}.",
            biography="With over 10 years of experience, I provide top-notch academic assistance.",
            education="PhD in Relevant Field",
            languages="English, French",
            profile_picture=random.choice(profile_pics),
        )
        
        expert.project_types = assigned_project_types
        expert.subjects = assigned_subjects
        experts.append(expert)

    db.session.bulk_save_objects(experts)
    db.session.commit()
    print(f"✅ Successfully added {len(experts)} experts!")

if __name__ == "__main__":
    with app.app_context():
        generate_experts()
