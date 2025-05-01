from flask import Blueprint

# Import all route modules so they get registered when the package is imported
from .deals import deals_bp
from .categories import categories_bp

# Create a Blueprint to group all routes (optional, useful for large apps)
routes_bp = Blueprint('routes', __name__)

# Register individual blueprints to the main routes blueprint
routes_bp.register_blueprint(deals_bp, url_prefix='/deals')
routes_bp.register_blueprint(categories_bp, url_prefix='/categories')

# Now `routes_bp` can be registered in `app.py` if needed

