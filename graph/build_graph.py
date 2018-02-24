import networkx as nx
from itertools import combinations
import matplotlib.pyplot as plt
from sbb_api import _api_request_from_to
import pickle

cities_score=[('Lausanne',{'score':4}),('Genève',{'score':5}),('Zurich',{'score':13}),('Lucerne',{'score':19})]

distance='distance'
score='score'

distance_dic = {}

def get_distance(city_pair):
    if(city_pair in distance_dic):
        return distance_dic[city_pair]
    distance =_api_request_from_to(city_pair[0],city_pair[1])
    split_dist = distance.split('d')
    split_time = split_dist[1].split(':')
    distance_time = int(split_dist[0])*86400  #seconds per day
    distance_time += int(split_time[0])*3600 + int(split_time[1])*60 + int(split_time[2])
    distance_dic[city_pair] = distance_time
    return distance_time

def build_graph(cities_score):
    cities=[item[0] for item in cities_score]
    G = nx.Graph()
    print("Building graph for " + ', '.join(cities))
    pairs = list(combinations(cities,2))

    G.add_nodes_from(cities_score)
    
    for item in pairs:
        print("Adding edges " + '<->'.join(item))
        G.add_edge(item[0],item[1], distance=get_distance(item))
    return G

def draw_graph(G):
    node_lab=nx.get_node_attributes(G,score)
    pos=nx.circular_layout(G)
    nx.draw(G,pos,labels=node_lab)
    labels = nx.get_edge_attributes(G,distance)
    nx.draw_networkx_edge_labels(G,pos,edge_labels=labels)
    plt.show()

def save_obj(obj, name):
    with open('obj/'+ name + '.pkl', 'wb') as f:
        pickle.dump(obj, f, pickle.HIGHEST_PROTOCOL)

def load_obj(name ):
    with open('obj/' + name + '.pkl', 'rb') as f:
        return pickle.load(f)

def main():
    #Load the dic for distances
    global distance_dic
    distance_dic = load_obj("distance_map")
    #Build the distance graph
    G=build_graph(cities_score)
    save_obj(distance_dic,"distance_map")

    #Run nearest neighbors


if __name__ == "__main__":
    main()



