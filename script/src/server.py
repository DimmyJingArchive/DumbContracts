import json

import requests
from flask import Flask, request
from flask_cors import CORS, cross_origin
from revChatGPT.ChatGPT import Chatbot
from sentence_transformers import SentenceTransformer, util

name_set = set()

with open("settings.json") as f:
    chatbot_login = json.load(f)

chatbot = Chatbot(
    chatbot_login,
    conversation_id=None,
    parent_id=None,
)


def valid_contract(contract_info):
    if contract_info[1]["contractData"] == "M":
        return False
    name = contract_info[1]["contractData"]["ContractName"]
    if not name:
        return False
    elif len(name) > 24:
        return False
    elif name in name_set:
        return False
    name_set.add(name)
    return True


# Data Processing
embedder = SentenceTransformer("all-MiniLM-L6-v2")

data = json.load(open("../data/contracts.json"))
data = dict(filter(valid_contract, data.items()))

corpus = []
addresses = []

for key in data:
    if not data[key]["contractData"] == "M":
        corpus.append(data[key]["contractData"]["SourceCode"])
        addresses.append(key)

# print('data finished loading')
corpus_embeddings = embedder.encode(
    corpus, show_progress_bar=True, convert_to_tensor=True
)


def semantic_search(query):
    query = query

    query_embedding = embedder.encode(query, convert_to_tensor=True)
    print("query embedding done")
    rankings = util.semantic_search(query_embedding, corpus_embeddings, top_k=10)
    print("semantic search done")
    top_results = [x["corpus_id"] for x in rankings[0]]
    top_results = [addresses[x] for x in top_results]
    return top_results


app = Flask(__name__)
app.config["CORS_HEADERS"] = "Content-Type"
cors = CORS(app)
cross_origin_args = {"origin": "*", "headers": ["Content-Type"]}
sorted_data = sorted(
    data.items(), key=lambda x: len(x[1]["transactions"]), reverse=True
)[:20]

# For full information regarding the address (e.g. when you click on a specific contract)
# export type TagContent =
#   | "abandoned"
#   | "access control"
#   | "vulnerable"
#   | "honeypot"
#   | "rugpull"
#   | "scam"
#   | "unverified source code"
#   | "proxy risky"
#   | "risky";

# export interface ContractCardProps {
#   name: string;
#   address: string;
#   license?: string;
#   last_used: string;
#   safety_score: number;
#   transactions: number;
#   tags: TagContent[];
# }
# This returns the detail needed when searched


@app.route("/search")
@cross_origin(**cross_origin_args)
def search():
    search = request.args.get("q")
    contracts = {}
    if search is None or search == "":
        return sorted_data
    else:
        # search results
        # aaron
        x = semantic_search(search)
        for addr in x:
            contracts[addr] = data[addr]
        print(f"length of contrats: {len(contracts)}")
        return list(contracts.items())


risk_cache = {}


@app.route("/get-risk/<string:addr>")
@cross_origin(**cross_origin_args)
def get_risk(addr):
    if addr not in risk_cache or risk_cache[addr]["status"] == "ERROR":
        url = "https://www.avengerdao.org/api/v1/address-security"
        obj = {"chainId": 56, "address": addr}
        risk = requests.post(url, json=obj).json()
        risk["address"] = addr
        risk_cache[addr] = risk
    return risk_cache[addr]


@app.route("/analyze", methods=["POST"])
@cross_origin(**cross_origin_args)
def analyze():
    data = (
        "For the following solidity program, can you first tell me the reasons why the contract is vulnerable, and then tell me on a scale from 1 to 10, how safe it is to use?\n\n"
        + json.loads(request.data)["source_code"]
    )
    response = chatbot.ask(data, conversation_id=None, parent_id=None)
    if response is None:
        return {"message": "error occured while accessing gpt-3"}
    return {"message": response["message"]}


app.run(debug=False, threaded=True, host="0.0.0.0", port=5010)
