import random
from app import db, app
from models import Expert, ProjectType, Subject, Service

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

    # Fetch valid project type & subject pairs from services
    valid_combinations = db.session.query(Service.project_type_id, Service.subject_id).distinct().all()

    if not valid_combinations:
        print("❌ ERROR: No valid project type & subject combinations found in services!")
        return

    experts = []

    for project_type_id, subject_id in valid_combinations:
        for _ in range(3):  # Create 3 experts per valid combination
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            full_name = f"{first_name} {last_name}"

            expert = Expert(
                name=full_name,
                title=f"Expert in {project_type_id}",
                expertise=f"Highly experienced in project type {project_type_id} and subject {subject_id}.",
                description=f"{full_name} specializes in {project_type_id} with deep knowledge in {subject_id}.",
                biography="With over 10 years of experience, I provide top-notch academic assistance.",
                education="PhD in Relevant Field",
                languages="English, French",
                profile_picture=random.choice(PROFILE_PICS),
                project_type_id=project_type_id,
                subject_id=subject_id
            )

            experts.append(expert)

    # Bulk insert all experts
    db.session.bulk_save_objects(experts)
    db.session.commit()
    print(f"✅ Successfully added {len(experts)} experts!")

if __name__ == "__main__":
    with app.app_context():
        generate_experts()
