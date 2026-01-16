from typing import List

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, EmailStr

from .core.auth import create_access_token, get_current_user, require_roles
from .data.users import add_user, find_user_by_email, list_users_public

app = FastAPI(title="Tikr Backend")


class LoginRequest(BaseModel):
  email: EmailStr
  password: str


class LoginResponse(BaseModel):
  access_token: str
  role: str


class UserCreate(BaseModel):
  email: EmailStr
  password: str
  role: str


class UserOut(BaseModel):
  email: EmailStr
  role: str


@app.get("/health")
def health_check():
  return {"status": "ok"}


@app.post("/auth/login", response_model=LoginResponse)
def login(credentials: LoginRequest):
  user = find_user_by_email(credentials.email)
  if not user or user['password'] != credentials.password:
    raise HTTPException(status_code=401, detail="Invalid email or password")

  token = create_access_token({'sub': user['email'], 'role': user['role']})
  return {'access_token': token, 'role': user['role']}


@app.get(
    "/deals",
    dependencies=[Depends(require_roles(['admin', 'analyst']))],
)
def get_deals():
  return {'message': 'Deals endpoint placeholder'}


@app.get(
    "/memos",
    dependencies=[Depends(require_roles(['admin', 'analyst']))],
)
def get_memos():
  return {'message': 'Memos endpoint placeholder'}


@app.post(
    "/comments",
    dependencies=[Depends(require_roles(['admin', 'partner']))],
)
def post_comment():
  return {'message': 'Comment recorded'}


@app.post(
    "/votes",
    dependencies=[Depends(require_roles(['admin', 'partner']))],
)
def post_vote():
  return {'message': 'Vote recorded'}


@app.get(
    "/users",
    response_model=List[UserOut],
    dependencies=[Depends(require_roles(['admin']))],
)
def list_users():
  return list_users_public()


@app.post(
    "/users",
    response_model=UserOut,
    status_code=201,
    dependencies=[Depends(require_roles(['admin']))],
)
def create_user(payload: UserCreate):
  try:
    return add_user(payload.email, payload.password, payload.role)
  except ValueError as exc:
    raise HTTPException(status_code=400, detail=str(exc)) from exc
