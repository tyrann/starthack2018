import networkx as nx
from itertools import combinations
import matplotlib.pyplot as plt
from sbb_api import _api_request_from_to
import pickle
import copy

#cities_score=[('Lausanne',{'score':14}),('Genève',{'score':5}),('Zurich',{'score':13}),('Lucerne',{'score':19}),('Locarno',{'score':19}),('Montreux',{'score':12})]



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
    node_lab = nx.get_node_attributes(G,score)
    pos = nx.circular_layout(G)
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

def get_closest_city(cities_dict, visited):
    for city in cities_dict:
        if city[0] not in visited:
            visited.append(city[0])
            return city

def nearest_neighbors(source,G):
    #returns nearest neighbors approximation and total duration of such path
sum_duration = 0
    run = True
    visited = []
    visited.append(source)

    #Run nearest neighbors
    while(run):

        source_node = get_closest_city(sorted(G[source].items(), key=lambda x: x[1]['distance']), visited)
        if(source_node != None):
            sum_duration += source_node[1]['distance']
        else:
            run = False
    return (visited, sum_duration)

def update_score_with_closeness(G, cities_score):
    for item in G.nodes(data=True):
        city = cities_score[cities_score.index(item)]
        closeness = nx.closeness_centrality(G,item[0],distance=distance)
        item[1]['score'] *= closeness
        city[1]['score'] *= closeness
         
    pass



def get_path(cities_score, threshold, source, destination):
    #Load the dic for distances
    global distance_dic
    cities_score_normal = copy.deepcopy(cities_score)
    cities=[item[0] for item in cities_score]
    distance_dic = load_obj("distance_map")
    #Build the distance graph
    G = build_graph(cities_score)
    save_obj(distance_dic,"distance_map")
    
    run = True
    #force first iteration of algo
    threshold = 3*3600*threshold
    duration = threshold + 1
    
    #We cannot remove the source from the list of visiting node
    whitelist = []
    whitelist.append(source)
    #whitelist.append(destination)

    while(duration > threshold):
        #try and remove the least interesting city from the graph
        (visited, dur) = nearest_neighbors(source,G)
        duration = dur

        if(duration <= threshold):
            break

        print("duration is " + str(duration))

        #modify the graph by removing the city with the lowest score
        update_score_with_closeness(G,cities_score)
        sorted_cities = (sorted(cities_score, key=lambda x: x[1]['score']))
        for item in sorted_cities:
            if item[0] not in whitelist:
                print("Removing city " + item[0] + " from graph")
                cities_score.remove(item)
                G.remove_node(item[0])
                break
    total_score = sum(city[1]['score'] for city in cities_score_normal if city[0] in visited)
        
    visited.append(destination)
    print("Path is " + str(visited) + " with a score of " + str(total_score))

    return (visited,score)
