from flask import jsonify
from app import db
from utils import *


def create(model, data):
    if isinstance(model(), user_personal_details):
        uid = str(uuid_url64())
        user_check = user_login.query.filter_by(user_id=data['user_id']).first()
        user_details = user_personal_details(id=uid, first_name=data['first_name'], surname=data['surname'])
        db.session.add(user_details)
        user_check.user_personal_details_id = uid
        db.session.commit()
    return jsonify(data)
