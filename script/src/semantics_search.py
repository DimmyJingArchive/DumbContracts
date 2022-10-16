from sentence_transformers import SentenceTransformer, util
import json

embedder = SentenceTransformer('all-MiniLM-L6-v2')

data = json.load(open('../data/contracts.json'))

corpus = []
addresses = []

for key in data:
    corpus.append(data[key]["sourceCode"])
    addresses.append(key)

corpus_embeddings = embedder.encode(corpus, convert_to_tensor=True)

def semantic_search(query):
    query = query

    query_embedding = embedder.encode(query, convert_to_tensor=True)

    rankings = util.semantic_search(query_embedding, corpus_embeddings, top_k=20)
    top_results = [x['corpus_id'] for x in rankings[0]]
    return top_results