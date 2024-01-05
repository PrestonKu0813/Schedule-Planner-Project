from course_classes import Section, Course, Subject
import firebase_admin
from firebase_admin import credentials, firestore

# Use a service account
cred = credentials.Certificate("firebase/key.json")

app = firebase_admin.initialize_app(cred)
db = firestore.client()


db.collection("test").document("test").set({"test":"bo'oh'o'wa'er"})