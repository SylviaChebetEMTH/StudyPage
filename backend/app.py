from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from functools import wraps
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, create_refresh_token, get_jwt
from models import db, User, Expert, Service, ProjectRequest
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
    current_user = get_jwt_identity()
    if not current_user['is_admin']:
        return jsonify({'message': 'Admin access required'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': 'User deleted successfully'})




# Route to get experts (viewable by normal users and admins)
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
            'projecTypes': expert.project_types,
            'subjects': expert.subjects,
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
    profile_picture = data.get("profile_picture")  # Ensure you handle this
    if not profile_picture:
        return jsonify({"error": "Profile picture is required"}), 400
    
    # Save the expert's data, including profile picture
    new_expert = Expert(
        name=data["name"],
        title=data["title"],
        expertise=data["expertise"],
        description=data["description"],
        biography=data["biography"],
        education=data["education"],
        languages=data["languages"],
        project_types=data["project_types"],
        subjects=data["subjects"],
        profile_picture=profile_picture  # Save to the database
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
    current_user = get_jwt_identity()

    # Check if the current user is an admin
    if not current_user['is_admin']:
        return jsonify({'message': 'Permission denied'}), 403

    expert = Expert.query.get(id)
    if not expert:
        return jsonify({'message': 'Expert not found'}), 404

    db.session.delete(expert)
    db.session.commit()

    return jsonify({'message': 'Expert deleted successfully'})


@app.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()  # Fetch all services from the database
    service_list = []

    for service in services:
        service_data = {
            'id': service.id,
            'title': service.title,
            'description': service.description,
            'price': service.price,
            
        }
        service_list.append(service_data)

    return jsonify({'services': service_list})  

@app.route('/services', methods=['POST'])
def add_service():
    # Check if the request contains JSON data
    if not request.is_json:
        return jsonify({"message": "Invalid request. JSON data required."}), 400

    # Get service data from the request
    data = request.get_json()

    title = data.get('title')
    description = data.get('description')
    price = data.get('price')

    # Validate required fields
    if not title or not description or price is None:
        return jsonify({"message": "Title, description, and price are required."}), 400

    # Create a new service instance
    new_service = Service(title=title, description=description, price=price)

    # Add the service to the session and commit
    try:
        db.session.add(new_service)
        db.session.commit()
        return jsonify({"message": "Service added successfully!", "service": {
            'id': new_service.id,
            'title': new_service.title,
            'description': new_service.description,
            'price': new_service.price
        }}), 201
    except Exception as e:
        db.session.rollback()  # Rollback in case of an error
        return jsonify({"message": "Failed to add service.", "error": str(e)}), 500


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
