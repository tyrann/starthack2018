#!/usr/bin/env python
from flask import Flask, jsonify, request
import numpy as np
import os
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics.pairwise import cosine_similarity
import pickle
from build_graph import get_path


app = Flask(__name__)

X = None
vectorizer = None
transformer = None
labels = []

def query_augmentation(queries):
    """Take as input a list of key words"""
    aug = queries.copy()
    if 'arts' in queries:
        aug.append('art')
    if 'mountains' in queries:
        aug.append('mountain')
    if 'museum' in queries:
        aug.append('museums')
    return aug

def train_tf_idf():
    global X, vectorizer, transformer, labels
    cities_info = pickle.load(open("cities_description.p", "rb"))
    labels = np.array(list(cities_info.keys()))
    corpus = np.array(list(cities_info.values()))

    vectorizer = CountVectorizer()
    trainVectorizer = vectorizer.fit_transform(corpus)

    transformer = TfidfTransformer()
    transformer.fit(trainVectorizer)

    X = transformer.transform(trainVectorizer)
    print('TF-IDF trained')

def predict(query):
    testVectorizer = vectorizer.transform([query])
    Y = transformer.transform(testVectorizer)
    vals = cosine_similarity(X,Y).flatten()
    np.argsort(vals)
    indexes = np.argsort(vals)[-10:][::-1]
    return zip(labels[indexes], vals[indexes])

@app.route('/', methods=['GET'])
def front_end():
    """Return the front-end app"""
    return app.send_static_file('index.html')

@app.route('/api/v1.0/tours', methods=['GET'])
def get_tours():
    """Return a list of possible tours that the user may want to do in Switzerland based on his query"""
    city_from = request.args.get('city_from')
    city_to = request.args.get('city_to')
    max_travel_time = request.args.get('max_travel_time')
    query = request.args.get('query')
    queries = request.args.getlist('query')
    if queries:
        query = query_augmentation(queries)
        query = ' '.join(queries)
        print(query)
    if (city_from == None) or (city_to == None) or (max_travel_time ==  None) or (query ==  None):
        return jsonify({"error":"401",
            'message': 'Please provide all argument :',
            'args':{
                'city_from': city_from,
                'city_to': city_to,
                'max_travel_time': max_travel_time,
                'query': query
            }}), 401
    max_travel_time = int(max_travel_time[:-1])
    #queries =request.form.getlist('query')
    #print(queries)
    #query_language = request.args.get('max_travel_time') #could be detected

    #Some calls
    pred = predict(query)
    cities_importance = { i:j for (i,j) in pred if j>0}
    if city_from not in cities_importance.keys():
        cities_importance[city_from] = 0

    #Remove city end from the traveling cities
    cities_importance.pop(city_to, None)
    
    #cities_score=[('Lausanne',{'score':14}),('Genève',{'score':5}),('Zurich',{'score':13}),('Lucerne',{'score':19}),('Locarno',{'score':19}),('Montreux',{'score':12})]
    cities_score = [(k, {'score': cities_importance[k]}) for  k in cities_importance.keys()]
    path, score = get_path(cities_score, max_travel_time, source=city_from, destination=city_to)
    res = {
        'cities_importance': cities_importance, #return the importance of each city (No limits)
        'tour': path,
        'score': score
    }
    return jsonify(res)

@app.route('/api/v1.0/tours_test', methods=['GET'])
def get_tours_test():
    """Return a list of possible tours that the user may want to do in Switzerland based on his query

    Return : {
        cities_importance : {city_1:importance, city_2: importance, city_n: importance}
        tour : [city_start, city_2, ..., city_end]
    }
    """
    city_from = request.args.get('city_from')
    city_to = request.args.get('city_to')
    max_travel_time = request.args.get('max_travel_time')
    query = request.args.get('query')
    #query_language = request.args.get('max_travel_time') #could be detected

    #Some calls
    pred = predict(query)

    return str([(i,j) for (i,j) in pred if j>0])

if __name__ == '__main__':
    train_tf_idf()
    app.run(debug=True)
