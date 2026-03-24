from pydantic import BaseModel
from datetime import date, time
from typing import Optional



class HolidayResponse(BaseModel):
    id: int
    date: date
    name: str

    model_config = {"from_attributes": True}


class MatchCreate(BaseModel):
    opponent_name: str
    opponent_logo_url: str
    competition: str
    match_date: date
    match_time: Optional[time] = None
    is_home: bool
    location: Optional[str] = None


class MatchResponse(BaseModel):
    id: int
    opponent_name: str
    opponent_logo_url: str
    competition: str
    match_date: date
    match_time: Optional[time]
    is_home: bool
    location: Optional[str]

    model_config = {"from_attributes": True}
