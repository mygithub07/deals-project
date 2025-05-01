from flask import Blueprint, jsonify
#from services.db_operations import get_types
from services.orm_operations import get_types

types_bp = Blueprint("types", __name__)

@types_bp.route("/", methods=["GET"])
def fetch_types():
    """API endpoint to fetch unique stores."""
    try:
        types = get_types()
        return jsonify(types), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
