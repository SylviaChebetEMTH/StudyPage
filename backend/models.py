from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()



class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    phone_number = db.Column(db.String(20))



class Expert(db.Model):
    __tablename__ = 'experts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    expertise = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    biography = db.Column(db.Text, nullable=True)
    education = db.Column(db.String(255), nullable=True)
    languages = db.Column(db.String(255), nullable=True)  
    project_types = db.Column(db.String(255), nullable=True)  
    subjects = db.Column(db.String(255), nullable=True)  
    profile_picture = db.Column(db.String(120)) 

class Service(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float)

class ProjectRequest(db.Model):
    __tablename__ = 'project_requests'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    expert_id = db.Column(db.Integer, db.ForeignKey('experts.id'))
    project_description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='Pending')

    user = db.relationship('User', backref='requests')
    expert = db.relationship('Expert', backref='requests')