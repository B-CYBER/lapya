release: cd backend && alembic upgrade head && python seed.py
web: cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
