from pydantic import BaseModel
from typing import List, Union,Dict, Any
class Info(BaseModel):
    string: str


class ChatRequest(BaseModel):
    message: str
    history: List[dict]

class SummarizeRequest(BaseModel):
    history: List[Dict[str, Any]] 