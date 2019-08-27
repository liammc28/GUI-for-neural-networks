from app import app
from flask import request, send_from_directory, make_response
from flask_restful import Resource, Api
from flask_cors import CORS
from load import *
from crud import *
from app import db
api = Api(app)

app.config.from_pyfile('setup.py')
CORS(app)


class User(Resource):
    def post(self):
        request_body = request.get_json()
        user_check = user_login.query.filter_by(user_email=request_body['email']).first()
        if user_check is not None:
            if user_check.user_email is not None:
                return jsonify({'success': False,
                                'emailDuplicate': True})
        else:
            if request_body['email'] == 'test@mail.dcu.ie':
                user_id = '123'
            else:
                user_id = str(uuid_url64())
            user = user_login(user_id=user_id, password=user_login.generate_hash(request_body['password']),
                              user_email=request_body['email'], verified=False)
            send_verification_email(request_body['email'], user_id)
            db.session.add(user)
            db.session.commit()
            writeToJOSNFile('./model/averages/' + user_id, 'average', create_averages())
            response = jsonify({'success': True})
            return response

    def put(self):
        request_body = request.get_json()
        password = request_body['password']
        user_check = user_login.query.filter_by(user_id=request_body['user_id']).first()
        if user_check is not None:
            if user_login.verify_hash(password, user_check.password):
                user_check.verified = True
                db.session.commit()
                return jsonify({'successfulVerification': user_check.verified})
        return jsonify({'successfulVerification': False})


class Session(Resource):
    def post(self):
        data = request.get_json()
        email = data['email']
        password = data['password']

        user = user_login.query.filter_by(user_email=email).first()
        if user is not None:
            if user.verified is False:
                response = jsonify({
                    'email': email,
                    'verified': False,
                    'incorrectPassowrd': False
                })
            else:
                if user_login.verify_hash(password, user.password):
                    response = jsonify({
                        'user_id': user.user_id,
                        'success': True,
                        'first_name': user.user_personal_details.first_name
                    })
                else:
                    response = jsonify({
                        'email': email,
                        'incorrectPassword': True,
                        'verified': True
                    })
        else:
            response = jsonify({
                'UnrecognisedEmail': True
            })

        return response


class Train(Resource):
    def post(self):
        request_dict = request.files
        model_id = request.headers['model_id']
        user_id = request.headers['user_id']
        training = training_details.query.filter_by(model_id=model_id).first()
        topology = request_dict['model.json']
        path = './static/' + user_id + '/'+training.training_name + '/'
        if os.path.exists(path) is False:
            os.makedirs(path)
        with open(path + "model.json", 'w') as fp:
            fp.write(topology.read())

        weights = request_dict['model.weights.bin']
        with open(path + 'model.weights.bin', 'w') as fw:
            fw.write(weights.read())

        resp = make_response()
        resp.headers['did_it_work'] = 'yes'
        return resp


class Training(Resource):
    def get(self, user_id, model_name, filename):
        return send_from_directory('static/'+user_id+'/'+model_name+'/', filename)


class Details(Resource):
    def post(self):
        data = request.get_json()
        response = create(user_personal_details, data)
        return response


class Analyse(Resource):
    def get(self):
        model_directory = request.args.get('model_directory')
        user_id = request.args.get('user_id')
        details = load_detail_directory(user_id, model_directory)
        return details


class ModelInfo(Resource):
    def post(self):
        data = request.get_json()
        stage = data['stage']
        user_id = data['user_id']
        model_name = data['model_name']
        if stage == 'design':
            layers = data['layers']
            dataset = data['dataset']
            design_detail={
                "layers":layers,
                "dataset": dataset
            }
            user = user_login.query.filter_by(user_id=user_id).first()
            if user.user_models_id is None:
                user_models_id = str(uuid_url64())
            else:
                user_models_id = user.user_models_id
            model_id = str(uuid_url64())
            filepath = writeToJOSNFile('./model/design/' + user_id, model_name, design_detail)
            model_detail = model_details(model_id=model_id, model_name=model_name, details_address=filepath, dataset=dataset)
            db.session.add(model_detail)
            user_model = user_models(user_models_id=user_models_id, model_id=model_id)
            db.session.add(user_model)
            user.user_models_id = user_models_id
            db.session.commit()
            add_design('./model/averages/' + user_id + '/average.json')
            return True
        elif stage == 'training':

            training_details_id = str(uuid_url64())
            training = training_details(model_id=training_details_id)
            db.session.add(training)
            user = user_login.query.filter_by(user_id=user_id).first()
            models = user_models.query.filter_by(user_models_id=user.user_models_id)
            count = 0
            for model in models:
                x = model_details.query.filter_by(model_id=model.model_id).first()
                if model_name == x.model_name:
                    if x.training_id is None:
                        training_id = str(uuid_url64())
                        count = 1
                        model_trained = model_training(training_id=training_id, training_details_id=training_details_id)
                        db.session.add(model_trained)
                        x.training_id = training_id
                    else:
                        model_training.query.filter_by(training_id=x.training_id)
                        count = (model_training.query.filter_by(training_id=x.training_id)).count()+1
                        model_trained = model_training(training_id=x.training_id, training_details_id=training_details_id)
                        db.session.add(model_trained)
            training_name = model_name + '_' + str(count)
            trainingJSON = create_training_json(data, training_name)
            filepath = writeToJOSNFile('./model/train/' + user_id, training_name, trainingJSON)
            training = training_details.query.filter_by(model_id=training_details_id).first()
            training.training_details_address = filepath
            training.training_name = training_name
            db.session.commit()
            add_training('./model/averages/' + user_id + '/average.json', data['testAccuracy'])
            return jsonify({'model_id': training_details_id})

    def get(self):
        if request.args.get('model_name') is None:
            stage = request.args.get('stage')
            user_id = request.args.get('user_id')
            model_names = get_model_names(user_id=user_id, stage=stage)
            return jsonify({'model_names': model_names})
        else:
            user_id = request.args.get('user_id')
            model_name = request.args.get('model_name')
            user = user_login.query.filter_by(user_id=user_id).first()
            models = user_models.query.filter_by(user_models_id=user.user_models_id)
            for model in models:
                x = model_details.query.filter_by(model_id=model.model_id).first()
                if model_name == x.model_name:
                    filepath = x.details_address
                    return jsonify({'design': readFromJSON(filepath)})


class ModelTraining(Resource):
    def get(self):
        response = []
        user_id = request.args.get('user_id')
        model_name = request.args.get('model_name')
        user = user_login.query.filter_by(user_id=user_id).first()
        models = user_models.query.filter_by(user_models_id=user.user_models_id)
        for model in models:
            x = model_details.query.filter_by(model_id=model.model_id).first()
            if model_name == x.model_name:
                trained_models = model_training.query.filter_by(training_id=x.training_id)
                for trained_model in trained_models:
                    x = training_details.query.filter_by(model_id=trained_model.training_details_id).first()
                    filepath = x.training_details_address
                    response.append(readFromJSON(filepath))
        if len(response) == 0:
            return jsonify({'trainingInfo': False})
        return jsonify({'trainingInfo': response})


class Averages(Resource):
    def get(self):
        user_id = request.args.get('user_id')
        averages = get_averages('./model/averages/' + user_id + '/average.json')
        return jsonify({'averages': averages})


api.add_resource(Session, '/session')
api.add_resource(User, '/user')
api.add_resource(Details, '/details')
api.add_resource(Train, '/train')
api.add_resource(Training, '/training/<user_id>/<model_name>/<filename>')
api.add_resource(Analyse, '/analyse')
api.add_resource(ModelInfo, '/modelInfo')
api.add_resource(ModelTraining, '/modelTraining')
api.add_resource(Averages, '/averages')
