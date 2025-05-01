from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Offer(db.Model):
    __tablename__ = "offers"

    offer_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    source = db.Column(db.String(100), nullable=False)
    source_id = db.Column(db.String(100), nullable=False)
    store = db.Column(db.String(255), nullable=False)
    merchant_homepage = db.Column(db.Text)
    offer_text = db.Column(db.Text)
    title = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text)
    code = db.Column(db.String(50))
    terms_and_conditions = db.Column(db.Text)
    featured = db.Column(db.Enum('Yes', 'No', name="featured_enum"), default='No')
    publisher_exclusive = db.Column(db.Enum('Y', 'N', name="exclusive_enum"), default='N')
    url = db.Column(db.Text)
    smartlink = db.Column(db.Text)
    image_url = db.Column(db.Text)
    image_data = db.Column(db.Text) 
    type = db.Column(db.String(50))
    offer = db.Column(db.String(100))
    offer_value = db.Column(db.String(50))
    status = db.Column(db.Enum('active', 'expired', name="status_enum"), default='active')
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.now())
    updated_at = db.Column(db.TIMESTAMP, server_default=db.func.now(), onupdate=db.func.now())

# Categories Table
class OfferCategory(db.Model):
    __tablename__ = "offers_categories"

    category_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_name = db.Column(db.String(255), unique=True, nullable=False)

# Subcategories Table
class OfferSubcategory(db.Model):
    __tablename__ = "offers_subcategories"

    subcategory_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    subcategory_name = db.Column(db.String(255), nullable=False)
    main_category_id = db.Column(db.Integer, db.ForeignKey("offers_categories.category_id", ondelete="CASCADE"))

    # Relationship
    main_category = db.relationship("OfferCategory", backref="subcategories", lazy=True)

# Mapping Table Between Offers, Categories, and Subcategories
class OfferCategorySubcategory(db.Model):
    __tablename__ = "offers_categories_subcategories"

    offer_id_cat_subcat = db.Column(db.Integer, db.ForeignKey("offers.offer_id", ondelete="CASCADE"), primary_key=True)
    category_id_cat_subcat = db.Column(db.Integer, db.ForeignKey("offers_categories.category_id", ondelete="CASCADE"), primary_key=True)
    subcategory_id_cat_subcat = db.Column(db.Integer, db.ForeignKey("offers_subcategories.subcategory_id", ondelete="CASCADE"), primary_key=True)

    # Relationships
    offer = db.relationship("Offer", backref="categories_subcategories", lazy=True)
    category = db.relationship("OfferCategory", backref="offers", lazy=True)
    subcategory = db.relationship("OfferSubcategory", backref="offers", lazy=True)
