import requests
import feedparser
import joblib
import time
import logging
from pymongo import MongoClient
from geopy.geocoders import Nominatim

# ----------------- Logging Setup -----------------
logging.basicConfig(
    filename="fetch_news.log",
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger()

# ----------------- Load ML model -----------------
try:
    model = joblib.load("crime_model.pkl", mmap_mode="r")
    vectorizer = joblib.load("vectorizer.pkl", mmap_mode="r")
    logger.info("✅ Model & vectorizer loaded successfully (mmap_mode='r').")
except Exception as e:
    logger.error(f"❌ Error loading model/vectorizer: {e}")
    raise

# ----------------- MongoDB Setup -----------------
client = MongoClient("mongodb://localhost:27017/")
db = client["crime-db"]
collection = db["posts"]

# ----------------- Geopy Setup -----------------
geolocator = Nominatim(user_agent="crime-news-locator")

# Maharashtra cities
maharashtra_cities = [
    "Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Jalgaon",
    "Amravati", "Kolhapur", "Nanded", "Sangli", "Latur", "Ahmednagar", "Chandrapur", "Parbhani"
]

def extract_maharashtra_location(text):
    for city in maharashtra_cities:
        if city.lower() in text.lower():
            try:
                location = geolocator.geocode(f"{city}, Maharashtra, India")
                if location:
                    return {"lat": location.latitude, "lng": location.longitude}
            except Exception as e:
                logger.warning(f"🌐 Geocode failed for {city}: {e}")
    return None

def is_crime(text):
    try:
        vec = vectorizer.transform([text])
        return int(model.predict(vec)[0]) == 1
    except Exception as e:
        logger.error(f"❌ Prediction error: {e}")
        return False

def save_if_crime(text, source):
    if not is_crime(text):
        return
    location = extract_maharashtra_location(text)
    if not location:
        return
    if not collection.find_one({"text": text}):
        collection.insert_one({
            "text": text,
            "location": location,
            "label": 1,
            "source": source,
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        })
        logger.info(f"✅ Saved: {text[:60]}... → {location}")
        time.sleep(0.5)  # avoid overloading
    else:
        logger.info(f"⚠️ Duplicate skipped: {text[:60]}...")

# ----------------- Fetch Functions -----------------
def fetch_gnews():
    logger.info("Fetching from GNews.io...")
    try:
        url = "https://gnews.io/api/v4/search?q=crime%20maharashtra&lang=en&country=in&max=20&apikey=572b4058d84f38725165c0979b0aecdb"
        response = requests.get(url, timeout=15)
        data = response.json()
        for article in data.get("articles", []):
            text = f"{article['title']}. {article.get('description', '')}"
            save_if_crime(text, "GNews")
    except Exception as e:
        logger.error(f"❌ GNews fetch error: {e}")

def fetch_newsapi():
    logger.info("Fetching from NewsAPI.org...")
    try:
        url = "https://newsapi.org/v2/everything?q=crime%20maharashtra&language=en&apiKey=2de9bd8806444aa3b0bc88bb6d5f14d2"
        response = requests.get(url, timeout=15)
        data = response.json()
        for article in data.get("articles", []):
            text = f"{article['title']}. {article.get('description', '')}"
            save_if_crime(text, "NewsAPI")
    except Exception as e:
        logger.error(f"❌ NewsAPI fetch error: {e}")

def fetch_google_rss():
    logger.info("Fetching from Google RSS...")
    try:
        rss_url = "https://news.google.com/rss/search?q=crime+maharashtra&hl=en-IN&gl=IN&ceid=IN:en"
        feed = feedparser.parse(rss_url)
        for entry in feed.entries:
            text = f"{entry.title}. {entry.get('description', '')}"
            save_if_crime(text, "GoogleRSS")
    except Exception as e:
        logger.error(f"❌ Google RSS fetch error: {e}")

# ----------------- Main Loop -----------------
if __name__ == "__main__":
    while True:
        try:
            fetch_gnews()
            fetch_newsapi()
            fetch_google_rss()
            logger.info("⏳ Waiting 60 seconds...\n")
            time.sleep(60)
        except Exception as e:
            logger.error(f"❌ Main loop error: {e}")
            time.sleep(60)
