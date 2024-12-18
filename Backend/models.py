from pydantic import BaseModel
from typing import List, Union
class Info(BaseModel):
    string: str


class ChatRequest(BaseModel):
    message: str
    history: List[dict]