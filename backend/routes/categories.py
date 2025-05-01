from flask import Blueprint, jsonify
#from services.db_operations import get_categories
from services.orm_operations import get_categories
import traceback

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/', methods=['GET'])
def fetch_categories():
    """Fetch and return category and subcategory data for React frontend."""
    try:
        return jsonify(get_categories())
    except Exception as e:
        return jsonify({"error": str(e), "details": traceback.format_exc()}), 500
