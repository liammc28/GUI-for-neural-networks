import re
import uuid
import json
import base64
from app import app
from app import db
from flask_mail import Mail, Message
from models import *
import os

mail = Mail(app)


def uuid_url64():
    rv = base64.b64encode(uuid.uuid4().bytes).decode('utf-8')
    return re.sub(r'[\=\+\/]', lambda m: {'+': '-', '/': '_', '=': ''}[m.group(0)], rv)


def send_verification_email(email,user_id):
    msg = Message('Verify', sender='mcaweeneyl@gmail.com', recipients=[email])
    msg.body = 'Thanks for registering with GUI for Neural Networks, ' \
               'To confirm you email plese follow the link provide: http://localhost:3000/verify/' + user_id
    mail.send(msg)
    return True


def get_model_names(user_id,stage):
    user = user_login.query.filter_by(user_id=user_id).first()
    if user.user_models_id is None:
        return []
    models = user_models.query.filter_by(user_models_id=user.user_models_id)
    model_ids = [model.model_id for model in models]
    model_names = []
    if stage == 'trained':
        for model_id in model_ids:
            if model_details.query.filter_by(model_id=model_id).first().training_id:
                model_names.append(model_details.query.filter_by(model_id=model_id).first().model_name)
    else:
        model_names = [model_details.query.filter_by(model_id=model_id).first().model_name for model_id in model_ids]
    return model_names


def writeToJOSNFile(path, filename, data):
    if os.path.exists(path) is False:
        os.makedirs(path)
    filePath = path + '/' + filename + '.json'
    with open(filePath, 'w') as fp:
        json.dump(data, fp)
    return filePath


def readFromJSON(filename):
    with open(filename, 'r') as f:
        return json.load(f)


def create_training_json(data,training_name):
    return {'epochAccuracy': data['epochAccuracy'], 'epochLoss': data['epochLoss'],
                            'trainingTime': data['trainingTime'], 'testAccuracy': data['testAccuracy'],
                            'sizeOfTrainingInputs': data['sizeOfTrainingInputs'],
                            'validationSplit': data['validationSplit'],
                            'batchSize': data['batchSize'], 'trainEpochs': data['trainEpochs'],
                            'training_name':training_name}


def delete_user(use_id):
    user_login.query.filter_by(user_id=use_id).delete()
    db.session.commit()


def create_averages():
    data = {
        'numOfDesigns': 0,
        'numOfTrain': 0,
        'bestModel': {},
        'mostParameters': {},
        'leastParameters': {},
        "allAccuracies": [],
        'averageAccuracy': 0,
        'allAveragesAccuracies':[],
        'bestAccuracy': 0
    }
    return data


def get_averages(filename):
    data = readFromJSON(filename)
    return data


def add_design(filename):
    data = readFromJSON(filename)
    data['numOfDesigns'] += 1
    writeToJOSNFile(filename[:-12], 'average', data)
    return True


def add_training(filename,accuracy):
    data = readFromJSON(filename)
    x = "%.2f" % accuracy
    if data['allAccuracies'] == None:
        data['allAccuracies']=[]

    if data['allAveragesAccuracies'] == None:
        data['allAveragesAccuracies'] = []

    data['allAccuracies'].append(x)
    data['bestAccuracy'] = max(data['allAccuracies'])


    print data
    print data["allAccuracies"]
    averageAccuracy = data['averageAccuracy']
    averageAccuracy *= data['numOfTrain']
    data['numOfTrain'] += 1
    averageAccuracy += accuracy
    data['averageAccuracy'] = averageAccuracy / data['numOfTrain']
    data['allAveragesAccuracies'].append(data['averageAccuracy'])
    writeToJOSNFile(filename[:-12], 'average', data)
    return True
