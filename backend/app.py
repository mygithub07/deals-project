from flask import Flask, g
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

from db import connect_db, close_db
from models import db, Offer, OfferCategory, OfferSubcategory, OfferCategorySubcategory
from routes.categories import categories_bp
from routes.deals import deals_bp
from routes.stores import stores_bp
from routes.types import types_bp

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Load DB credentials securely
DB_USER = os.getenv("POSTGRES_USER")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "postgres_container")
DB_NAME = os.getenv("POSTGRES_DB")
DB_PORT = os.getenv("DB_PORT", "5432")

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize DB & Migrations
db.init_app(app)
migrate = Migrate(app, db)

# Create tables only once (when needed)
with app.app_context():
    db.create_all()

# Register blueprints
app.register_blueprint(categories_bp, url_prefix='/categories')
app.register_blueprint(deals_bp, url_prefix='/deals')
app.register_blueprint(stores_bp, url_prefix='/stores')
app.register_blueprint(types_bp, url_prefix='/types')

@app.before_request
def before_request():
    """Open raw DB connection before each request if needed."""
    g.db = connect_db()

@app.teardown_appcontext
def teardown_db(exception=None):
    """Close raw DB connection after each request."""
    close_db(exception)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
