from flask import Blueprint, jsonify
#from services.db_operations import get_stores
from services.orm_operations import get_stores

stores_bp = Blueprint("stores", __name__)

@stores_bp.route("/", methods=["GET"])
def fetch_stores():
    """API endpoint to fetch unique stores."""
    try:
        stores = get_stores()
        return jsonify(stores), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
