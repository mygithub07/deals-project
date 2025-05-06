from models import db, Offer, OfferCategory, OfferSubcategory, OfferCategorySubcategory
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
import traceback
from datetime import datetime

def convert_offer_dates(offer_data: dict) -> dict:
    date_fields = ['start_date', 'end_date']

    for field in date_fields:
        if field in offer_data and isinstance(offer_data[field], str):
            try:
                offer_data[field] = datetime.strptime(offer_data[field], "%Y-%m-%d").date()
            except ValueError as e:
                raise ValueError(f"Invalid date format for '{field}': {offer_data[field]} (expected YYYY-MM-DD)") from e

    return offer_data

def insert_offer(offer_data):
    try:
        # Ensure dates are proper datetime.date objects
        offer_data = convert_offer_dates(offer_data)

        # Check if offer already exists
        existing_offer = Offer.query.filter_by(
            source=offer_data["source"],
            source_id=offer_data["source_id"]
        ).first()

        if existing_offer:
            for field in offer_data:
                if hasattr(existing_offer, field):
                    setattr(existing_offer, field, offer_data[field])
        else:
            existing_offer = Offer(**offer_data)
            db.session.add(existing_offer)

        db.session.commit()
        return existing_offer.offer_id

    except Exception as e:
        db.session.rollback()
        print("❌ insert_offer() failed with:")
        print(f"Error: {e}")
        print(f"Data: {offer_data}")
        print(traceback.format_exc())
        return None



def get_deals():
    try:
        offers = Offer.query.all()
        deals = []

        for offer in offers:
            categories = set()
            subcategories = set()

            for rel in offer.categories_subcategories:
                if rel.category:
                    categories.add(rel.category.category_name)
                if rel.subcategory:
                    subcategories.add(rel.subcategory.subcategory_name)

            deals.append({
                "offer_id": offer.offer_id,
                "source": offer.source,
                "source_id": offer.source_id,
                "store": offer.store,
                "merchant_homepage": offer.merchant_homepage,
                "offer_text": offer.offer_text,
                "title": offer.title,
                "description": offer.description,
                "code": offer.code,
                "terms_and_conditions": offer.terms_and_conditions,
                "featured": offer.featured,
                "publisher_exclusive": offer.publisher_exclusive,
                "url": offer.url,
                "smartlink": offer.smartlink,
                "image_url": offer.image_url,
                "image_data": offer.image_data,
                "type": offer.type,
                "offer": offer.offer,
                "offer_value": offer.offer_value,
                "status": offer.status,
                "start_date": offer.start_date.isoformat() if offer.start_date else None,
                "end_date": offer.end_date.isoformat() if offer.end_date else None,
                "main_categories": ", ".join(sorted(categories)),
                "subcategories": ", ".join(sorted(subcategories))
            })

        return deals
    except Exception as e:
        print(traceback.format_exc())
        return {"error": str(e), "details": traceback.format_exc()}



def get_or_create_category(category_name):
    try:
        category = OfferCategory.query.filter_by(category_name=category_name).first()
        if category:
            return category.category_id

        new_category = OfferCategory(category_name=category_name)
        db.session.add(new_category)
        db.session.commit()
        return new_category.category_id
    except Exception as e:
        db.session.rollback()
        print(f"❌ ERROR inserting category: {e}")
        return None


def get_categories():
    try:
        categories = OfferCategory.query.all()
        category_dict = {}

        for cat in categories:
            subs = [sub.subcategory_name for sub in cat.subcategories]
            category_dict[cat.category_name] = sorted(subs)

        return category_dict
    except Exception as e:
        print(traceback.format_exc())
        return {}


def get_or_create_subcategory(main_category_id, subcategory_name):
    try:
        sub = OfferSubcategory.query.filter_by(
            main_category_id=main_category_id,
            subcategory_name=subcategory_name
        ).first()

        if sub:
            return sub.subcategory_id

        new_sub = OfferSubcategory(
            subcategory_name=subcategory_name,
            main_category_id=main_category_id
        )
        db.session.add(new_sub)
        db.session.commit()
        return new_sub.subcategory_id
    except Exception as e:
        db.session.rollback()
        print(f"❌ ERROR inserting subcategory: {e}")
        return None


def insert_offer_category(offer_id, category_id, subcategory_id):
    try:
        mapping = OfferCategorySubcategory(
            offer_id_cat_subcat=offer_id,
            category_id_cat_subcat=category_id,
            subcategory_id_cat_subcat=subcategory_id
        )
        db.session.add(mapping)
        db.session.commit()
        print(f"🔗 Offer {offer_id} linked to Category {category_id} and Subcategory {subcategory_id}")
    except Exception as e:
        db.session.rollback()
        print(f"❌ ERROR linking offer to category/subcategory: {e}")


def get_stores():
    try:
        stores = db.session.query(Offer.store).distinct().filter(
            Offer.store.isnot(None),
            Offer.store != ""
        ).all()
        return [store[0] for store in stores]
    except Exception as e:
        print(f"Error fetching stores: {e}")
        return []


def get_types():
    try:
        types = db.session.query(Offer.type).distinct().filter(
            Offer.type.isnot(None),
            Offer.type != ""
        ).all()
        return [t[0] for t in types]
    except Exception as e:
        print(f"Error fetching types: {e}")
        return []
