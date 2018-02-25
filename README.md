# Swiss-smart-travel

Swiss-smart-travel is a project developed in 36h during the [StartHack](http://starthack.ch/) hackaton in 2018.

The idea behind this project was to solve the issue of multi-destination travel, mostly for people that travel to discover Switzerland.
We created an API that takes as input a text query, a duration (1 day - 2 weeks) and start & end locations. 
As output, the API gives a list of the 10 most interesting cities regarding the text query, and a proposed tour in a subset of those cities.

We also built a front-end demo of the API usage with an interactive user interface, available at [http://swiss-smart-travel.herokuapp.com/](http://swiss-smart-travel.herokuapp.com/).

## Screenshots
![Screen1](https://i.imgur.com/VbZag2V.jpg)
![Screen2](https://i.imgur.com/84y1ziJ.jpg)

## Under the hood
We selected around 50 most visited cities, then extracted the wikipedia description, and built a sort of information retrieval system based on TF-IDF and cosine similarity. After extracting the 10 most relevant cities, we construct a graph in which the edges are weighted by the average time to travel from a node to the other. We then construct a tour based on a heuristic taking into account both the score (closeness to the query) and the centrality of each node (to avoid going too far).

## How to install
Install python and the requirements in `requirements.txt`. Then start the server from the root folder with `app/backend.py`. This will start a local server at `0.0.0.0:5000`.

## Routes
The front-end is available at `0.0.0.0:5000/index.html`
The API can be called with a GET request at `0.0.0.0:5000/api/v1.0/tours`

## What made it possible
Lots of babyfoot, coffee and [Gripen](https://www.farmy.ch/en/gripen-shot) <3
