from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import datetime
import os

from database import engine, get_db, Base
import models
import schemas
from seed import seed

Base.metadata.create_all(bind=engine)
seed()

app = FastAPI()

ALLOWED_ORIGINS = os.environ.get(
    "ALLOWED_ORIGINS", "http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/holidays", response_model=list[schemas.HolidayResponse])
def get_holidays(db: Session = Depends(get_db)):
    return db.query(models.Holiday).order_by(models.Holiday.date).all()


@app.get("/matches", response_model=list[schemas.MatchResponse])
def get_matches(db: Session = Depends(get_db)):
    today = datetime.date.today()
    matches = (
        db.query(models.Match)
        .filter(models.Match.match_date >= today)
        .order_by(models.Match.match_date)
        .all()
    )
    return matches


@app.post("/matches", response_model=schemas.MatchResponse, status_code=201)
def create_match(data: schemas.MatchCreate, db: Session = Depends(get_db)):
    match = models.Match(**data.model_dump())
    db.add(match)
    db.commit()
    db.refresh(match)
    return match


@app.delete("/matches/{match_id}", status_code=204)
def delete_match(match_id: int, db: Session = Depends(get_db)):
    match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    db.delete(match)
    db.commit()
