# import json
# import os

# OUTPUT_FILE = "services.json"
# print(f"📂 Saving services.json to: {OUTPUT_FILE}")

# if os.path.exists(OUTPUT_FILE):
#     print(" Deleting old services.json...")
#     os.remove(OUTPUT_FILE)
# print(f"⚠️ {OUTPUT_FILE} already exists. Skipping generation.")

# project_types = {
#     "Annotated Bibliography": ["English", "Literature", "History", "Philosophy"],
#     "Application Essay": ["English", "Education", "Business", "Law"],
#     "Article": ["Communications", "English", "Creative Writing", "Journalism"],
#     "Business Plan": ["Business", "Finance", "Economics"],
#     "Case Study": ["Business", "Law", "Political Science", "Psychology", "Public Administration"],
#     "Code": ["Information Technology", "Web Development", "Engineering"],
#     "Content Writing": ["English", "Creative Writing", "Marketing", "Journalism"],
#     "Coursework": ["Mathematics", "Statistics", "Engineering", "Biology"],
#     "Creative Writing": ["Creative Writing", "English", "Literature"],
#     "Dissertation": ["All"], 
#     "Editing": ["English", "Communications", "Creative Writing", "Journalism"],
#     "Essay": ["All"], 
#     "Excel assignment": ["Accounting", "Finance", "Economics", "Statistics"],
#     "Math solving": ["Mathematics", "Statistics", "Finance", "Engineering"],
#     "Outline": ["English", "History", "Education"],
#     "Personal Statement": ["Education", "English", "Law"],
#     "Presentation": ["All"], 
#     "Proposal": ["All"], 
# }

# subjects = [
#     "Accounting", "Algebra", "Anatomy", "Anthropology", "Architecture", "Art", "Biochemistry", "Biology", "Business",
#     "Chemistry", "Communications", "Creative Writing", "Criminal Justice", "Cultural Studies", "Economics",
#     "Education", "Engineering", "English", "Environmental Science", "Finance", "Geography", "History",
#     "Information Technology", "International Relations", "Law", "Literature", "Mathematics", "Nursing", "Philosophy",
#     "Physics", "Political Science", "Psychology", "Public Administration", "Sociology", "Statistics", "Theology",
#     "Web Development"
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
#                 "description": f"Help with {project_type} in {subject}",
#                 "base_price": base_price,
#                 "price_per_page": price_per_page,
#                 "project_type_id": project_type_id,
#                 "subject_id": subject_id
#             })

# with open(OUTPUT_FILE, "w") as f:
#     json.dump(services, f, indent=4)

# print(f" Generated {len(services)} service records in {OUTPUT_FILE} ")


# import json
# import os

# OUTPUT_FILE = "services.json"
# print(f"📂 Saving services.json to: {OUTPUT_FILE}")

# if os.path.exists(OUTPUT_FILE):
#     print(" Deleting old services.json...")
#     os.remove(OUTPUT_FILE)

# project_types = {
#     "Annotated Bibliography": ["English", "Literature", "History", "Philosophy"],
#     "Application Essay": ["English", "Education", "Business", "Law"],
#     "Article": ["Communications", "English", "Creative Writing", "Journalism"],
#     "Business Plan": ["Business", "Finance", "Economics"],
#     "Case Study": ["Business", "Law", "Political Science", "Psychology", "Public Administration"],
#     "Code": ["Information Technology", "Web Development", "Engineering"],
#     "Content Writing": ["English", "Creative Writing", "Marketing", "Journalism"],
#     "Coursework": ["Mathematics", "Statistics", "Engineering", "Biology"],
#     "Creative Writing": ["Creative Writing", "English", "Literature"],
#     "Dissertation": ["All"], 
#     "Editing": ["English", "Communications", "Creative Writing", "Journalism"],
#     "Essay": ["All"], 
#     "Excel assignment": ["Accounting", "Finance", "Economics", "Statistics"],
#     "Math solving": ["Mathematics", "Statistics", "Finance", "Engineering"],
#     "Outline": ["English", "History", "Education"],
#     "Personal Statement": ["Education", "English", "Law"],
#     "Presentation": ["All"], 
#     "Proposal": ["All"], 
# }

# subjects = [
#     "Accounting", "Algebra", "Anatomy", "Anthropology", "Architecture", "Art", "Biochemistry", "Biology", "Business",
#     "Chemistry", "Communications", "Creative Writing", "Criminal Justice", "Cultural Studies", "Economics",
#     "Education", "Engineering", "English", "Environmental Science", "Finance", "Geography", "History",
#     "Information Technology", "International Relations", "Law", "Literature", "Mathematics", "Nursing", "Philosophy",
#     "Physics", "Political Science", "Psychology", "Public Administration", "Sociology", "Statistics", "Theology",
#     "Web Development"
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
#                 "description": f"Help with {project_type} in {subject}",
#                 "base_price": base_price,
#                 "price_per_page": price_per_page,
#                 "project_type_id": project_type_id,
#                 "subject_id": subject_id
#             })

# with open(OUTPUT_FILE, "w") as f:
#     json.dump(services, f, indent=4)

# print(f" Generated {len(services)} service records in {OUTPUT_FILE}")



import json
import os

OUTPUT_FILE = "services.json"
print(f"📂 Saving services.json to: {OUTPUT_FILE}")

if os.path.exists(OUTPUT_FILE):
    print(" Deleting old services.json...")
    os.remove(OUTPUT_FILE)

project_types = {
    "Annotated Bibliography": [
        "English", "Literature", "History", "Philosophy", "Sociology", 
        "Psychology", "Political Science", "Education", "Nursing", "Business"
    ],
    "Application Essay": [
        "English", "Education", "Business", "Law", "Medicine", "Nursing",
        "Engineering", "Information Technology", "Architecture"
    ],
    "Article": [
        "Communications", "English", "Creative Writing", "Journalism",
        "Business", "Marketing", "Political Science", "International Relations"
    ],
    "Business Plan": [
        "Business", "Finance", "Economics", "Marketing", "Management",
        "Entrepreneurship", "International Business"
    ],
    "Case Study": [
        "Business", "Law", "Political Science", "Psychology", "Public Administration",
        "Marketing", "Finance", "Healthcare Administration", "Education", "Sociology"
    ],
    "Code": [
        "Computer Science", "Information Technology", "Web Development", 
        "Engineering", "Mathematics", "Data Science", "Statistics"
    ],
    "Content Writing": [
        "English", "Creative Writing", "Marketing", "Journalism",
        "Communications", "Digital Media", "Public Relations"
    ],
    "Coursework": [
        "Mathematics", "Statistics", "Engineering", "Biology", "Physics",
        "Chemistry", "Computer Science", "Economics", "Business", "Psychology",
        "Sociology", "Literature", "History", "Political Science"
    ],
    "Creative Writing": [
        "Creative Writing", "English", "Literature", "Communications",
        "Journalism", "Theater Arts", "Film Studies"
    ],
    "Data Analysis": [
        "Statistics", "Mathematics", "Economics", "Business", "Psychology",
        "Sociology", "Marketing", "Research Methods"
    ],
    "Dissertation": ["All"],
    "Editing": [
        "English", "Communications", "Creative Writing", "Journalism",
        "Academic Writing", "Technical Writing"
    ],
    "Essay": ["All"],
    "Excel Assignment": [
        "Accounting", "Finance", "Economics", "Statistics", "Business",
        "Data Analysis", "Operations Management"
    ],
    "Lab Report": [
        "Biology", "Chemistry", "Physics", "Engineering", "Environmental Science",
        "Psychology", "Computer Science"
    ],
    "Literature Review": [
        "English", "Literature", "Psychology", "Sociology", "Education",
        "Business", "Medicine", "Nursing", "Research Methods"
    ],
    "Math Solving": [
        "Mathematics", "Statistics", "Physics", "Engineering", "Economics",
        "Finance", "Computer Science", "Operations Research"
    ],
    "Outline": [
        "English", "History", "Education", "Research Methods", "Literature",
        "Political Science", "Sociology"
    ],
    "Personal Statement": [
        "Education", "English", "Law", "Medicine", "Nursing", "Business",
        "Engineering", "Psychology", "Social Work"
    ],
    "Presentation": ["All"],
    "Proposal": ["All"],
    "Research Paper": ["All"],
    "Technical Report": [
        "Engineering", "Information Technology", "Computer Science",
        "Environmental Science", "Architecture", "Technical Writing"
    ],
    "Thesis": ["All"]
}

subjects = [
    "Accounting", "Algebra", "Anatomy", "Anthropology", "Architecture", "Art",
    "Biochemistry", "Biology", "Business", "Chemistry", "Communications",
    "Computer Science", "Creative Writing", "Criminal Justice", "Cultural Studies",
    "Data Analysis", "Digital Media", "Economics", "Education", "Engineering",
    "English", "Entrepreneurship", "Environmental Science", "Film Studies",
    "Finance", "Geography", "Healthcare Administration", "History",
    "Information Technology", "International Business", "International Relations",
    "Journalism", "Law", "Literature", "Management", "Marketing", "Mathematics",
    "Medicine", "Nursing", "Operations Management", "Operations Research",
    "Philosophy", "Physics", "Political Science", "Psychology", "Public Administration",
    "Public Relations", "Research Methods", "Social Work", "Sociology", "Statistics",
    "Technical Writing", "Theater Arts", "Theology", "Web Development"
]

services = []
base_price = 5.00
price_per_page = 10.00

project_id_map = {name: i+1 for i, name in enumerate(project_types.keys())}
subject_id_map = {name: i+1 for i, name in enumerate(subjects)}

for project_type, related_subjects in project_types.items():
    project_type_id = project_id_map[project_type]
    
    if "All" in related_subjects:
        matched_subjects = subjects
    else:
        matched_subjects = related_subjects
    
    for subject in matched_subjects:
        if subject in subject_id_map:
            subject_id = subject_id_map[subject]
            services.append({
                "title": f"{project_type} - {subject}",
                "description": f"Professional {project_type} assistance in {subject}",
                "base_price": base_price,
                "price_per_page": price_per_page,
                "project_type_id": project_type_id,
                "subject_id": subject_id,
                "unit": project_type
            })

try:
    with open(OUTPUT_FILE, "w") as f:
        json.dump(services, f, indent=4)
    print(f" Generated {len(services)} service records in {OUTPUT_FILE}")
except Exception as e:
    print(f"Error writing to file: {e}")

if os.path.exists(OUTPUT_FILE):
    with open(OUTPUT_FILE, "r") as f:
        content = f.read()
        print(f"File content: {content[:100]}...")
else:
    print("File was not created.")