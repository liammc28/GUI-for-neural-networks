from app import db
from passlib.hash import pbkdf2_sha256 as sha256


class user_login(db.Model):
    __tablename__='user'
    user_id = db.Column('user_id', db.String(50), primary_key=True)
    user_email = db.Column('user_email', db.String(50), unique=True, nullable=False)
    password = db.Column('password', db.String(120), unique=True, nullable=False)
    verified = db.Column('verified', db.Boolean, nullable=False)
    user_personal_details_id = db.Column('user_personal_details_id',
                                         db.String(50),
                                         db.ForeignKey('user_personal_details.id'))
    user_personal_details = db.relationship("user_personal_details")
    user_models_id = db.Column('user_models_id', db.String(50), db.ForeignKey('user_models.user_models_id'))
    user_models = db.relationship("user_models", lazy=False)

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash_code):
        return sha256.verify(password, hash_code)


class user_personal_details(db.Model):
    __tablename__ = 'user_personal_details'
    id = db.Column('id', db.String(50), primary_key=True)
    first_name = db.Column('first_name', db.String(50), nullable=False)
    surname = db.Column('surname', db.String(50), nullable=False)


class user_models(db.Model):
    __tablename__ = 'user_models'
    user_models_id = db.Column('user_models_id', db.String(50), primary_key=True)
    model_id = db.Column('model_id', db.String(50), db.ForeignKey('model_details.model_id'), primary_key=True)
    model_details = db.relationship("model_details", lazy=False)


class model_details(db.Model):
    __tablename__ = 'model_details'
    model_id = db.Column('model_id', db.String(50), primary_key=True)
    model_name = db.Column('model_name', db.String(50))
    training_id = db.Column('training_id', db.String(50), db.ForeignKey('model_training.training_id'))
    model_training = db.relationship("model_training", lazy=False)
    details_address = db.Column('details_address', db.String(1000))
    dataset = db.Column('dataset', db.String(1000))


class model_training(db.Model):
    __tablename__ = 'model_training'
    training_id = db.Column('training_id', db.String(50), primary_key=True)
    training_details_id = db.Column('training_details_id',
                                    db.String(50),
                                    db.ForeignKey('training_details.training_details_id'), primary_key=True)
    training_details = db.relationship("training_details", lazy=False)


class training_details(db.Model):
    __tablename__ = 'training_details'
    model_id = db.Column('training_details_id', db.String(50), primary_key=True)
    training_details_address = db.Column('training_details_address', db.String(100))
    trained_model_address = db.Column('trained_model_address', db.String(100))
    training_name = db.Column('training_name', db.String(50))
