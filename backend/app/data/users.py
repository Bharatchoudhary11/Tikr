from typing import Dict, List, Optional

ALLOWED_ROLES = {'admin', 'analyst', 'partner'}

USERS: List[Dict[str, str]] = [
  {'email': 'admin@tikr.vc', 'password': 'admin123', 'role': 'admin'},
  {'email': 'analyst@tikr.vc', 'password': 'analyst123', 'role': 'analyst'},
  {'email': 'partner@tikr.vc', 'password': 'partner123', 'role': 'partner'},
]


def find_user_by_email(email: str) -> Optional[Dict[str, str]]:
  email = email.lower()
  return next((user for user in USERS if user['email'] == email), None)


def public_user(user: Dict[str, str]) -> Dict[str, str]:
  return {'email': user['email'], 'role': user['role']}


def list_users_public() -> List[Dict[str, str]]:
  return [public_user(user) for user in USERS]


def add_user(email: str, password: str, role: str) -> Dict[str, str]:
  email = email.lower()
  if role not in ALLOWED_ROLES:
    raise ValueError('Invalid role')
  if find_user_by_email(email):
    raise ValueError('User already exists')

  user = {'email': email, 'password': password, 'role': role}
  USERS.append(user)
  return public_user(user)
