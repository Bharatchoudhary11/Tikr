import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

import jwt

SECRET_KEY = os.environ.get('ACCESS_TOKEN_SECRET', 'dev-secret-key')
ALGORITHM = 'HS256'
DEFAULT_EXPIRES_MINUTES = 60


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
