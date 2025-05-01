from flask import Blueprint, jsonify
from services.orm_operations import get_deals
import traceback
from flask import Blueprint, jsonify
from services.orm_operations import insert_offer, get_or_create_category, get_or_create_subcategory, insert_offer_category
from services.data_fetcher import fetch_json_data  # Ensure you have this function
from services.image_processing import resize_image,nourl_image, resize_image_2  # Ensure you have this function
from PIL import Image
from io import BytesIO
import os

deals_bp = Blueprint("deals", __name__)  # Blueprint defined
nourl_image_path=os.path.join('services', 'sale.png')

@deals_bp.route("/", methods=["GET"])
def fetch_deals():
    """API endpoint to fetch deals."""
    result = get_deals()

    if isinstance(result, dict) and "error" in result:
        return jsonify(result), 500  

    return jsonify(result)  

@deals_bp.route("/insertdeals", methods=["GET"])
def insert_deals():
    """Fetches data from an external API and inserts it into the database."""
    try:
        data = fetch_json_data()
        print("✅ Fetched data from API")

        if not data.get("result") or "offers" not in data:
            print("❌ Invalid API response format!")
            return jsonify({"error": "Invalid API response format"}), 400

        offers = data["offers"]
        processed_data = []

        for offer in offers:
            print(f"\n🔹 Processing Offer: {offer.get('title')} (ID: {offer.get('lmd_id')})")

            # Get image
            image_url = offer.get("image_url", "")
            image_data = (
                nourl_image(nourl_image_path) if not image_url else resize_image_2(image_url, 220)
            )

            offer_id = insert_offer({
                "source": "linkmydeals",
                "source_id": offer.get("lmd_id"),
                "store": offer.get("store"),
                "merchant_homepage": offer.get("merchant_homepage"),
                "offer_text": offer.get("offer_text"),
                "title": offer.get("title"),
                "description": offer.get("description"),
                "code": offer.get("code"),
                "terms_and_conditions": offer.get("terms_and_conditions", ""),
                "featured": offer.get("featured"),
                "publisher_exclusive": offer.get("publisher_exclusive"),
                "url": offer.get("url"),
                "smartlink": offer.get("smartLink"),
                "image_url": image_url,
                "image_data": image_data,
                "type": offer.get("type"),
                "offer": offer.get("offer"),
                "offer_value": offer.get("offer_value"),
                "status": offer.get("status"),
                "start_date": offer.get("start_date"),
                "end_date": offer.get("end_date")
            })

            if not offer_id:
                print("⚠️ Skipping category/subcategory insertion due to offer insert failure.")
                continue  # Skip rest of loop if offer failed

            print(f"✅ Inserted Offer ID: {offer_id}")

            category_array = offer.get("category_array", {})
            for main_category, sub_categories in category_array.items():
                print(f"🔍 Checking Category: {main_category}")
                category_id = get_or_create_category(main_category)
                print(f"✅ Category ID: {category_id} for {main_category}")

                for sub_category in sub_categories:
                    print(f"    🔍 Checking Subcategory: {sub_category}")
                    subcategory_id = get_or_create_subcategory(category_id, sub_category)
                    print(f"    ✅ Subcategory ID: {subcategory_id} for {sub_category}")

                    insert_offer_category(offer_id, category_id, subcategory_id)
                    print(f"    🔗 Offer {offer_id} linked to Category {category_id} and Subcategory {subcategory_id}")

            processed_data.append(offer_id)

        print(f"\n🎉 Successfully processed {len(processed_data)} offers!\n")
        return jsonify({"message": "Data stored successfully", "records": len(processed_data)})

    except Exception as e:
        print(f"❌ Error in inserting deals: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500





'''
@deals_bp.route("/insertdeals", methods=["GET"])
def insert_deals():
    """Fetches data from an external API and inserts it into the database."""
    try:
        data = fetch_json_data()
        print("✅ Fetched data from API")  

        if data.get("result") and "offers" in data:
            offers = data["offers"]
            processed_data = []

            for offer in offers:
                print(f"\n🔹 Processing Offer: {offer.get('title')} (ID: {offer.get('lmd_id')})")

                image_url = offer.get("image_url", "")
                image_data = resize_image(image_url) if image_url else None  

                offer_id = insert_offer({
                    "source": "linkmydeals",
                    "source_id": offer.get("lmd_id"),
                    "store": offer.get("store"),
                    "merchant_homepage": offer.get("merchant_homepage"),
                    "offer_text": offer.get("offer_text"),
                    "title": offer.get("title"),
                    "description": offer.get("description"),
                    "code": offer.get("code"),
                    "terms_and_conditions": offer.get("terms_and_conditions", ""),
                    "featured": offer.get("featured"),
                    "publisher_exclusive": offer.get("publisher_exclusive"),
                    "url": offer.get("url"),
                    "smartlink": offer.get("smartLink"),
                    "image_url": image_url,
                    "image_data": image_data,  
                    "type": offer.get("type"),
                    "offer": offer.get("offer"),
                    "offer_value": offer.get("offer_value"),
                    "status": offer.get("status"),
                    "start_date": offer.get("start_date"),
                    "end_date": offer.get("end_date")
                })
                print(f"✅ Inserted Offer ID: {offer_id}")  

                category_array = offer.get("category_array", {})
                for main_category, sub_categories in category_array.items():
                    print(f"🔍 Checking Category: {main_category}")  
                    category_id = get_or_create_category(main_category)
                    print(f"✅ Category ID: {category_id} for {main_category}")  

                    for sub_category in sub_categories:
                        print(f"    🔍 Checking Subcategory: {sub_category}")  
                        subcategory_id = get_or_create_subcategory(category_id, sub_category)
                        print(f"    ✅ Subcategory ID: {subcategory_id} for {sub_category}")

                        insert_offer_category(offer_id, category_id, subcategory_id)
                        print(f"    🔗 Offer {offer_id} linked to Category {category_id} and Subcategory {subcategory_id}")

                processed_data.append(offer_id)

            print(f"\n🎉 Successfully processed {len(processed_data)} offers!\n")
            return jsonify({"message": "Data stored successfully", "records": len(processed_data)})

        else:
            print("❌ Invalid API response format!")
            return jsonify({"error": "Invalid API response format"}), 400

    except Exception as e:
        error_details = traceback.format_exc()
        print("🚨 ERROR DETECTED! 🚨")
        print(error_details)
        return jsonify({"error": str(e), "details": error_details}), 500  
'''

'''
from openai import OpenAI

# Set your OpenAI API key (Replace with your actual key)
#openai.api_key = "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"  # Required to authenticate API requests
client = OpenAI(api_key="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")
def generate_deal_image_with_dalle(title, description):
    """Generates an AI image for the deal when no image_url is provided."""
    try:
        prompt = f"A promotional banner for a discount deal on {title}. {description}."

        response = client.images.generate(
            model="dall-e-3",  # Ensure correct DALL·E model
            prompt=prompt,
            n=1,
            size="1024x1024"
        )

        if response and "data" in response and len(response.data) > 0:
            image_url = response.data[0].url
            return image_url  # ✅ Return the generated image URL
        else:
            print("❌ Failed to generate image from DALL·E")
            return None

    except Exception as e:
        print(f"🚨 Error generating AI image: {e}")
        return None

def create_placeholder_image():
    """Creates a blank image of size 220x200 px in case AI image generation fails."""
    image = Image.new("RGB", (220, 200), color=(255, 255, 255))  # White background
    img_byte_arr = BytesIO()
    image.save(img_byte_arr, format="PNG")
    return img_byte_arr.getvalue()  # Return image as binary data

def fetch_and_resize_image(image_url):
    """Fetches an image from the URL and resizes it to 220x200 px."""
    try:
        response = requests.get(image_url)
        if response.status_code == 200:
            image = Image.open(BytesIO(response.content))
            image = image.resize((220, 200))  # Resize to 220x200
            img_byte_arr = BytesIO()
            image.save(img_byte_arr, format="PNG")
            return img_byte_arr.getvalue()
    except Exception as e:
        print(f"❌ Error fetching/resizing image: {e}")
    return None  # Return None if fetching/resizing fails

@deals_bp.route("/insertdeals", methods=["GET"])
def insert_deals():
    """Fetches data from an external API and inserts it into the database."""
    try:
        data = fetch_json_data()
        print("✅ Fetched data from API")  

        if data.get("result") and "offers" in data:
            offers = data["offers"]
            processed_data = []

            for offer in offers:
                print(f"\n🔹 Processing Offer: {offer.get('title')} (ID: {offer.get('lmd_id')})")

                image_url = offer.get("image_url", "")
                image_data = None

                if image_url:
                    # If image_url exists, resize it and store it
                    image_data = resize_image(image_url)
                else:
                    # If no image_url, generate AI image
                    ai_generated_image_url = generate_deal_image_with_dalle(offer.get("title"), offer.get("description"))
                    
                    if ai_generated_image_url:
                        image_data = fetch_and_resize_image(ai_generated_image_url)
                    else:
                        # If AI fails, use a placeholder image
                        image_data = create_placeholder_image()

                offer_id = insert_offer({
                    "source": "linkmydeals",
                    "source_id": offer.get("lmd_id"),
                    "store": offer.get("store"),
                    "merchant_homepage": offer.get("merchant_homepage"),
                    "offer_text": offer.get("offer_text"),
                    "title": offer.get("title"),
                    "description": offer.get("description"),
                    "code": offer.get("code"),
                    "terms_and_conditions": offer.get("terms_and_conditions", ""),
                    "featured": offer.get("featured"),
                    "publisher_exclusive": offer.get("publisher_exclusive"),
                    "url": offer.get("url"),
                    "smartlink": offer.get("smartLink"),
                    "image_url": image_url if image_url else ai_generated_image_url,  # Store whichever is available
                    "image_data": image_data,  # Insert processed binary image data
                    "type": offer.get("type"),
                    "offer": offer.get("offer"),
                    "offer_value": offer.get("offer_value"),
                    "status": offer.get("status"),
                    "start_date": offer.get("start_date"),
                    "end_date": offer.get("end_date")
                })
                print(f"✅ Inserted Offer ID: {offer_id}")  

                # Process Categories
                category_array = offer.get("category_array", {})
                for main_category, sub_categories in category_array.items():
                    category_id = get_or_create_category(main_category)
                    for sub_category in sub_categories:
                        subcategory_id = get_or_create_subcategory(category_id, sub_category)
                        insert_offer_category(offer_id, category_id, subcategory_id)

                processed_data.append(offer_id)

            print(f"\n🎉 Successfully processed {len(processed_data)} offers!\n")
            return {"message": "Data stored successfully", "records": len(processed_data)}

        else:
            print("❌ Invalid API response format!")
            return {"error": "Invalid API response format"}

    except Exception as e:
        error_details = traceback.format_exc()
        print("🚨 ERROR DETECTED! 🚨")
        print(error_details)
        return {"error": str(e), "details": error_details}
'''