from sqlalchemy import Integer, String, Boolean, Date, Time
from typing import Optional

from sqlalchemy.orm import Mapped, mapped_column
from database import Base
import datetime


class Holiday(Base):
    __tablename__ = "holidays"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    date: Mapped[datetime.date] = mapped_column(Date, nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String, nullable=False)


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    opponent_name: Mapped[str] = mapped_column(String, nullable=False)
    opponent_logo_url: Mapped[str] = mapped_column(String, nullable=False)
    competition: Mapped[str] = mapped_column(String, nullable=False)
    match_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    match_time: Mapped[Optional[datetime.time]] = mapped_column(Time, nullable=True)
    is_home: Mapped[bool] = mapped_column(Boolean, nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String, nullable=True)
