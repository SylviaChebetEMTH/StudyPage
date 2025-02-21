# import json
# import os

# OUTPUT_FILE = "services.json"
# print(f"📂 Saving services.json to: {OUTPUT_FILE}")

# if os.path.exists(OUTPUT_FILE):
#     print(" Deleting old services.json...")
#     os.remove(OUTPUT_FILE)

# project_types = {
#     "Annotated Bibliography": [
#         "English", "Literature", "History", "Philosophy", "Sociology", 
#         "Psychology", "Political Science", "Education", "Nursing", "Business"
#     ],
#     "Application Essay": [
#         "English", "Education", "Business", "Law", "Medicine", "Nursing",
#         "Engineering", "Information Technology", "Architecture"
#     ],
#     "Article": [
#         "Communications", "English", "Creative Writing", "Journalism",
#         "Business", "Marketing", "Political Science", "International Relations"
#     ],
#     "Business Plan": [
#         "Business", "Finance", "Economics", "Marketing", "Management",
#         "Entrepreneurship", "International Business"
#     ],
#     "Case Study": [
#         "Business", "Law", "Political Science", "Psychology", "Public Administration",
#         "Marketing", "Finance", "Healthcare Administration", "Education", "Sociology"
#     ],
#     "Code": [
#         "Computer Science", "Information Technology", "Web Development", 
#         "Engineering", "Mathematics", "Data Science", "Statistics"
#     ],
#     "Content Writing": [
#         "English", "Creative Writing", "Marketing", "Journalism",
#         "Communications", "Digital Media", "Public Relations"
#     ],
#     "Coursework": [
#         "Mathematics", "Statistics", "Engineering", "Biology", "Physics",
#         "Chemistry", "Computer Science", "Economics", "Business", "Psychology",
#         "Sociology", "Literature", "History", "Political Science"
#     ],
#     "Creative Writing": [
#         "Creative Writing", "English", "Literature", "Communications",
#         "Journalism", "Theater Arts", "Film Studies"
#     ],
#     "Data Analysis": [
#         "Statistics", "Mathematics", "Economics", "Business", "Psychology",
#         "Sociology", "Marketing", "Research Methods"
#     ],
#     "Dissertation": ["All"],
#     "Editing": [
#         "English", "Communications", "Creative Writing", "Journalism",
#         "Academic Writing", "Technical Writing"
#     ],
#     "Essay": ["All"],
#     "Excel Assignment": [
#         "Accounting", "Finance", "Economics", "Statistics", "Business",
#         "Data Analysis", "Operations Management"
#     ],
#     "Lab Report": [
#         "Biology", "Chemistry", "Physics", "Engineering", "Environmental Science",
#         "Psychology", "Computer Science"
#     ],
#     "Literature Review": [
#         "English", "Literature", "Psychology", "Sociology", "Education",
#         "Business", "Medicine", "Nursing", "Research Methods"
#     ],
#     "Math Solving": [
#         "Mathematics", "Statistics", "Physics", "Engineering", "Economics",
#         "Finance", "Computer Science", "Operations Research"
#     ],
#     "Outline": [
#         "English", "History", "Education", "Research Methods", "Literature",
#         "Political Science", "Sociology"
#     ],
#     "Personal Statement": [
#         "Education", "English", "Law", "Medicine", "Nursing", "Business",
#         "Engineering", "Psychology", "Social Work"
#     ],
#     "Presentation": ["All"],
#     "Proposal": ["All"],
#     "Research Paper": ["All"],
#     "Technical Report": [
#         "Engineering", "Information Technology", "Computer Science",
#         "Environmental Science", "Architecture", "Technical Writing"
#     ],
#     "Thesis": ["All"]
# }

# subjects = [
#     "Accounting", "Algebra", "Anatomy", "Anthropology", "Architecture", "Art",
#     "Biochemistry", "Biology", "Business", "Chemistry", "Communications",
#     "Computer Science", "Creative Writing", "Criminal Justice", "Cultural Studies",
#     "Data Analysis", "Digital Media", "Economics", "Education", "Engineering",
#     "English", "Entrepreneurship", "Environmental Science", "Film Studies",
#     "Finance", "Geography", "Healthcare Administration", "History",
#     "Information Technology", "International Business", "International Relations",
#     "Journalism", "Law", "Literature", "Management", "Marketing", "Mathematics",
#     "Medicine", "Nursing", "Operations Management", "Operations Research",
#     "Philosophy", "Physics", "Political Science", "Psychology", "Public Administration",
#     "Public Relations", "Research Methods", "Social Work", "Sociology", "Statistics",
#     "Technical Writing", "Theater Arts", "Theology", "Web Development"
# ]

# services = []
# base_price = 5.00
# price_per_page = 10.00

# project_id_map = {name: i+1 for i, name in enumerate(project_types.keys())}
# subject_id_map = {name: i+1 for i, name in enumerate(subjects)}

# for project_type, related_subjects in project_types.items():
#     project_type_id = project_id_map[project_type]
    
#     if "All" in related_subjects:
#         matched_subjects = subjects
#     else:
#         matched_subjects = related_subjects
    
#     for subject in matched_subjects:
#         if subject in subject_id_map:
#             subject_id = subject_id_map[subject]
#             services.append({
#                 "title": f"{project_type} - {subject}",
#                 "description": f"Professional {project_type} assistance in {subject}",
#                 "base_price": base_price,
#                 "price_per_page": price_per_page,
#                 "project_type_id": project_type_id,
#                 "subject_id": subject_id,
#                 "unit": project_type
#             })

# try:
#     with open(OUTPUT_FILE, "w") as f:
#         json.dump(services, f, indent=4)
#     print(f" Generated {len(services)} service records in {OUTPUT_FILE}")
# except Exception as e:
#     print(f"Error writing to file: {e}")

# if os.path.exists(OUTPUT_FILE):
#     with open(OUTPUT_FILE, "r") as f:
#         content = f.read()
#         print(f"File content: {content[:100]}...")
# else:
#     print("File was not created.")



import json
import os

OUTPUT_FILE = "services.json"
print(f"📂 Saving services.json to: {OUTPUT_FILE}")

if os.path.exists(OUTPUT_FILE):
    print("🗑️ Deleting old services.json...")
    os.remove(OUTPUT_FILE)

# ✅ Project Types & Their Related Subjects
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

# ✅ Pricing for Each Project Type
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

# ✅ Subject Multipliers
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

# ✅ Generate IDs
project_id_map = {name: i+1 for i, name in enumerate(project_types.keys())}
subject_id_map = {name: i+1 for i, name in subject_multipliers.keys()}

# ✅ Generate Services
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

# ✅ Write JSON File
with open(OUTPUT_FILE, "w") as f:
    json.dump(services, f, indent=4)

print(f"✅ Generated {len(services)} service records in {OUTPUT_FILE}")
