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
@jwt_required()
def get_experts():
    experts = Expert.query.all()
    expert_list = [{'id': expert.id, 'name': expert.name, 'expertise': expert.expertise, 'description': expert.description} for expert in experts]
    return jsonify(expert_list)

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

# Route to get all services (viewable by both users and admins)
@app.route('/services', methods=['GET'])
@jwt_required()
def get_services():
    services = Service.query.all()
    service_list = [{'id': service.id, 'title': service.title, 'description': service.description, 'price': service.price} for service in services]
    return jsonify(service_list)

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

if __name__ == '__main__':
    app.run(debug=True)
