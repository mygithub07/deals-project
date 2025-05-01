import requests
import json
import os

API_URL = "https://feed.linkmydeals.com/getOffers/?API_KEY=c10bbd7a7b914f10325575715cd00a53&format=json"
JSON_CACHE_FILE = "cached_response.json"

def fetch_json_data():
    # """Fetch data from API or load from cached file for debugging."""
    # if os.path.exists(JSON_CACHE_FILE):
    #     # Load data from cached file
    #     print("Loading data from cache...")
    #     with open(JSON_CACHE_FILE, "r") as file:
    #         return json.load(file)
    
    #Otherwise, fetch from API
    print("Fetching data from API...")
    response = requests.get(API_URL)
    if response.status_code == 200:
        data = response.json()
        
        # Save response to a file for debugging
        with open(JSON_CACHE_FILE, "w") as file:
            json.dump(data, file, indent=4)
        
        return data
    else:
        return {"error": "Failed to fetch data from API", "status_code": response.status_code}
