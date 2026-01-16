import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Iterable, Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from ..data.users import find_user_by_email, public_user

SECRET_KEY = os.environ.get('ACCESS_TOKEN_SECRET', 'dev-secret-key')
ALGORITHM = 'HS256'
DEFAULT_EXPIRES_MINUTES = 60

security = HTTPBearer(auto_error=False)


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
  """Create a signed JWT access token."""
  payload = data.copy()
  expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=DEFAULT_EXPIRES_MINUTES))
  payload.update({'exp': expire})
  token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
  return token


def decode_token(token: str) -> Dict[str, Any]:
  """Decode a JWT access token and return the payload."""
  return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
  if credentials is None:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing credentials")

  try:
    payload = decode_token(credentials.credentials)
  except jwt.PyJWTError:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

  email = payload.get('sub')
  if not email:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

  user = find_user_by_email(email)
  if not user:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

  return public_user(user)


def require_roles(roles: Iterable[str]):
  def role_dependency(current_user: Dict[str, Any] = Depends(get_current_user)):
    if current_user['role'] not in roles:
      raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    return current_user

  return role_dependency
