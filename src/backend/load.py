import os


def load_test_design():
    directory = 'model/' + 'test' + '/design/'
    json_model = open(directory + 'test1' + '.json', 'r')
    loaded_model_json = json_model.read()
    json_model.close()
    return loaded_model_json


def load_test_detail():
    directory = 'model/' + 'test' + '/detail/'
    json_model = open(directory + '4_layers-128_nodes.json', 'r')
    loaded_model_json = json_model.read()
    json_model.close()
    return loaded_model_json


def load_design(user_id, design_name):
    directory = 'model/' + user_id + '/design/'
    json_model = open(directory + design_name + '.json', 'r')
    loaded_model_json = json_model.read()
    json_model.close()
    return loaded_model_json


def load_detail(user_id, detail_name):
    directory = 'model/' + user_id + '/detail/'
    json_model = open(directory + detail_name + '.json', 'r')
    loaded_model_json = json_model.read()
    json_model.close()
    return loaded_model_json


def load_train(user_id, train_name):
    directory = 'model/' + user_id + '/train/'
    json_model = open(directory + train_name + '.json', 'r')
    loaded_model_json = json_model.read()
    json_model.close()
    return loaded_model_json


def load_design_directory(user_id, model_directory):
    model_designs = []
    directory = 'model/' + user_id + '/design/' + model_directory + '/'
    for filename in os.listdir(directory):
        json_model = open(directory + filename, 'r')
        loaded_model_json = json_model.read()
        json_model.close()
        model_designs.append(loaded_model_json)
    return model_designs


def load_detail_directory(user_id, model_directory):
    model_details = []
    directory = 'model/' + user_id + '/detail/' + model_directory + '/'
    for filename in os.listdir(directory):
        json_model_detail = open(directory + filename, 'r')
        loaded_model_details_json = json_model_detail.read()
        json_model_detail.close()
        model_details.append(loaded_model_details_json)
    return model_details


def load_train_directory(user_id, model_directory):
    model_details = []
    directory = 'model/' + user_id + '/train/' + model_directory + '/'
    for filename in os.listdir(directory):
        json_model_detail = open(directory + filename, 'r')
        loaded_model_details_json = json_model_detail.read()
        json_model_detail.close()
        model_details.append(loaded_model_details_json)
    return model_details