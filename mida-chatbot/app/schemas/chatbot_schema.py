from pydantic import BaseModel

# Define the request model for user input
class ChatRequest(BaseModel):
    user_message: str 

# Define the response model for chatbot output
class ChatResponse(BaseModel):
    bot_reply: str
