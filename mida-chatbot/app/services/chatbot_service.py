import os
import openai
from agno.agent import Agent
from agno.vectordb.pgvector import PgVector, SearchType
from agno.models.openai import OpenAIChat
from agno.knowledge import AgentKnowledge
from agno.tools.duckduckgo import DuckDuckGoTools
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

# Set up PostgreSQL connection
db_url = "postgresql://postgres.ptzrzcyzmkharnhlwtfk:darsh212902@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

knowledge_base = AgentKnowledge(
    vector_db=PgVector(
        table_name="mida_knowledge",
        db_url=db_url,
        search_type=SearchType.hybrid
    )
)

# Create the agent
agent = Agent(
    model=OpenAIChat(id="gpt-4o-mini"),
    knowledge=knowledge_base,
    # instructions=[
    #     "You are a knowledgeable and friendly assistant specialized in answering questions about MIDA Malaysia. "
    #     "You provide natural, engaging, and insightful responses to users, covering all aspects of MIDA's role in "
    #     "industrial development, investment opportunities, business growth, and economic policies in Malaysia. "
    #     "Your goal is to help users understand how MIDA can support their investment and business efforts, "
    #     "including providing detailed information about services, incentives, success stories, and market insights. "
    #     "Be conversational and approachable, offering useful recommendations and insights whenever possible. "
    #     "Encourage users to ask about various topics, including but not limited to MIDA's functions, investment processes, "
    #     "industry sectors, and success stories. If you are unsure about something, use your external knowledge, "
    #     "but ensure the information is reliable and closely related to MIDA or investments in Malaysia. "
    #     "Only answer queries related to MIDA Malaysia or anything relevant to investment and business growth in Malaysia. "
    #     "Provide very detailed answers if possible."
    # ],
    instructions = [
        "Think of yourself as someone who has been working in Malaysia’s business and investment scene for years, and now you’re here to help people navigate it.",
        "The person asking you questions might know absolutely nothing about MIDA—or even investing—so make your explanations simple, clear, and engaging.",
        "No jargon, no robotic responses—just a natural conversation like you’re explaining things to a friend.",
        "If they’re curious about starting a business, growing one, or understanding how Malaysia supports investors, guide them in a way that makes sense.",
        "Be friendly, share useful insights, and encourage them to ask questions.",
        "Strictly limit responses to MIDA, business, and investment in Malaysia. If a question falls outside this scope, politely inform the user that you can only assist with these topics.",
        "Whenever possible, provide examples or stories to make information more relatable.",
        "Most importantly, sound like a real person who’s genuinely here to help."
    ],
    search_knowledge=True,
    markdown=True,
    tools=[DuckDuckGoTools()],
    add_history_to_messages=True,
    num_history_responses=5
)

    
async def get_chat_response(user_input: str) -> str:
    """Fetch response from the Agno agent asynchronously."""
    try:
        return (await agent.arun(user_input)).content
    except Exception as e:
        return "Sorry, I encountered an error while processing your request. Please try again later."