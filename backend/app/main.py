from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr

from .core.auth import create_access_token

app = FastAPI(title="Tikr Backend")


class LoginRequest(BaseModel):
  email: EmailStr
  password: str


class LoginResponse(BaseModel):
  access_token: str
  role: str


FAKE_USERS = [
  {'email': 'admin@tikr.vc', 'password': 'admin123', 'role': 'admin'},
  {'email': 'analyst@tikr.vc', 'password': 'analyst123', 'role': 'analyst'},
  {'email': 'partner@tikr.vc', 'password': 'partner123', 'role': 'partner'},
]


@app.get("/health")
def health_check():
  return {"status": "ok"}


@app.post("/auth/login", response_model=LoginResponse)
def login(credentials: LoginRequest):
  email = credentials.email.lower()
  user = next((candidate for candidate in FAKE_USERS if candidate['email'] == email), None)
  if not user or user['password'] != credentials.password:
    raise HTTPException(status_code=401, detail="Invalid email or password")

  token = create_access_token({'sub': user['email'], 'role': user['role']})
  return {'access_token': token, 'role': user['role']}
