#!/bin/bash

# Base URL
BASE_URL="https://studypage.onrender.com"

echo "Adding Project Types..."

project_types=(
    "Annotated Bibliography"
    "Application Essay"
    "Article"
    "Business Plan"
    "Case Study"
    "Code"
    "Content Writing"
    "Coursework"
    "Creative Writing"
    "Data Analysis"
    "Dissertation"
    "Editing"
    "Essay"
    "Excel Assignment"
    "Lab Report"
    "Literature Review"
    "Math Solving"
    "Outline"
    "Personal Statement"
    "Presentation"
    "Proposal"
    "Research Paper"
    "Technical Report"
    "Thesis"
)

for type in "${project_types[@]}"; do
    echo "Adding project type: $type"
    curl -X POST "$BASE_URL/project-types" \
        -H "Content-Type: application/json" \
        -d "{\"name\": \"$type\"}"
    echo -e "\n"
    sleep 1
done

echo "Adding Subjects..."

# Subjects
subjects=(
    "Accounting"
    "Algebra"
    "Anatomy"
    "Anthropology"
    "Architecture"
    "Art"
    "Biochemistry"
    "Biology"
    "Business"
    "Chemistry"
    "Communications"
    "Computer Science"
    "Creative Writing"
    "Criminal Justice"
    "Cultural Studies"
    "Data Analysis"
    "Digital Media"
    "Economics"
    "Education"
    "Engineering"
    "English"
    "Entrepreneurship"
    "Environmental Science"
    "Film Studies"
    "Finance"
    "Geography"
    "Healthcare Administration"
    "History"
    "Information Technology"
    "International Business"
    "International Relations"
    "Journalism"
    "Law"
    "Literature"
    "Management"
    "Marketing"
    "Mathematics"
    "Medicine"
    "Nursing"
    "Operations Management"
    "Operations Research"
    "Philosophy"
    "Physics"
    "Political Science"
    "Psychology"
    "Public Administration"
    "Public Relations"
    "Research Methods"
    "Social Work"
    "Sociology"
    "Statistics"
    "Technical Writing"
    "Theater Arts"
    "Theology"
    "Web Development"
)

for subject in "${subjects[@]}"; do
    echo "Adding subject: $subject"
    curl -X POST "$BASE_URL/subjects" \
        -H "Content-Type: application/json" \
        -d "{\"name\": \"$subject\"}"
    echo -e "\n"
    sleep 1
done

echo "Data injection complete!"