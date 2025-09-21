import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

# Expanded data with various types of crime and non-crime descriptions
data = {
    "text": [
        # CRIME-related (label = 1)
        "robbery in my house", "stabbed at station", "snatched mobile",
        "gunshots last night", "car stolen from parking", "sexual assault reported",
        "cyber fraud via email", "domestic violence complaint", "woman harassed in bus",
        "shop burglary in midnight", "child kidnapping reported", "arson in warehouse",
        "murder in alley", "drug dealing in locality", "human trafficking operation busted",
        "ATM theft last night", "credit card scam", "pickpocket at market", "hit and run case",
        "attempted rape case", "molestation reported", "illegal arms recovered",
        "terrorist activity suspected", "threat calls received", "blackmail case registered",
        "illegal betting racket exposed", "cash van looted", "violent protest in city",
        "fake currency seized", "bribery complaint filed",

        # NON-CRIME / NORMAL (label = 0)
        "enjoyed a walk", "cafe evening", "sunny park visit", "watched movie",
        "attended a wedding", "reading in library", "went on vacation", "gym workout",
        "dinner with family", "early morning yoga", "visited doctor", "online shopping today",
        "Heavy rain lashes city, brings temperature down", "Sunny day at the beach",
        "Cricket match postponed", "Festival celebrations in Pune",
        "Power outage due to storm", "New metro station inaugurated today",
        "Students celebrate annual cultural fest", "Government announces new health policy",
        "Vaccination drive begins in rural areas", "Tourists enjoy snowfall in Manali",
        "Stock market hits record high", "Farmers harvest bumper crop this year",
        "School reopens after holidays", "Yoga day celebrated with enthusiasm",
        "PM addresses nation on Independence Day", "Book fair organized in city",
        "Cleanliness drive at railway station", "Dog show attracts visitors"
    ],
    "label": [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,

        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]
}


# Create DataFrame
df = pd.DataFrame(data)

# Vectorization
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df["text"])
y = df["label"]

# Train Model
model = LogisticRegression()
model.fit(X, y)

# Save Model and Vectorizer
joblib.dump(model, "crime_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")


print("✅ Model and vectorizer saved successfully.")
