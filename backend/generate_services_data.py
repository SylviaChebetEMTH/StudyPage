"""
Helper function to generate services data for database seeding
"""

def generate_services_data():
    """Generate services data based on project types and subjects"""
    
    # Project Types & Their Related Subjects
    project_types = {
        "Dissertation": ["Engineering", "Computer Science", "Mathematics", "Nursing"],
        "Thesis": ["Nursing", "Biology", "Physics"],
        "Research Paper": ["Economics", "Business", "Law", "Psychology"],
        "Business Plan": ["Finance", "Marketing", "Operations Management"],
        "Case Study": ["Criminal Justice", "Business", "Law"],
        "Technical Report": ["Engineering", "Computer Science", "Physics"],
        "Data Analysis": ["Statistics", "Operations Research", "Data Analysis"],
        "Lab Report": ["Biology", "Chemistry", "Environmental Science"],
        "Code": ["Computer Science", "Information Technology", "Web Development"],
        "Math Solving": ["Mathematics", "Statistics", "Algebra"],
        "Literature Review": ["English", "History", "Literature"],
        "Essay": ["English", "History", "Sociology"],
        "Article": ["Journalism", "Communications", "Public Relations"],
        "Creative Writing": ["English", "Creative Writing", "Literature"],
        "Content Writing": ["Marketing", "Communications", "Digital Media"],
        "Editing": ["English", "Journalism", "Creative Writing"],
        "Outline": ["English", "History", "Research Methods"],
        "Presentation": ["Business", "Education", "Public Relations"],
        "Proposal": ["Business", "Education", "Research Methods"],
        "Personal Statement": ["Education", "Law", "Medical School"],
        "Application Essay": ["Education", "Law", "Business"],
        "Annotated Bibliography": ["English", "History", "Research Methods"],
        "Coursework": ["Mathematics", "Physics", "Engineering"],
        "Excel Assignment": ["Finance", "Economics", "Statistics"]
    }

    # Pricing for Each Project Type
    project_type_pricing = {
        "Dissertation": {"base": 25.00, "per_page": 35.00}, 
        "Thesis": {"base": 20.00, "per_page": 30.00},
        "Research Paper": {"base": 15.00, "per_page": 25.00},
        "Business Plan": {"base": 18.00, "per_page": 28.00},
        "Case Study": {"base": 15.00, "per_page": 25.00},
        "Technical Report": {"base": 15.00, "per_page": 25.00},
        "Data Analysis": {"base": 20.00, "per_page": 30.00},
        "Lab Report": {"base": 15.00, "per_page": 25.00},
        "Code": {"base": 25.00, "per_page": 35.00},
        "Math Solving": {"base": 20.00, "per_page": 30.00},
        "Literature Review": {"base": 12.00, "per_page": 22.00},
        "Essay": {"base": 8.00, "per_page": 15.00},
        "Article": {"base": 8.00, "per_page": 15.00},
        "Creative Writing": {"base": 10.00, "per_page": 18.00},
        "Content Writing": {"base": 8.00, "per_page": 15.00},
        "Editing": {"base": 5.00, "per_page": 12.00}, 
        "Outline": {"base": 5.00, "per_page": 12.00},
        "Presentation": {"base": 12.00, "per_page": 20.00},
        "Proposal": {"base": 12.00, "per_page": 22.00},
        "Personal Statement": {"base": 15.00, "per_page": 25.00},
        "Application Essay": {"base": 15.00, "per_page": 25.00},
        "Annotated Bibliography": {"base": 10.00, "per_page": 18.00},
        "Coursework": {"base": 12.00, "per_page": 20.00},
        "Excel Assignment": {"base": 15.00, "per_page": 25.00}
    }

    # Subject Multipliers
    subject_multipliers = {
        "Engineering": 1.4, "Computer Science": 1.4, "Information Technology": 1.4, "Web Development": 1.4,
        "Physics": 1.4, "Mathematics": 1.4, "Algebra": 1.4, "Statistics": 1.4, "Operations Research": 1.4,
        "Data Analysis": 1.3, "Technical Writing": 1.3,

        "Medicine": 1.3, "Nursing": 1.3, "Healthcare Administration": 1.3, "Chemistry": 1.3, "Biochemistry": 1.3,
        "Biology": 1.2, "Anatomy": 1.2, "Environmental Science": 1.2, "Architecture": 1.2,

        "Finance": 1.3, "Economics": 1.2, "Law": 1.3, "Criminal Justice": 1.3, "Accounting": 1.2, "Business": 1.2,
        "International Business": 1.2, "Management": 1.2, "Marketing": 1.2, "Operations Management": 1.2,

        "English": 1.0, "History": 1.0, "Literature": 1.0, "Psychology": 1.0, "Sociology": 1.0, "Philosophy": 1.0,
        "Education": 1.0, "Communications": 1.0, "Public Relations": 1.0, "Political Science": 1.0,
        "Public Administration": 1.0, "International Relations": 1.0, "Journalism": 1.0, "Anthropology": 1.0,
        "Art": 1.0, "Cultural Studies": 1.0, "Digital Media": 1.0, "Film Studies": 1.0, "Geography": 1.0,
        "Research Methods": 1.0, "Social Work": 1.0, "Theater Arts": 1.0, "Theology": 1.0
    }

    DEFAULT_SUBJECT_MULTIPLIER = 1.0

    # Generate IDs
    project_id_map = {name: i+1 for i, name in enumerate(project_types.keys())}
    subject_id_map = {name: i+1 for i, name in enumerate(subject_multipliers.keys())}

    # Generate Services
    services = []
    for project_type, related_subjects in project_types.items():
        project_type_id = project_id_map[project_type]
        project_pricing = project_type_pricing.get(project_type, {"base": 10.00, "per_page": 18.00})

        for subject in related_subjects:
            if subject in subject_id_map:
                subject_id = subject_id_map[subject]
                multiplier = subject_multipliers.get(subject, DEFAULT_SUBJECT_MULTIPLIER)
                
                final_base_price = round(project_pricing["base"] * multiplier, 2)
                final_price_per_page = round(project_pricing["per_page"] * multiplier, 2)
                
                services.append({
                    "title": f"{project_type} - {subject}",
                    "description": f"Professional {project_type} assistance in {subject}",
                    "base_price": final_base_price,
                    "price_per_page": final_price_per_page,
                    "project_type_id": project_type_id,
                    "subject_id": subject_id,
                    "unit": project_type
                })

    return services
