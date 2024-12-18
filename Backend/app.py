import uvicorn
from fastapi import FastAPI
from typing import List
from models import Info, ChatRequest, SummarizeRequest
import repository
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # List of allowed origins
    allow_credentials=True,  # Allow cookies and credentials if needed
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


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


@app.post("/api/openai/continue")
async def continueChat(request: ChatRequest):
    res = repository.continueOpenAI(request.message, request.history)
    return res

@app.post("/api/openai/summarize")
async def summarizeChat(request: SummarizeRequest):
    res = repository.summaryOpenAI(request.history)
    return res