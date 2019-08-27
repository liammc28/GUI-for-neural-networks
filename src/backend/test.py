from app import app
from flask import json
import unittest
import load as load
from crud import create
from utils import *
from app import db
import collections
from models import *


class LoginTest(unittest.TestCase):
    def test_successful_login(self):
        with app.app_context():
            tester = app.test_client(self)
            request = tester.post('/session', data=json.dumps(
                {
                    'email': 'liam.mcaweeney2@mail.dcu.ie',
                    'password': 'p'
                }), content_type='application/json')
            response_json = json.loads(request.data)
            self.assertEqual(request.status_code, 200)
            self.assertTrue(response_json['success'])

    def test_incorrect_password(self):
        with app.app_context():
            tester = app.test_client(self)
            request = tester.post('/session', data=json.dumps(
                {
                    'email': 'liam.mcaweeney2@mail.dcu.ie',
                    'password': 'password'
                }), content_type='application/json')
            response_json = json.loads(request.data)
            self.assertEqual(request.status_code, 200)
            self.assertTrue(response_json['incorrectPassword'])

    def test_unrecognised_email(self):
        with app.app_context():
            tester = app.test_client(self)
            request = tester.post('/session', data=json.dumps(
                {
                    'email': 'zzzz@mail.dcu.ie',
                    'password': 'password'
                }), content_type='application/json')
            response_json = json.loads(request.data)
            self.assertEqual(request.status_code, 200)
            self.assertTrue(response_json['UnrecognisedEmail'])

    def test_unverified_email(self):
        with app.app_context():
            tester = app.test_client(self)
            request = tester.post('/session', data=json.dumps(
                {
                    'email': 'unverified@mail.dcu.ie',
                    'password': 'password'
                }), content_type='application/json')
            response_json = json.loads(request.data)
            self.assertEqual(request.status_code, 200)
            self.assertFalse(response_json['verified'])


class UtilsTest(unittest.TestCase):
    def test_create_avergaes(self):
        data = create_averages()
        self.assertEquals(data, {
                                'numOfDesigns': 0,
                                'numOfTrain': 0,
                                'bestModel': {},
                                'mostParameters': {},
                                'leastParameters': {},
                                'averageAccuracy': 0
                                }
                          )

    def test_get_model_names(self):
        model_names = get_model_names('test')
        test_names = ['testmodel1', 'testmodel2']
        self.assertEqual(model_names, test_names)

    def test_unique_ids(self):
        id_list = []
        num_of_ids = 1000
        for i in range(0, num_of_ids):
            id_list.append(uuid_url64())
        duplicates = [item for item, count in collections.Counter(id_list).items() if count > 1]
        self.assertEqual([], duplicates)

    def test_writing_to_json(self):
        path = './test'
        file_name = 'average'
        data = create_averages()
        self.assertEqual(writeToJOSNFile(path, file_name, data), path + '/' + file_name + '.json')

    def test_read_from_json(self):
        file_path = './test/test_json.json'
        file_json = readFromJSON(file_path)
        self.assertEqual(file_json, {
                                'numOfDesigns': 0,
                                'numOfTrain': 0,
                                'bestModel': {},
                                'mostParameters': {},
                                'leastParameters': {},
                                'averageAccuracy': 0
                                })

    def test_adding_design_to_averages(self):
        file_path = './test/average.json'
        data = readFromJSON(file_path)
        num_of_designs = data['numOfDesigns']
        add_design(file_path)
        data = readFromJSON(file_path)
        self.assertEqual(num_of_designs+1, data['numOfDesigns'])


class SignupTest(unittest.TestCase):
    def test_signup_email_already_used(self):
        with app.app_context():
            tester = app.test_client(self)
            request = tester.post('/user', data=json.dumps(
                {
                    'email': 'liam.mcaweeney2@mail.dcu.ie',
                    'password': 'p'
                }), content_type='application/json')
            response_json = json.loads(request.data)
            self.assertEqual(request.status_code, 200)
            self.assertTrue(response_json['emailDuplicate'])
            self.assertFalse(response_json['success'])

    def test_signup_success(self):
        with app.app_context():
            tester = app.test_client(self)
            request = tester.post('/user', data=json.dumps(
                {
                    'email': 'test@mail.dcu.ie',
                    'password': 'p'
                }), content_type='application/json')
            response_json = json.loads(request.data)
            self.assertEqual(request.status_code, 200)
            self.assertTrue(response_json['success'])

    def test_delete_user(self):
        user_check = user_login.query.filter_by(user_id='123').first()
        self.assertNotEqual(user_check, None)
        delete_user('123')
        user_check = user_login.query.filter_by(user_id='123').first()
        self.assertEqual(user_check, None)

    def test_verify_signup(self):
        with app.app_context():
            tester = app.test_client(self)
            request = tester.put('/user', data=json.dumps(
                {
                    'user_id': 'EKiOTfJASnKUPlpQ4fYBig',
                    'password': 'p'
                }), content_type='application/json')
            response_json = json.loads(request.data)
            self.assertEqual(request.status_code, 200)
            self.assertTrue(response_json['successfulVerification'])

    def test_verify_signup_invalid_id(self):
        with app.app_context():
            tester = app.test_client(self)
            request = tester.put('/user', data=json.dumps(
                {
                    'user_id': 'bad_id',
                    'password': 'p'
                }), content_type='application/json')
            response_json = json.loads(request.data)
            self.assertEqual(request.status_code, 200)
            self.assertFalse(response_json['successfulVerification'])


if __name__ == '__main__':
    unittest.main()
