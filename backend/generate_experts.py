
# from random import choice, sample
# from flask import current_app
# from app import db, app
# from models import Expert, ProjectType, Subject, Service
# import logging

# # Set up logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# def generate_experts():
#     logger.info("🌱 Starting Expert Generation...")
    
#     try:
#         # Check existing experts
#         existing_experts = Expert.query.count()
#         if existing_experts > 0:
#             logger.warning(f"⚠️ {existing_experts} experts already exist. Skipping generation.")
#             return False

#         # Fetch project types and subjects
#         project_types = ProjectType.query.all()
#         subjects = Subject.query.all()

#         if not project_types:
#             logger.error("❌ No project types found in database!")
#             return False
#         if not subjects:
#             logger.error("❌ No subjects found in database!")
#             return False

#         logger.info(f"Found {len(project_types)} project types and {len(subjects)} subjects")

#         profile_pics = [
#             "https://randomuser.me/api/portraits/men/1.jpg",
#             "https://randomuser.me/api/portraits/women/2.jpg",
#             "https://randomuser.me/api/portraits/men/11.jpg",
#             "https://randomuser.me/api/portraits/women/8.jpg",
#         ]

#         first_names = ['James', 'Sarah', 'Michael', 'Emily']
#         last_names = ['Smith', 'Johnson', 'Brown', 'Garcia']

#         experts_created = 0

#         # Create experts for each project type
#         for project_type in project_types:
#             # Get subjects associated with this project type through services
#             project_subjects = Subject.query.join(Service).filter(
#                 Service.project_type_id == project_type.id
#             ).all()

#             if not project_subjects:
#                 logger.warning(f"No subjects found for project type: {project_type.name}")
#                 continue

#             # Create 3 experts for each project type
#             for i in range(3):
#                 try:
#                     full_name = f"{choice(first_names)} {choice(last_names)}"
#                     # Select up to 3 subjects, but no more than available
#                     assigned_subjects = sample(project_subjects, k=min(3, len(project_subjects)))

#                     expert = Expert(
#                         name=full_name,
#                         title=f"{project_type.name} Specialist",
#                         expertise=f"Experienced in {', '.join([s.name for s in assigned_subjects])}",
#                         description=f"{full_name} specializes in {project_type.name} "
#                                   f"for {', '.join([s.name for s in assigned_subjects])}.",
#                         biography="With over 10 years of experience, I provide top-notch academic assistance.",
#                         education="PhD in Relevant Field",
#                         languages="English, French",
#                         profile_picture=choice(profile_pics),
#                     )

#                     expert.project_types.append(project_type)
#                     expert.subjects.extend(assigned_subjects)

#                     db.session.add(expert)
#                     # Commit after each expert to avoid losing all data if one fails
#                     db.session.commit()
#                     experts_created += 1
#                     logger.info(f"Created expert: {full_name} for {project_type.name}")

#                 except Exception as e:
#                     logger.error(f"Error creating expert for {project_type.name}: {str(e)}")
#                     db.session.rollback()
#                     continue

#         logger.info(f"✅ Successfully created {experts_created} experts!")
#         return True

#     except Exception as e:
#         logger.error(f"❌ Error during expert generation: {str(e)}")
#         db.session.rollback()
#         return False

# if __name__ == "__main__":
#     with app.app_context():
#         success = generate_experts()
#         if not success:
#             logger.error("Expert generation failed!")


from random import choice, sample
from flask import current_app
from app import db, app
from models import Expert, ProjectType, Subject, Service, expert_services
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_experts():
    logger.info("🌱 Starting Expert Generation...")

    try:
        # Get all services
        services = Service.query.all()

        if not services:
            logger.error("❌ No services found in the database!")
            return False

        logger.info(f"Found {len(services)} services")

        profile_pics = [
            "https://randomuser.me/api/portraits/men/1.jpg",
            "https://randomuser.me/api/portraits/women/2.jpg",
            "https://randomuser.me/api/portraits/men/11.jpg",
            "https://randomuser.me/api/portraits/women/8.jpg",
        ]

        first_names = ['James', 'Sarah', 'Michael', 'Emily']
        last_names = ['Smith', 'Johnson', 'Brown', 'Garcia']

        experts_created = 0

        for service in services:
            # Count existing experts for this service
            existing_experts = (
                Expert.query
                .join(expert_services)
                .filter(expert_services.c.service_id == service.id)
                .count()
            )

            if existing_experts >= 3:
                logger.info(f"✅ Service '{service.title}' already has {existing_experts} experts.")
                continue  # Skip this service

            num_to_create = 3 - existing_experts
            logger.info(f"🔹 Creating {num_to_create} experts for '{service.title}'")

            for i in range(num_to_create):
                try:
                    full_name = f"{choice(first_names)} {choice(last_names)}"
                    expert = Expert(
                        name=full_name,
                        title=f"{service.title} Specialist",
                        expertise=f"Expert in {service.title}",
                        description=f"{full_name} specializes in {service.title}.",
                        biography="Highly skilled professional with years of experience.",
                        education="PhD in relevant field",
                        languages="English, French",
                        profile_picture=choice(profile_pics),
                    )

                    # Associate expert with this service
                    expert.services.append(service)

                    db.session.add(expert)
                    db.session.commit()

                    experts_created += 1
                    logger.info(f"✅ Created expert: {full_name} for '{service.title}'")

                except Exception as e:
                    logger.error(f"Error creating expert for {service.title}: {str(e)}")
                    db.session.rollback()
                    continue

        logger.info(f"✅ Successfully created {experts_created} new experts!")
        return True

    except Exception as e:
        logger.error(f"❌ Error during expert generation: {str(e)}")
        db.session.rollback()
        return False

if __name__ == "__main__":
    with app.app_context():
        success = generate_experts()
        if not success:
            logger.error("Expert generation failed!")