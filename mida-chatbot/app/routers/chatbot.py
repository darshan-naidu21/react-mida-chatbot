from fastapi import APIRouter
from app.schemas.chatbot_schema import ChatRequest, ChatResponse
from app.services.chatbot_service import get_chat_response

# Create the router
router = APIRouter()
    
@router.post("/get_response", response_model=ChatResponse)
async def get_response(request: ChatRequest):
    try:
        response = await get_chat_response(request.user_message)
        return ChatResponse(bot_reply=response)
    except Exception as e:
        return ChatResponse(bot_reply="Response failed")
