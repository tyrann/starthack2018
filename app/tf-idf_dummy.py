# IMPORTS
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.metrics.pairwise import cosine_similarity

# SMALL DUMMY DATA
labels = np.array(['Lausanne', 'Bern', 'Montreux', 'Zurich','Fribourg'])
corpus = [
    'Lausanne is a great city for arts and more',
    'Bern is quite nice for history and arts',
    'If you like music, you should go to Montreux',
    'This location is good for arts',
    'Fribourg is  a great city'
    ]
query = ['I love arts']

# TF-IDF
vectorizer = CountVectorizer()
transformer = TfidfTransformer()

trainVectorizer = vectorizer.fit_transform(corpus)
testVectorizer = vectorizer.transform(query)

transformer.fit(trainVectorizer)
X = transformer.transform(trainVectorizer)

transformer.fit(testVectorizer)
Y = transformer.transform(testVectorizer)

similarities = cosine_similarity(X,Y).flatten()
# Top 3 cities
indexes = np.argsort(similarities)[-3:][::-1]
output = zip(labels[indexes],{'score': similarities[indexes]})
