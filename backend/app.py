from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from functools import wraps
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, create_refresh_token, get_jwt
from models import db, User, Expert, Service, ProjectRequest, ProjectType, Subject
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate
import os
SECRET_KEY = os.urandom(24)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///studypage.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = SECRET_KEY

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
CORS(app)


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        current_user = get_jwt_identity()
        user = User.query.filter_by(id=current_user).first()
        if not user.is_admin:
            return jsonify({'message': 'Admin access required'}), 403
        return fn(*args, **kwargs)
    return wrapper

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Check if the required fields are present
    if 'username' not in data or 'email' not in data or 'password' not in data or 'phone_number' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if the user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'error': 'User with this email already exists'}), 400
    
    # Hash the password
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    # Create a new user object
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password,
        is_admin=False,
        phone_number=data['phone_number']
    )

    # Add to the database and commit
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'success': 'User registered successfully'}), 201


@app.route('/login', methods=['POST'])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return jsonify({"access_token": access_token, "refresh_token": refresh_token})
    else:
        return jsonify({"message": "Invalid username or password"}), 401

@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id)
    return jsonify({"access_token": new_access_token}), 200

@app.route("/current_user", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if current_user:
        return jsonify({
            "id": current_user.id, 
            "username": current_user.username, 
            "email": current_user.email,
            "is_admin": current_user.is_admin
        }), 200
    else:
        return jsonify({"message": "User not found"}), 404


BLACKLIST = set()
# @jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, decrypted_token):
    jti = decrypted_token["jti"]
    return jti in BLACKLIST

@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    BLACKLIST.add(jti)
    return jsonify({"success":"Logged out successfully"}), 200


@app.route('/admin/users', methods=['GET'])
@jwt_required()
@admin_required
def get_users():
    users = User.query.all()
    users_list = [{'id': user.id, 'username': user.username, 'email': user.email, 'is_admin': user.is_admin} for user in users]
    return jsonify({'users': users_list})

@app.route('/admin/users/<int:id>', methods=['PATCH'])
@jwt_required()
@admin_required
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    data = request.get_json()
    is_admin = data.get('is_admin')
    
    if is_admin is not None:
        user.is_admin = is_admin
        db.session.commit()
        return jsonify({'message': 'User updated successfully'})
    return jsonify({'message': 'No updates provided'}), 400



@app.route('/admin/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()  # This retrieves the user ID
    current_user = User.query.get(current_user_id)  # Fetch the user object from the database

    if not current_user or not current_user.is_admin:
        return jsonify({'message': 'Admin access required'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': 'User deleted successfully'})



@app.route('/admin/users', methods=['POST'])
@jwt_required()  # Ensure only authenticated users can access this route
def add_user():
    data = request.get_json()

    # Validate input data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    is_admin = data.get('is_admin', False)  # Default to False if not provided

    if not username or not email or not password:
        return jsonify({'message': 'Username, email, and password are required.'}), 400

    # Check if user already exists
    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        return jsonify({'message': 'User with this username or email already exists.'}), 400

    # Hash the password before saving
    hashed_password = generate_password_hash(password)

    new_user = User(username=username, email=email, password=hashed_password, is_admin=is_admin)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully.', 'user_id': new_user.id}), 201




# # Route to get experts (viewable by normal users and admins)
# @app.route('/experts', methods=['GET'])
# def get_experts():
#     experts = Expert.query.all()  # Fetch all experts from the database
#     output = []

#     for expert in experts:
#         expert_data = {
#             'id': expert.id,
#             'name': expert.name,
#             'title': expert.title,
#             'expertise': expert.expertise,
#             'description': expert.description,
#             'biography': expert.biography,
#             'education': expert.education,
#             'languages': expert.languages,
#             'projecTypes': expert.project_types,
#             'subjects': expert.subjects,
#             'profilePicture': expert.profile_picture  
#         }
#         output.append(expert_data)

#     return jsonify({'experts': output})

@app.route('/experts', methods=['GET'])
def get_experts():
    experts = Expert.query.all()  # Fetch all experts from the database
    output = []

    for expert in experts:
        expert_data = {
            'id': expert.id,
            'name': expert.name,
            'title': expert.title,
            'expertise': expert.expertise,
            'description': expert.description,
            'biography': expert.biography,
            'education': expert.education,
            'languages': expert.languages,
            'projectType': expert.project_type.name if expert.project_type else None,  # Corrected to use `project_type`
            'subject': expert.subject.name if expert.subject else None,  # Corrected to use `subject`
            'profilePicture': expert.profile_picture
        }
        output.append(expert_data)

    return jsonify({'experts': output})



# Route to request an expert
@app.route('/request_expert', methods=['POST'])
@jwt_required()
def request_expert():
    data = request.json
    user_id = get_jwt_identity()
    expert_id = data['expert_id']
    project_description = data['project_description']

    new_request = ProjectRequest(user_id=user_id, expert_id=expert_id, project_description=project_description)
    db.session.add(new_request)
    db.session.commit()

    return jsonify({'message': 'Request submitted successfully!'}), 201

@app.route('/experts/<int:id>', methods=['GET'])
def get_expert(id):
    expert = Expert.query.get(id)
    if not expert:
        return jsonify({'message': 'Expert not found'}), 404

    expert_data = {
        'id': expert.id,
        'name': expert.name,
        'title': expert.title,
        'expertise': expert.expertise,
        'description': expert.description,
        'biography': expert.biography,
        'education': expert.education,
        'languages': expert.languages,
        'projectTypes': expert.project_types,
        'subjects': expert.subjects,
        'profilePicture': expert.profile_picture  
    }
    return jsonify({'expert': expert_data})

@app.route("/experts", methods=["POST"])
def add_expert():
    data = request.get_json()
    project_type_id = data.get("project_type_id")
    subject_id = data.get("subject_id")

    print(f"Received project_type_id: {project_type_id}, subject_id: {subject_id}")  # Debug log

    profile_picture = data.get("profile_picture")
    if not profile_picture:
        return jsonify({"error": "Profile picture is required"}), 400

    project_type = ProjectType.query.get(project_type_id)
    subject = Subject.query.get(subject_id)

    if not project_type or not subject:
        return jsonify({"error": "Invalid project type or subject"}), 400
    
    # Create and save the expert
    new_expert = Expert(
        name=data["name"],
        title=data["title"],
        expertise=data["expertise"],
        description=data["description"],
        biography=data["biography"],
        education=data["education"],
        languages=data["languages"],
        profile_picture=profile_picture,
        project_type=project_type,
        subject=subject
    )

    db.session.add(new_expert)
    db.session.commit()

    return jsonify({"message": "Expert added successfully!"}), 201




@app.route('/experts/<int:id>', methods=['PATCH'])
@jwt_required()
def partial_update_expert(id):
    user_id = get_jwt_identity()
    
    # Query the user based on the ID returned by get_jwt_identity()
    user = User.query.get(user_id)
    
    # Check if the user exists and is an admin
    if not user or not user.is_admin:
        return jsonify({'message': 'Permission denied'}), 403

    expert = Expert.query.get(id)
    if not expert:
        return jsonify({'message': 'Expert not found'}), 404

    data = request.get_json()

    # Update expert fields based on the provided data
    if 'name' in data:
        expert.name = data['name']
    if 'title' in data:
        expert.title = data['title']
    if 'expertise' in data:
        expert.expertise = data['expertise']
    if 'description' in data:
        expert.description = data['description']
    if 'biography' in data:
        expert.biography = data['biography']
    if 'education' in data:
        expert.education = data['education']
    if 'languages' in data:
        expert.languages = data['languages']
    if 'projectTypes' in data:
        expert.project_types = data['projectTypes']
    if 'subjects' in data:
        expert.subjects = data['subjects']
    if 'profilePicture' in data:
        expert.profile_picture = data['profilePicture']

    db.session.commit()
    return jsonify({'message': 'Expert updated successfully'}), 200



@app.route('/experts/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_expert(id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or not user.is_admin:
        return jsonify({'message': 'Permission denied'}), 403

    expert = Expert.query.get(id)
    if not expert:
        return jsonify({'message': 'Expert not found'}), 404

    try:
        db.session.delete(expert)
        db.session.commit()
        return jsonify({'message': 'Expert deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()  # Rollback the session in case of error
        return jsonify({'message': 'Error deleting expert', 'error': str(e)}), 500



# @app.route('/services', methods=['GET'])
# def get_services():
#     services = Service.query.all()  # Fetch all services from the database
#     service_list = []

#     for service in services:
#         service_data = {
#             'id': service.id,
#             'title': service.title,
#             'description': service.description,
#             'price': service.price,
#             # 'project_type_name': service.project_type.name,  
#             # 'subject_area_name': service.subject_area.name,
            
#         }
#         service_list.append(service_data)

#     return jsonify({'services': service_list})  

@app.route('/services', methods=['GET'])
def get_services():
    services = Service.query.options(db.joinedload(Service.project_type)).all()  # Fetch all services with related project type
    service_list = []

    for service in services:
        service_data = {
            'id': service.id,
            'title': service.title,
            'description': service.description,
            'price': service.price,
            'project_type_name': service.project_type.name if service.project_type else None,  # Get project type name
            'subject_name': service.subject.name if service.subject else None  # Get subject name, optional
        }
        service_list.append(service_data)

    return jsonify({'services': service_list})



@app.route('/services', methods=['POST'])
def add_service():
    if not request.is_json:
        return jsonify({"message": "Invalid request. JSON data required."}), 400

    data = request.get_json()

    title = data.get('title')
    description = data.get('description')
    price = data.get('price')
    project_type_id = data.get('project_type_id')  # Capture project_type_id
    subject_id = data.get('subject_id')  # Capture subject_id

    if not title or not description or price is None or project_type_id is None or subject_id is None:
        return jsonify({"message": "Title, description, price, project type, and subject are required."}), 400

    new_service = Service(
        title=title,
        description=description,
        price=price,
        project_type_id=project_type_id,
        subject_id=subject_id  # Include subject_id
    )

    try:
        db.session.add(new_service)
        db.session.commit()
        return jsonify({"message": "Service added successfully!", "service": {
            'id': new_service.id,
            'title': new_service.title,
            'description': new_service.description,
            'price': new_service.price,
            'project_type_id': new_service.project_type_id,
            'subject_id': new_service.subject_id  # Include subject_id in the response
        }}), 201
    except Exception as e:
        db.session.rollback()
        print("Error adding service:", str(e))
        return jsonify({"message": "Failed to add service.", "error": str(e)}), 500




@app.route('/project-types', methods=['GET'])
def get_project_types():
    try:
        project_types = ProjectType.query.all()  
        return jsonify([project_type.to_dict() for project_type in project_types]), 200
    except Exception as e:
        print("Error occurred:", e)  
        return jsonify({'message': str(e)}), 500  


# POST route to create a new project type
@app.route('/project-types', methods=['POST'])
def create_project_type():
    try:
        data = request.get_json()
        new_project_type = ProjectType(name=data['name'])
        db.session.add(new_project_type)
        db.session.commit()
        return jsonify(new_project_type.to_dict()), 201
    except Exception as e:
        print("Error occurred:", e)
        return jsonify({'message': str(e)}), 500


# PUT route to update a project type
@app.route('/project-types/<int:id>', methods=['PUT'])
def update_project_type(id):
    try:
        data = request.get_json()
        project_type = ProjectType.query.get_or_404(id)
        project_type.name = data['name']
        db.session.commit()
        return jsonify(project_type.to_dict()), 200
    except Exception as e:
        print("Error occurred:", e)
        return jsonify({'message': str(e)}), 500


# DELETE route to delete a project type
@app.route('/project-types/<int:id>', methods=['DELETE'])
def delete_project_type(id):
    try:
        project_type = ProjectType.query.get_or_404(id)
        db.session.delete(project_type)
        db.session.commit()
        return jsonify({'message': 'Project type deleted successfully'}), 200
    except Exception as e:
        print("Error occurred:", e)
        return jsonify({'message': str(e)}), 500


@app.route('/subjects', methods=['GET'])
def get_subjects():
    try:
        subjects = Subject.query.all()  # Query all subjects from the database
        return jsonify([subject.to_dict() for subject in subjects]), 200  # Return as JSON
    except Exception as e:
        print(f"Error fetching subjects: {e}")
        return jsonify({'message': 'Failed to fetch subjects'}), 500


# POST route to create a new subject
@app.route('/subjects', methods=['POST'])
def create_subject():
    try:
        data = request.get_json()
        new_subject = Subject(name=data['name'])  # Assuming the Subject model has a 'name' field
        db.session.add(new_subject)
        db.session.commit()
        return jsonify(new_subject.to_dict()), 201  # Return the created subject
    except Exception as e:
        print(f"Error creating subject: {e}")
        return jsonify({'message': 'Failed to create subject'}), 500


# PUT route to update a subject by its ID
@app.route('/subjects/<int:id>', methods=['PUT'])
def update_subject(id):
    try:
        data = request.get_json()
        subject = Subject.query.get_or_404(id)
        subject.name = data['name']
        db.session.commit()
        return jsonify(subject.to_dict()), 200  # Return the updated subject
    except Exception as e:
        print(f"Error updating subject: {e}")
        return jsonify({'message': 'Failed to update subject'}), 500


# DELETE route to delete a subject by its ID
@app.route('/subjects/<int:id>', methods=['DELETE'])
def delete_subject(id):
    try:
        subject = Subject.query.get_or_404(id)
        db.session.delete(subject)
        db.session.commit()
        return jsonify({'message': 'Subject deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting subject: {e}")
        return jsonify({'message': 'Failed to delete subject'}), 500



# Route for admin to update services
@app.route('/services/<int:id>', methods=['PUT'])
@jwt_required()
def update_service(id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user.is_admin:
        return jsonify({'message': 'Admin privileges required!'}), 403

    service = Service.query.get(id)
    if service:
        data = request.json
        service.title = data['title']
        service.description = data['description']
        service.price = data['price']
        db.session.commit()
        return jsonify({'message': 'Service updated successfully!'})
    return jsonify({'message': 'Service not found!'}), 404

@app.route('/services/<int:service_id>', methods=['DELETE'])
def delete_service(service_id):
    # Find the service by ID
    service = Service.query.get(service_id)
    
    # If service is not found, return a 404 error
    if not service:
        return jsonify({"error": "Service not found"}), 404
    
    try:
        # Delete the service
        db.session.delete(service)
        db.session.commit()
        return jsonify({"message": "Service deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()  # Rollback the session in case of error
        print(f"Error deleting service: {e}")
        return jsonify({"error": "Could not delete service"}), 500

# Route for admin to partially update services
@app.route('/services/<int:id>', methods=['PATCH'])
@jwt_required()
def patch_service(id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user.is_admin:
        return jsonify({'message': 'Admin privileges required!'}), 403

    service = Service.query.get(id)
    if service:
        data = request.json
        # Only update fields that are provided in the request
        if 'title' in data:
            service.title = data['title']
        if 'description' in data:
            service.description = data['description']
        if 'price' in data:
            service.price = data['price']
        
        db.session.commit()
        return jsonify({'message': 'Service updated successfully!'})
    
    return jsonify({'message': 'Service not found!'}), 404

if __name__ == '__main__':
    app.run(debug=True)
