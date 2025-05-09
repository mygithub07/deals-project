'''
from flask import g, jsonify
import traceback
import requests

def insert_offer(offer_data):
    sql = """
    INSERT INTO wp_offers (
        source, source_id, store, merchant_homepage, offer_text, title, description, code, 
        terms_and_conditions, featured, publisher_exclusive, url, smartlink, image_url, image_data, 
        type, offer, offer_value, status, start_date, end_date
    ) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE 
        store = VALUES(store),
        merchant_homepage = VALUES(merchant_homepage),
        offer_text = VALUES(offer_text),
        title = VALUES(title),
        description = VALUES(description),
        code = VALUES(code),
        terms_and_conditions = VALUES(terms_and_conditions),
        featured = VALUES(featured),
        publisher_exclusive = VALUES(publisher_exclusive),
        url = VALUES(url),
        smartlink = VALUES(smartlink),
        image_url = VALUES(image_url),
        image_data = VALUES(image_data),
        type = VALUES(type),
        offer = VALUES(offer),
        offer_value = VALUES(offer_value),
        status = VALUES(status),
        start_date = VALUES(start_date),
        end_date = VALUES(end_date),
        updated_at = CURRENT_TIMESTAMP;
    """
    cursor = g.db.cursor()
    cursor.execute(sql, (
        offer_data["source"], offer_data["source_id"], offer_data["store"], offer_data.get("merchant_homepage"), 
        offer_data.get("offer_text"), offer_data["title"], offer_data.get("description"), offer_data.get("code"), 
        offer_data.get("terms_and_conditions"), offer_data.get("featured", "No"), offer_data.get("publisher_exclusive", "N"), 
        offer_data.get("url"), offer_data.get("smartlink"), offer_data.get("image_url"), offer_data.get("image_data"), 
        offer_data.get("type"), offer_data.get("offer"), offer_data.get("offer_value"), 
        offer_data.get("status", "active"), offer_data["start_date"], offer_data["end_date"]
    ))
    g.db.commit()
    return cursor.lastrowid

def get_deals():
    cursor = g.db.cursor(dictionary=True)
    try:
        query = """
            SELECT 
                o.*, 
                GROUP_CONCAT(DISTINCT oc.category_name ORDER BY oc.category_name ASC SEPARATOR ', ') AS main_categories,
                GROUP_CONCAT(DISTINCT os.subcategory_name ORDER BY os.subcategory_name ASC SEPARATOR ', ') AS subcategories
            FROM wp_offers o
            LEFT JOIN wp_offers_categories_subcategories ocs ON o.offer_id = ocs.offer_id_cat_subcat
            LEFT JOIN wp_offers_categories oc ON ocs.category_id_cat_subcat = oc.category_id
            LEFT JOIN wp_offers_subcategories os ON ocs.subcategory_id_cat_subcat = os.subcategory_id
            GROUP BY o.offer_id
            ORDER BY o.start_date DESC;
        """
        
        cursor.execute(query)
        deals = cursor.fetchall()

        return deals  # ✅ Now returns a raw list of dictionaries

    except Exception as e:
        error_details = traceback.format_exc()
        print(error_details)
        return {"error": str(e), "details": error_details}  # ✅ Returns a dictionary, not Response

def get_or_create_category(category_name):
    cursor = g.db.cursor()
    try:
        # Check if category already exists
        cursor.execute("SELECT category_id FROM wp_offers_categories WHERE category_name = %s", (category_name,))
        category = cursor.fetchone()
        if category:
            print(f"✅ Category ID: {category[0]} for {category_name}")  # Debugging
            return category[0]

        # Insert new category
        cursor.execute("INSERT INTO wp_offers_categories (category_name) VALUES (%s)", (category_name,))
        g.db.commit()  # ✅ Commit transaction
        category_id = cursor.lastrowid
        print(f"✅ Inserted New Category: {category_id} - {category_name}")  # Debugging

        return category_id
    except Exception as e:
        g.db.rollback()  # ❌ Rollback transaction on failure
        print(f"❌ ERROR inserting category: {e}")
        return None
    finally:
        cursor.close()

def get_categories():
    """Retrieve categories with their subcategories."""
    cursor = g.db.cursor()
    cursor.execute("SELECT DISTINCT oc.category_name, os.subcategory_name FROM wp_offers_categories oc LEFT JOIN wp_offers_subcategories os ON oc.category_id = os.main_category_id")
    rows = cursor.fetchall()
    categories = {}
    for category, subcategory in rows:
        if category not in categories:
            categories[category] = set()
        if subcategory:
            categories[category].add(subcategory)
    return {cat: sorted(list(subs)) for cat, subs in categories.items()}

def get_or_create_subcategory(main_category_id, subcategory_name):
    cursor = g.db.cursor()
    try:
        # Check if subcategory exists
        cursor.execute("""
            SELECT subcategory_id FROM wp_offers_subcategories 
            WHERE subcategory_name = %s AND main_category_id = %s
        """, (subcategory_name, main_category_id))
        subcategory = cursor.fetchone()
        if subcategory:
            print(f"✅ Subcategory ID: {subcategory[0]} for {subcategory_name}")  # Debugging
            return subcategory[0]

        # Insert new subcategory
        cursor.execute("""
            INSERT INTO wp_offers_subcategories (subcategory_name, main_category_id) 
            VALUES (%s, %s)
        """, (subcategory_name, main_category_id))
        g.db.commit()  # ✅ Commit transaction
        subcategory_id = cursor.lastrowid
        print(f"✅ Inserted New Subcategory: {subcategory_id} - {subcategory_name}")  # Debugging

        return subcategory_id
    except Exception as e:
        g.db.rollback()  # ❌ Rollback transaction on failure
        print(f"❌ ERROR inserting subcategory: {e}")
        return None
    finally:
        cursor.close()

def insert_offer_category(offer_id, category_id, subcategory_id):
    cursor = g.db.cursor()
    try:
        # Insert into relationship table
        cursor.execute("""
            INSERT INTO wp_offers_categories_subcategories (offer_id_cat_subcat, category_id_cat_subcat, subcategory_id_cat_subcat)
            VALUES (%s, %s, %s)
        """, (offer_id, category_id, subcategory_id))
        g.db.commit()  # ✅ Commit transaction
        print(f"🔗 Offer {offer_id} linked to Category {category_id} and Subcategory {subcategory_id}")  # Debugging
    except Exception as e:
        g.db.rollback()  # ❌ Rollback transaction on failure
        print(f"❌ ERROR linking offer to category/subcategory: {e}")
    finally:
        cursor.close()


def get_stores():
    """Fetch a list of unique stores from the database."""
    cursor = g.db.cursor()
    
    try:
        cursor.execute("SELECT DISTINCT store FROM wp_offers WHERE store IS NOT NULL AND store <> ''")
        stores = [row[0] for row in cursor.fetchall()]
        return stores
    except Exception as e:
        print(f"Error fetching stores: {e}")
        return []
    finally:
        cursor.close()

def get_types():
    """Fetch a list of unique types of deals from the database."""
    cursor = g.db.cursor()
    
    try:
        cursor.execute("SELECT DISTINCT type FROM wp_offers WHERE type IS NOT NULL AND type <> ''")
        types = [row[0] for row in cursor.fetchall()]
        return types
    except Exception as e:
        print(f"Error fetching stores: {e}")
        return []
    finally:
        cursor.close()
'''

