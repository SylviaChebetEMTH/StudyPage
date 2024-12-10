from flask import Flask,make_response, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from functools import wraps
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, create_refresh_token, get_jwt, verify_jwt_in_request, decode_token
from models import db, User, Expert, Service, ProjectRequest, ProjectType, Subject, Message, Conversation
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_migrate import Migrate
from flask_restful import Resource,Api
import cloudinary.uploader
from datetime import datetime
import os
SECRET_KEY = os.urandom(24)

app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///studypage.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = SECRET_KEY
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):  # Ensure the folder exists
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
CORS(app,resources={r"/*": {"origins": "http://localhost:3001"}})

# @app.route('/messages', methods=['GET'])
# def get_messages():
#     messages = Message.query.all()  # Get all messages from the database
#     message_list = [{'user': message.sender.username, 'message': message.content} for message in messages]
#     return {'messages': message_list}





# Admin Messages Route
@app.route('/adminmessages', methods=['GET'])
@jwt_required()  # Ensure the request is coming from a valid user (admin)
def get_admin_messages():
    # Get the current logged-in user (admin in this case)
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or not current_user.is_admin:
        return jsonify({'error': 'Admin user is not authenticated or found'}), 403

    # Fetch messages sent to the admin user
    messages = Message.query.filter_by(receiver_id=current_user.id).all()

    if not messages:
        return jsonify({'message': 'No messages for admin'}), 404

    # Format the messages to return them as a list
    message_list = [{'user': message.sender.username, 'message': message.content} for message in messages]

    return jsonify({'messages': message_list}), 200

@app.route("/usermessages", methods=["GET"])
@jwt_required()  # Ensure the user is logged in
def get_user_messages():
    current_user_id = get_jwt_identity()  # Retrieve the current logged-in user's ID
    current_user = User.query.get(current_user_id)  # Fetch the user from the database

    if not current_user:
        return jsonify({"message": "User not found"}), 404

    # Retrieve messages that are sent to the current user
    messages = Message.query.filter_by(receiver_id=current_user.id).all()

    # Format messages for the response
    message_list = [{'user': message.sender.username, 'message': message.content} for message in messages]

    return jsonify({'messages': message_list}), 200



# Create the folder if it doesn't exist
# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)

# Define allowed file extensions (optional)
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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

    # Hash the password using bcrypt before saving
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create the new user with hashed password
    new_user = User(username=username, email=email, password=hashed_password, is_admin=is_admin)

    # Add and commit the new user to the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully.', 'user_id': new_user.id}), 201

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

class Projects(Resource):
    @jwt_required()
    def get(self):
        projects = ProjectRequest.query.all()
        if projects:
            project_list = []
            for project in projects:
                user = User.query.filter_by(id=project.user_id).first()
                expert = Expert.query.filter_by(id=project.expert_id).first()

                project_list.append({
                    'client_name': user.username if user else "Unknown Client",
                    'expert_name': expert.name if expert else "Unknown Expert",
                    'project_title': project.project_title,
                    'project_description': project.project_description,
                    'status': project.status,
                    'deadline': project.deadline.strftime('%Y-%m-%d'),
                    'attachments': project.attachments,
                    'number_of_pages': project.number_of_pages,
                    'project_id': project.id
                })

            response = make_response(jsonify(project_list), 200)
        else:
            response = make_response(jsonify({'error': 'No projects found'}), 404)
        return response

@app.route('/projects/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project_details(project_id):
    project = ProjectRequest.query.get_or_404(project_id)

    response = {
        'project_title': project.project_title,
        'project_description': project.project_description,
        'deadline': project.deadline.strftime('%Y-%m-%d'),
        'attachments': project.attachments,  # Ensure this is a URL or file reference
        'client_name': project.user.username if project.user else "Unknown",
    }
    return jsonify(response)

@app.route('/projects/<int:project_id>/submit', methods=['POST'])
@jwt_required()
def submit_project(project_id):
    project = ProjectRequest.query.get_or_404(project_id)

    # Parse form data for submission
    files = request.files.getlist('files')  # Multiple file uploads
    comments = request.form.get('comments')

    # Save files and handle logic
    for file in files:
        file.save(f"uploads/{file.filename}")

    # Update project status
    project.status = 'Completed'
    db.session.commit()

    return jsonify({'message': 'Project submitted successfully'})

@app.route('/request_expert', methods=['POST'])
@jwt_required()
def request_expert():
    data = request.form
    files = request.files.getlist('attachments')

    deadline_str = data.get('deadline')  # e.g., "2024-12-11"
    try:
        deadline = datetime.strptime(deadline_str, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Invalid deadline format. Use YYYY-MM-DD."}), 400

    # Save the project request
    project = ProjectRequest(
        project_title=data.get('project_title'),
        project_description=data.get('project_description'),
        project_type_id=data.get('project_type'),
        subject_id=data.get('subject'),
        deadline=deadline,
        expert_id=data.get('expert_id'),
        user_id=get_jwt_identity(),  # Assuming JWT returns client ID
        number_of_pages=data.get('number_of_pages')
    )
    db.session.add(project)
    db.session.commit()

    # Save files
    attachments = []
    for file in files:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        attachments.append(file_path)
    project.attachments = ','.join(attachments)
    db.session.commit()

    # Create a conversation
    conversation = Conversation(
        client_id=get_jwt_identity(),
        expert_id=data.get('expert_id'),
        project_id=project.id
    )
    db.session.add(conversation)
    db.session.commit()

    # Add an initial message
    message = Message(
        conversation_id=conversation.id,
        sender_id=get_jwt_identity(),
        content=f"New project submitted: {project.project_title}",
        attachments=project.attachments
    )
    db.session.add(message)
    db.session.commit()

    return jsonify({'message': 'Project submitted successfully', 'conversation_id': conversation.id}), 201


# @app.route('/request_expert', methods=['POST'])
# @jwt_required()  # Ensure that the user is authenticated
# def request_expert():
#     try:
#         # Retrieve form data
#         project_title = request.form.get('project_title')
#         project_description = request.form.get('project_description')
#         project_type_id = request.form.get('project_type')
#         subject_id = request.form.get('subject')
#         deadline = request.form.get('deadline')
#         expert_id = request.form.get('expert_id')
#         number_of_pages = request.form.get('number_of_pages')

#         # Handle file attachments
#         attachments = []  # Start with an empty list
#         if 'attachments' in request.files:
#             files = request.files.getlist('attachments')
#             print(f"Files received: {len(files)} files")
#             for file in files:
#                 if file and allowed_file(file.filename):
#                     print(f"File received: {file.filename}")
#                     filename = secure_filename(file.filename)
#                     file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#                     print(f"Saving file to: {file_path}")
#                     try:
#                         file.save(file_path)
#                     except Exception as e:
#                         print(f"Error saving file: {e}")
#                     attachments.append(filename)  # Store only the filename or file path

#         # Validate input fields
#         if not all([project_title, project_description, project_type_id, subject_id, deadline]):
#             return jsonify({'msg': 'Not enough segments'}), 422

#         if not expert_id:
#             return jsonify({'msg': 'Expert ID is required'}), 400

#         try:
#             expert_id = int(expert_id)
#             project_type_id = int(project_type_id)
#             subject_id = int(subject_id)
#         except ValueError:
#             return jsonify({'msg': 'Invalid ID, must be a number'}), 400

#         try:
#             deadline = datetime.strptime(deadline, '%Y-%m-%d')
#         except ValueError:
#             return jsonify({'msg': 'Invalid date format, use YYYY-MM-DD'}), 400

#         # Query the related objects based on the provided IDs
#         expert = Expert.query.get(expert_id)
#         project_type = ProjectType.query.get(project_type_id)
#         subject = Subject.query.get(subject_id)

#         # If any of the objects do not exist, return an error message
#         if not all([expert, project_type, subject]):
#             return jsonify({'msg': 'Invalid Expert, Project Type, or Subject ID'}), 400

#         # Get current user details using JWT identity
#         current_user_id = get_jwt_identity()  # Get the current logged-in user ID
#         current_user = User.query.get(current_user_id)
#         if not current_user:
#             return jsonify({'msg': 'Current user not found'}), 404

#         # Create a new project request instance
#         new_request = ProjectRequest(
#             project_title=project_title,
#             project_description=project_description,
#             project_type=project_type,
#             subject=subject,
#             expert=expert,
#             deadline=deadline,
#             user_id=current_user.id,  # Assign current user's ID to the project request
#             attachments=','.join(attachments),  # Join the list of filenames as a comma-separated string
#             number_of_pages=number_of_pages
#         )

#         # Log project request data for debugging
#         print(f"Project request data: {new_request.__dict__}")

#         # Add to database
#         db.session.add(new_request)
#         db.session.commit()

#         return jsonify({'msg': 'Request submitted successfully'}), 200

#     except Exception as e:
#         db.session.rollback()
#         print(f"Error occurred: {e}")
#         return jsonify({'error': str(e)}), 500

@app.route('/conversations/<int:conversation_id>/messages', methods=['POST'])
@jwt_required()
def send_message(conversation_id):
    data = request.form
    files = request.files.getlist('attachments')

    attachments = []
    for file in files:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        attachments.append(file_path)

    message = Message(
        conversation_id=conversation_id,
        sender_id=get_jwt_identity(),
        content=data.get('content'),
        attachments=', '.join(attachments)
    )
    db.session.add(message)
    db.session.commit()

    return jsonify(message.to_dict()), 201


@app.route('/uploads/<filename>', methods=['GET'])
def download_file(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404

@app.route('/my_requests', methods=['GET'])
@jwt_required()  # Ensure that the user is authenticated
def get_user_requests():
    try:
        # Get current user details using JWT identity
        current_user_id = get_jwt_identity()  # Get the current logged-in user ID
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'msg': 'User not found'}), 404

        # Query all project requests related to the current user
        user_requests = ProjectRequest.query.filter_by(user_id=current_user.id).all()

        # If no requests exist, return an empty response with a message
        if not user_requests:
            return jsonify({'msg': 'No project requests found for this user'}), 404

        # Prepare the data to return (you can filter fields based on what you need)
        requests_data = []
        for request in user_requests:
            requests_data.append({
                'project_title': request.project_title,
                'project_description': request.project_description,
                'project_type': request.project_type.name if request.project_type else None,
                'subject': request.subject.name if request.subject else None,
                'expert': request.expert.name if request.expert else None,
                'deadline': request.deadline.strftime('%Y-%m-%d'),
                'attachments': request.attachments.split(','),  # Assuming attachments are stored as a comma-separated string
                'number_of_pages': request.number_of_pages
            })

        return jsonify({'msg': 'Project requests fetched successfully', 'data': requests_data}), 200

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/conversations', methods=['GET'])
@jwt_required()
def get_conversations():
    user_id = get_jwt_identity()
    conversations = Conversation.query.filter(
        (Conversation.client_id == user_id) | (Conversation.expert_id == user_id)
    ).all()
    print ('convoconvoconvo',conversations)

    response = [
        {
            'id': conv.id,
            'client': conv.client_id,
            'expert': conv.expert_id,
            'project': conv.project_id,
            'created_at': conv.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        for conv in conversations
    ]
    return jsonify(response), 200


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


 # Should display all messages for this conversation


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
api.add_resource(Projects, '/projects')
if __name__ == '__main__':
    app.run(debug=True)
    
