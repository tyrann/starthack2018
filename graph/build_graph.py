import networkx as nx
from itertools import combinations
import matplotlib.pyplot as plt
from sbb_api import _api_request

cities_score=[('Lausanne',{'score':4}),('Genève',{'score':5}),('Zurich',{'score':13})]

distance='distance'
score='score'

def get_distance(city_pair):
    data=_api_request("connections",city_pair)
    return 12

def build_graph(cities_score):
    cities=[item[0] for item in cities_score]
    G = nx.Graph()
    print("Building graph for " + ', '.join(cities))
    pairs = list(combinations(cities,2))

    G.add_nodes_from(cities_score)
    
    for item in pairs:
        print("Adding edges " + '<->'.join(item))
        G.add_edge(item[0],item[1], gdistance=get_distance(item))
    return G

def draw_graph(G):
    node_lab=nx.get_node_attributes(G,score)
    pos=nx.circular_layout(G)
    nx.draw(G,pos,labels=node_lab)
    labels = nx.get_edge_attributes(G,distance)
    nx.draw_networkx_edge_labels(G,pos,edge_labels=labels)
    plt.show()
        

def main():
    G=build_graph(cities_score)

if __name__ == "__main__":
    main()



