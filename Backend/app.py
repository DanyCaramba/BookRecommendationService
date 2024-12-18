import uvicorn
from fastapi import FastAPI
from typing import List
from models import Info
import repository

app = FastAPI()


def init():
    repository.initializeJina()
    repository.connect()
init()

@app.post("/recommendation/")
async def get_recommendation(info: Info):
    print(info.string)
    vector=repository.createSingleEmbedd(info.string)
    recommendation=repository.returnRecommendation(vector)
    print(recommendation)

    return {"data":recommendation}

@app.post("/api/openai/start")
async def startChat():
    res = repository.startOpenAI()

    return res