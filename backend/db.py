from flask import g
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Function to establish the connection
def connect_db():
    if "db" not in g:
        from flask import current_app
        g.db = db.session
    return g.db

# Function to close the connection
def close_db(exception=None):
    db_session = g.pop("db", None)
    if db_session is not None:
        db_session.close()
