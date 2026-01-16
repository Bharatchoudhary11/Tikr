from typing import List

from fastapi import Depends, FastAPI, HTTPException, status
from pydantic import BaseModel, EmailStr

from .core.auth import create_access_token, get_current_user, require_roles
from .data.deals import create_deal, get_deal, list_deals, update_deal
from .data.users import add_user, find_user_by_email, list_users_public
from .schemas.deals import DealCreate, DealOut, DealUpdate

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


@app.get("/deals", response_model=List[DealOut])
def get_deals_route(current_user=Depends(require_roles(['admin', 'analyst']))):
  return list_deals()


@app.post("/deals", response_model=DealOut, status_code=status.HTTP_201_CREATED)
def create_deal_route(payload: DealCreate, current_user=Depends(require_roles(['admin', 'analyst']))):
  return create_deal(payload.dict())


@app.get("/deals/{deal_id}", response_model=DealOut)
def get_deal_route(deal_id: str, current_user=Depends(require_roles(['admin', 'analyst']))):
  deal = get_deal(deal_id)
  if not deal:
    raise HTTPException(status_code=404, detail="Deal not found")
  return deal


@app.patch("/deals/{deal_id}", response_model=DealOut)
def update_deal_route(deal_id: str, payload: DealUpdate, current_user=Depends(require_roles(['admin', 'analyst']))):
  try:
    update_data = payload.dict(exclude_unset=True, exclude_none=True)
    if not update_data:
      raise HTTPException(status_code=400, detail="No fields to update")
    return update_deal(deal_id, update_data)
  except ValueError as exc:
    status_code = 404 if 'not found' in str(exc).lower() else 400
    raise HTTPException(status_code=status_code, detail=str(exc)) from exc


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
