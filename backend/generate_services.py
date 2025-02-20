import json
import os

OUTPUT_FILE = "services.json"
print(f"📂 Saving services.json to: {OUTPUT_FILE}")

# if os.path.exists(OUTPUT_FILE):
#     print("🗑️ Deleting old services.json...")
#     os.remove(OUTPUT_FILE)
#     print(f"⚠️ {OUTPUT_FILE} already exists. Skipping generation.")
# else:
project_types = {
    "Annotated Bibliography": ["English", "Literature", "History", "Philosophy"],
    "Application Essay": ["English", "Education", "Business", "Law"],
    "Article": ["Communications", "English", "Creative Writing", "Journalism"],
    "Business Plan": ["Business", "Finance", "Economics"],
    "Case Study": ["Business", "Law", "Political Science", "Psychology", "Public Administration"],
    "Code": ["Information Technology", "Web Development", "Engineering"],
    "Content Writing": ["English", "Creative Writing", "Marketing", "Journalism"],
    "Coursework": ["Mathematics", "Statistics", "Engineering", "Biology"],
    "Creative Writing": ["Creative Writing", "English", "Literature"],
    "Dissertation": ["All"], 
    "Editing": ["English", "Communications", "Creative Writing", "Journalism"],
    "Essay": ["All"], 
    "Excel assignment": ["Accounting", "Finance", "Economics", "Statistics"],
    "Math solving": ["Mathematics", "Statistics", "Finance", "Engineering"],
    "Outline": ["English", "History", "Education"],
    "Personal Statement": ["Education", "English", "Law"],
    "Presentation": ["All"], 
    "Proposal": ["All"], 
}

subjects = [
    "Accounting", "Algebra", "Anatomy", "Anthropology", "Architecture", "Art", "Biochemistry", "Biology", "Business",
    "Chemistry", "Communications", "Creative Writing", "Criminal Justice", "Cultural Studies", "Economics",
    "Education", "Engineering", "English", "Environmental Science", "Finance", "Geography", "History",
    "Information Technology", "International Relations", "Law", "Literature", "Mathematics", "Nursing", "Philosophy",
    "Physics", "Political Science", "Psychology", "Public Administration", "Sociology", "Statistics", "Theology",
    "Web Development"
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
                "description": f"Help with {project_type} in {subject}",
                "base_price": base_price,
                "price_per_page": price_per_page,
                "project_type_id": project_type_id,
                "subject_id": subject_id
            })

with open(OUTPUT_FILE, "w") as f:
    json.dump(services, f, indent=4)

print(f" Generated {len(services)} service records in {OUTPUT_FILE} ")
