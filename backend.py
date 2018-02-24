#!/usr/bin/env python
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello, World!"

tasks = {'routes': 'hello'}

@app.route('/api/v1.0/tours', methods=['GET'])
def get_tours():
    """Return a list of possible tours that the user may want to do in Switzerland based on his query"""
    city_from = request.args.get('city_from')
    city_to = request.args.get('city_to')
    max_travel_time = request.args.get('max_travel_time')
    query = request.args.get('max_travel_time')
    #query_language = request.args.get('max_travel_time') #could be detected

    #Some calls

    return jsonify(city_to)

@app.route('/api/v1.0/tours', methods=['POST'])
def post_tasks():
    return jsonify({'tasks_post': tasks})


if __name__ == '__main__':
    app.run(debug=True)