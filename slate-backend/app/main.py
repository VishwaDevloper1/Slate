from fastapi import FastAPI
from app.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import User
from app.merge import router as pdf_router
from app.split import router as split_router
from app.compress import router as compress_router
from app.convert import router as convert_router

# Initialize Database Schema
User.metadata.create_all(bind=engine)

app = FastAPI()

# 🧠 CRITICAL CORS PRODUCTION FIX:
# 1. Added live Vercel URL, wildcard fallback, and localhost to allowed profiles
# 2. Registered middleware BEFORE adding routes so error handling captures CORS context headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://slate-mu-one.vercel.app"  # 👈 Your live frontend Vercel origin link
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router Pipelines AFTER CORS Middleware initialization
app.include_router(pdf_router)
app.include_router(split_router)
app.include_router(compress_router)
app.include_router(convert_router)
app.include_router(auth_router)

@app.get("/")
def root_get():
    return {"message": "Backend running"}

@app.head("/")
def root_head():
    # HEAD requests require the same headers as GET but must return an empty body
    return None
