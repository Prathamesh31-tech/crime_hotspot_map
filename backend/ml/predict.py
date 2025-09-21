import sys, joblib
model = joblib.load("crime_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")
text = sys.argv[1]
vec = vectorizer.transform([text])
pred = model.predict(vec)
print(int(pred[0]))
