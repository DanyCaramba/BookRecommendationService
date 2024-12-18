from milvus_model.dense import JinaEmbeddingFunction
from pymilvus import connections, Collection, MilvusException,utility,AnnSearchRequest,WeightedRanker
import ast
import json
import re
import os
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()  
jina_api_key = "xxxxx"
openAikey=""
client = OpenAI()
MODEL="gpt-4o-mini"
client.api_key = os.getenv("OPENAI_API_KEY")


def initializeJina():
    
    global ef
    ef = JinaEmbeddingFunction(
        "jina-embeddings-v3", 
        jina_api_key,
        task="text-matching",
        dimensions=1024
    )
    print("......init JINA")


def connect():
    connections.connect(host="172.25.161.17", port="19530")
    try:
        print("Connecting to Vector database ..........")
        # List all collections
        collections = utility.list_collections()
        print(f"List all collections from Vector:\n", collections)
    except MilvusException as e:
        print(e)


def createSingleEmbedd(text):
    print("########single embede")
    embeddings=ef(text)
    print(embeddings[0])
    return embeddings

def startOpenAI():
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", 
             "content": "Jesteś pomocnym asystentem. Twoim zadaniem jest zadawanie użytkownikowi pytań dotyczących jego preferencji książkowych i dostosowywanie każdego pytania na podstawie jego poprzednich odpowiedzi. Śledź ich odpowiedzi, aby zebrać wystarczającą ilość informacji do przedstawienia rekomendacji książkowych."},
            {"role": "assistant", 
             "content": "W oparciu o poprzednie odpowiedzi użytkownika, zadaj kolejne najbardziej odpowiednie pytanie dotyczące jego preferencji książkowych. Dostosuj pytanie do tego, co już udostępnił."}
        ]
    )
    return response.choices[0].message



def returnRecommendation(prompt):
    print("!!!!Wchodze do multisearxh")
    embedPrompt=prompt
    print(embedPrompt)
    search_param_1 = {
    "data": embedPrompt, # Query vector
    "anns_field": "vectorCategory", # Vector field name
    "param": {
        "metric_type": "COSINE", # This parameter value must be identical to the one used in the collection schema
        "params": {"nprobe": 10}
    },
    "limit": 9 # Number of search results to return in this AnnSearchRequest
    }
    search_param_2 = {
    "data": embedPrompt, # Query vector
    "anns_field": "vectorTags", # Vector field name
    "param": {
        "metric_type": "COSINE", # This parameter value must be identical to the one used in the collection schema
        "params": {"nprobe": 10}
    },
    "limit": 9 # Number of search results to return in this AnnSearchRequest
    }
    search_param_3 = {
    "data": embedPrompt, # Query vector
    "anns_field": "vectorDescription", # Vector field name
    "param": {
        "metric_type": "COSINE", # This parameter value must be identical to the one used in the collection schema
        "params": {"nprobe": 10}
    },
    "limit": 9 # Number of search results to return in this AnnSearchRequest
    }

    request_1 = AnnSearchRequest(**search_param_1)
    request_2 = AnnSearchRequest(**search_param_2)
    request_3 = AnnSearchRequest(**search_param_3)
    reqs = [request_1, request_2,request_3]
    rerank = WeightedRanker(0.25, 0.25,0.5) # wagi dla multi search
    collection = Collection("Books")
    res = collection.hybrid_search(
    reqs, # List of AnnSearchRequests created in step 1
    rerank, # Reranking strategy specified in step 2
    limit=9 # Number of final search results to return
    )
    #print(res)
    data=[]
    for r in res[0]:
        data.append(getDataById(int(r.id)))
    
    cleaned_data = []

    for item in data:
        # Usuwamy 'data: ["' i '"]' z każdego elementu
        str_item = str(item)
    # Usuwamy 'data: ["' i '"]' z każdego elementu
        cleaned_item = str_item.replace('data: ["', '').replace('"]', '')
        cleaned_data.append(cleaned_item)

    json_data = json.dumps(data, default=str, ensure_ascii=False, indent=4)

    return json_data


def getDataById(id:int):
    collection=Collection("Books")
    results= collection.query(
        expr=f'id == {id}',
        output_fields=["title","author","publisher","category","pages","tags","description","cover"]
    )
    return results