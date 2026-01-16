from datetime import datetime
from typing import Optional

from pydantic import BaseModel, HttpUrl, root_validator

from ..core.constants import DEAL_STAGES


class DealBase(BaseModel):
  name: str
  company_url: HttpUrl
  owner: str
  stage: str
  round: str
  check_size: str
  status: str

  @root_validator(pre=True)
  def validate_stage(cls, values):
    stage = values.get('stage')
    if stage not in DEAL_STAGES:
      raise ValueError('Invalid stage')
    return values


class DealCreate(DealBase):
  pass


class DealUpdate(BaseModel):
  name: Optional[str] = None
  company_url: Optional[HttpUrl] = None
  owner: Optional[str] = None
  stage: Optional[str] = None
  round: Optional[str] = None
  check_size: Optional[str] = None
  status: Optional[str] = None

  @root_validator(pre=True)
  def validate_stage(cls, values):
    stage = values.get('stage')
    if stage and stage not in DEAL_STAGES:
      raise ValueError('Invalid stage')
    return values


class DealOut(DealBase):
  id: str
  created_at: datetime
  updated_at: datetime
