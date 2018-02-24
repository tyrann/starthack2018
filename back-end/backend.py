#!/usr/bin/env python
from flask import Flask, jsonify, request
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics.pairwise import cosine_similarity
import pickle

app = Flask(__name__)

X = None
vectorizer = None
transformer = None
labels = []

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

@app.route('/api/v1.0/tours', methods=['GET'])
def get_tours():
    """Return a list of possible tours that the user may want to do in Switzerland based on his query"""
    city_from = request.args.get('city_from')
    city_to = request.args.get('city_to')
    max_travel_time = request.args.get('max_travel_time')
    query = request.args.get('query')
    #query_language = request.args.get('max_travel_time') #could be detected
    
    #Some calls
    pred = predict(query)
    
    return str([(i,j) for (i,j) in pred if j>0])

@app.route('/api/v1.0/tours_test', methods=['GET'])
def get_tours_test():
    """Return a list of possible tours that the user may want to do in Switzerland based on his query
    
    Return : {
        selected_cities : {city_1:importance, city_2: importance, city_n: importance}
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