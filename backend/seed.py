from database import engine, SessionLocal, Base
import models
import datetime

Base.metadata.create_all(bind=engine)

MATCHES = [
    {
        "opponent_name": "Palestino",
        "opponent_logo_url": "/logos/chile/palestino.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 4, 5),
        "match_time": None,
        "is_home": True,
        "location": "Claro Arena",
    },
    {
        "opponent_name": "Boca Juniors",
        "opponent_logo_url": "/logos/argentina/boca.png",
        "competition": "Copa Libertadores",
        "match_date": datetime.date(2026, 4, 7),
        "match_time": datetime.time(20, 30),
        "is_home": True,
        "location": "Claro Arena",
    },
    {
        "opponent_name": "Audax Italiano",
        "opponent_logo_url": "/logos/chile/audax.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 4, 12),
        "match_time": None,
        "is_home": False,
        "location": None,
    },
    {
        "opponent_name": "Cruzeiro",
        "opponent_logo_url": "/logos/brasil/cruzeiro.png",
        "competition": "Copa Libertadores",
        "match_date": datetime.date(2026, 4, 15),
        "match_time": datetime.time(18, 0),
        "is_home": False,
        "location": None,
    },
    {
        "opponent_name": "Unión La Calera",
        "opponent_logo_url": "/logos/chile/unionlacalera.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 4, 19),
        "match_time": None,
        "is_home": True,
        "location": "Claro Arena",
    },
    {
        "opponent_name": "Universidad de Chile",
        "opponent_logo_url": "/logos/chile/udechile.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 4, 26),
        "match_time": None,
        "is_home": False,
        "location": None,
    },
    {
        "opponent_name": "Barcelona SC",
        "opponent_logo_url": "/logos/ecuador/barcelona.png",
        "competition": "Copa Libertadores",
        "match_date": datetime.date(2026, 4, 29),
        "match_time": datetime.time(20, 0),
        "is_home": False,
        "location": None,
    },
    {
        "opponent_name": "Cruzeiro",
        "opponent_logo_url": "/logos/brasil/cruzeiro.png",
        "competition": "Copa Libertadores",
        "match_date": datetime.date(2026, 5, 6),
        "match_time": datetime.time(22, 0),
        "is_home": True,
        "location": "Claro Arena",
    },
    {
        "opponent_name": "Deportes Limache",
        "opponent_logo_url": "/logos/chile/deportes_limache.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 5, 17),
        "match_time": None,
        "is_home": False,
        "location": None,
    },
    {
        "opponent_name": "Barcelona SC",
        "opponent_logo_url": "/logos/ecuador/barcelona.png",
        "competition": "Copa Libertadores",
        "match_date": datetime.date(2026, 5, 21),
        "match_time": datetime.time(20, 30),
        "is_home": True,
        "location": "Claro Arena",
    },
    {
        "opponent_name": "Colo Colo",
        "opponent_logo_url": "/logos/chile/colocolo.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 5, 24),
        "match_time": None,
        "is_home": True,
        "location": "Claro Arena",
    },
    {
        "opponent_name": "Boca Juniors",
        "opponent_logo_url": "/logos/argentina/boca.png",
        "competition": "Copa Libertadores",
        "match_date": datetime.date(2026, 5, 28),
        "match_time": datetime.time(20, 30),
        "is_home": False,
        "location": None,
    },
    {
        "opponent_name": "Huachipato",
        "opponent_logo_url": "/logos/chile/huachipato.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 5, 31),
        "match_time": None,
        "is_home": False,
        "location": None,
    },
    {
        "opponent_name": "Universidad de Concepción",
        "opponent_logo_url": "/logos/chile/udeconcepcion.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 6, 14),
        "match_time": None,
        "is_home": True,
        "location": "Claro Arena",
    },
    {
        "opponent_name": "La Serena",
        "opponent_logo_url": "/logos/chile/deplaserena.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 7, 26),
        "match_time": None,
        "is_home": True,
        "location": "Claro Arena",
    },
    {
        "opponent_name": "Deportes Concepción",
        "opponent_logo_url": "/logos/chile/deportes_concepcion.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 8, 2),
        "match_time": None,
        "is_home": False,
        "location": None,
    },
    {
        "opponent_name": "Cobresal",
        "opponent_logo_url": "/logos/chile/cobresal.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 8, 9),
        "match_time": None,
        "is_home": True,
        "location": "Claro Arena",
    },
    {
        "opponent_name": "Coquimbo Unido",
        "opponent_logo_url": "/logos/chile/coquimbo.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 8, 16),
        "match_time": None,
        "is_home": False,
        "location": None,
    },
    {
        "opponent_name": "Ñublense",
        "opponent_logo_url": "/logos/chile/nublense.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 8, 23),
        "match_time": None,
        "is_home": True,
        "location": "Claro Arena",
    },
    {
        "opponent_name": "O'Higgins",
        "opponent_logo_url": "/logos/chile/ohiggins.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 8, 30),
        "match_time": None,
        "is_home": True,
        "location": "Claro Arena",
    },
    {
        "opponent_name": "Everton",
        "opponent_logo_url": "/logos/chile/everton.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 9, 6),
        "match_time": None,
        "is_home": False,
        "location": None,
    },
    {
        "opponent_name": "Palestino",
        "opponent_logo_url": "/logos/chile/palestino.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 9, 13),
        "match_time": None,
        "is_home": False,
        "location": None,
    },
    {
        "opponent_name": "Audax Italiano",
        "opponent_logo_url": "/logos/chile/audax.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 10, 11),
        "match_time": None,
        "is_home": True,
        "location": "Claro Arena",
    },
    {
        "opponent_name": "Unión La Calera",
        "opponent_logo_url": "/logos/chile/unionlacalera.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 10, 25),
        "match_time": None,
        "is_home": False,
        "location": None,
    },
    {
        "opponent_name": "Universidad de Chile",
        "opponent_logo_url": "/logos/chile/udechile.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 11, 1),
        "match_time": None,
        "is_home": True,
        "location": "Claro Arena",
    },
    {
        "opponent_name": "Deportes Limache",
        "opponent_logo_url": "/logos/chile/deportes_limache.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 11, 8),
        "match_time": None,
        "is_home": True,
        "location": "Claro Arena",
    },
    {
        "opponent_name": "Colo Colo",
        "opponent_logo_url": "/logos/chile/colocolo.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 11, 22),
        "match_time": None,
        "is_home": False,
        "location": None,
    },
    {
        "opponent_name": "Huachipato",
        "opponent_logo_url": "/logos/chile/huachipato.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 11, 29),
        "match_time": None,
        "is_home": True,
        "location": "Claro Arena",
    },
    {
        "opponent_name": "Universidad de Concepción",
        "opponent_logo_url": "/logos/chile/udeconcepcion.png",
        "competition": "Liga Chilena",
        "match_date": datetime.date(2026, 12, 6),
        "match_time": None,
        "is_home": False,
        "location": None,
    },
]


def easter_sunday(year: int) -> datetime.date:
    """Algoritmo de Meeus/Jones/Butcher."""
    a = year % 19
    b, c = divmod(year, 100)
    d, e = divmod(b, 4)
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i, k = divmod(c, 4)
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    month = (h + l - 7 * m + 114) // 31
    day = (h + l - 7 * m + 114) % 31 + 1
    return datetime.date(year, month, day)


def get_chilean_holidays(year: int) -> list[dict]:
    easter = easter_sunday(year)
    viernes_santo = easter - datetime.timedelta(days=2)
    sabado_santo  = easter - datetime.timedelta(days=1)

    return [
        {"date": datetime.date(year, 1,  1),  "name": "Año Nuevo"},
        {"date": viernes_santo,               "name": "Viernes Santo"},
        {"date": sabado_santo,                "name": "Sábado Santo"},
        {"date": datetime.date(year, 5,  1),  "name": "Día del Trabajo"},
        {"date": datetime.date(year, 5,  21), "name": "Glorias Navales"},
        {"date": datetime.date(year, 6,  29), "name": "San Pedro y San Pablo"},
        {"date": datetime.date(year, 7,  16), "name": "Virgen del Carmen"},
        {"date": datetime.date(year, 8,  15), "name": "Asunción de la Virgen"},
        {"date": datetime.date(year, 9,  18), "name": "Independencia de Chile"},
        {"date": datetime.date(year, 9,  19), "name": "Glorias del Ejército"},
        {"date": datetime.date(year, 10, 12), "name": "Encuentro de Dos Mundos"},
        {"date": datetime.date(year, 10, 31), "name": "Iglesias Evangélicas"},
        {"date": datetime.date(year, 11, 1),  "name": "Todos los Santos"},
        {"date": datetime.date(year, 12, 8),  "name": "Inmaculada Concepción"},
        {"date": datetime.date(year, 12, 25), "name": "Navidad"},
    ]


def seed():
    db = SessionLocal()
    try:
        if db.query(models.Match).count() == 0:
            for data in MATCHES:
                db.add(models.Match(**data))
            db.commit()
            print(f"Seeded {len(MATCHES)} matches.")
        else:
            print("Matches already seeded, skipping.")

        if db.query(models.Holiday).count() == 0:
            holidays = get_chilean_holidays(2026) + get_chilean_holidays(2027)
            for data in holidays:
                db.add(models.Holiday(**data))
            db.commit()
            print(f"Seeded {len(holidays)} holidays.")
        else:
            print("Holidays already seeded, skipping.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
