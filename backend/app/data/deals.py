from datetime import datetime, timezone
from typing import Dict, List, Optional
from uuid import uuid4

from ..core.constants import DEAL_STAGES


def _now_iso() -> str:
  return datetime.now(timezone.utc).isoformat()


DEALS: List[Dict[str, str]] = [
  {
    'id': 'DL-101',
    'name': 'Meridian Health',
    'company_url': 'https://meridian.health',
    'owner': 'Lena Garcia',
    'stage': 'Screen',
    'round': 'Series A',
    'check_size': '$3.5M',
    'status': 'Reviewing',
    'created_at': _now_iso(),
    'updated_at': _now_iso(),
  },
  {
    'id': 'DL-102',
    'name': 'FleetOS',
    'company_url': 'https://fleetos.io',
    'owner': 'Amin Patel',
    'stage': 'Diligence',
    'round': 'Seed',
    'check_size': '$1.2M',
    'status': 'Data Room',
    'created_at': _now_iso(),
    'updated_at': _now_iso(),
  },
  {
    'id': 'DL-103',
    'name': 'CloudLedger',
    'company_url': 'https://cloudledger.app',
    'owner': 'Mira Le',
    'stage': 'IC',
    'round': 'Series A',
    'check_size': '$5M',
    'status': 'Voting',
    'created_at': _now_iso(),
    'updated_at': _now_iso(),
  },
]


def _validate_stage(stage: str) -> str:
  if stage not in DEAL_STAGES:
    raise ValueError('Invalid stage')
  return stage


def list_deals() -> List[Dict[str, str]]:
  return DEALS


def get_deal(deal_id: str) -> Optional[Dict[str, str]]:
  return next((deal for deal in DEALS if deal['id'] == deal_id), None)


def create_deal(data: Dict[str, str]) -> Dict[str, str]:
  record = data.copy()
  _validate_stage(record['stage'])
  timestamp = _now_iso()
  record.setdefault('id', f'DL-{uuid4().hex[:6].upper()}')
  record.update({'created_at': timestamp, 'updated_at': timestamp})
  DEALS.append(record)
  return record


def update_deal(deal_id: str, data: Dict[str, str]) -> Dict[str, str]:
  deal = get_deal(deal_id)
  if not deal:
    raise ValueError('Deal not found')

  stage = data.get('stage')
  if stage:
    _validate_stage(stage)

  deal.update({key: value for key, value in data.items() if value is not None})
  deal['updated_at'] = _now_iso()
  return deal
