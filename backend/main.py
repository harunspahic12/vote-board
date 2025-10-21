from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import psycopg
from psycopg.rows import dict_row
import os
from dotenv import load_dotenv
from contextlib import contextmanager

load_dotenv()

app = FastAPI()

# CORS configuration
# Allow frontend from localhost and production (Vercel)
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# Add production frontend URL from environment if available
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if not os.getenv("RAILWAY_ENVIRONMENT") else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/voteboard")

@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = psycopg.connect(DATABASE_URL, row_factory=dict_row)
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

# Pydantic models
class IdeaCreate(BaseModel):
    title: str
    description: Optional[str] = None

class IdeaResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    votes: int
    created_at: str

# Routes
@app.get("/")
def read_root():
    return {"message": "Vote Board API"}

@app.get("/api/ideas", response_model=List[IdeaResponse])
def get_ideas(search: Optional[str] = None):
    """Get all ideas, optionally filtered by search term"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                if search:
                    query = """
                        SELECT id, title, description, votes, 
                               created_at::text as created_at
                        FROM ideas 
                        WHERE title ILIKE %s OR description ILIKE %s
                        ORDER BY votes DESC, created_at DESC
                    """
                    search_pattern = f"%{search}%"
                    cur.execute(query, (search_pattern, search_pattern))
                else:
                    query = """
                        SELECT id, title, description, votes, 
                               created_at::text as created_at
                        FROM ideas 
                        ORDER BY votes DESC, created_at DESC
                    """
                    cur.execute(query)
                
                ideas = cur.fetchall()
                return ideas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/ideas", response_model=IdeaResponse)
def create_idea(idea: IdeaCreate):
    """Create a new idea"""
    if not idea.title or not idea.title.strip():
        raise HTTPException(status_code=400, detail="Title is required")
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO ideas (title, description, votes) 
                    VALUES (%s, %s, 0) 
                    RETURNING id, title, description, votes, created_at::text as created_at
                    """,
                    (idea.title.strip(), idea.description.strip() if idea.description else None)
                )
                new_idea = cur.fetchone()
                return new_idea
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/ideas/{idea_id}/vote")
def vote_idea(idea_id: int):
    """Upvote an idea"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Check if idea exists
                cur.execute("SELECT id FROM ideas WHERE id = %s", (idea_id,))
                if not cur.fetchone():
                    raise HTTPException(status_code=404, detail="Idea not found")
                
                # Increment vote count
                cur.execute(
                    """
                    UPDATE ideas 
                    SET votes = votes + 1 
                    WHERE id = %s 
                    RETURNING id, title, description, votes, created_at::text as created_at
                    """,
                    (idea_id,)
                )
                updated_idea = cur.fetchone()
                return updated_idea
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.delete("/api/ideas/{idea_id}")
def delete_idea(idea_id: int):
    """Delete an idea (stretch goal)"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM ideas WHERE id = %s RETURNING id", (idea_id,))
                deleted = cur.fetchone()
                if not deleted:
                    raise HTTPException(status_code=404, detail="Idea not found")
                return {"message": "Idea deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3001))
    uvicorn.run(app, host="0.0.0.0", port=port)

