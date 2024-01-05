from course_classes import Section, Course, Subject
from typing import List
import firebase_admin
from firebase_admin import credentials, firestore

class DatabaseConn:
    def __init__(self) -> None:
        self.cred = credentials.Certificate("firebase/key.json")
        self.app = firebase_admin.initialize_app(self.cred)
        self.db = firestore.client()

    def post_data(self, subject_list:List[Subject]):
        for subject in subject_list:
            for course in subject.course_list:
                self.db.collection(subject.subject_name).document(course.course_name).set(
                    {"course_number":course.course_number,
                     "course_name":course.course_name,
                     "credit":course.credit,
                     "sas_core":course.sas_core})
                for section in course.section_list:
                    self.db.collection(subject.subject_name).document(course.course_name).collection("sections").document(section.section_number).set(
                        {"index_number":section.index_number,
                         "section_number":section.section_number,
                         "instructor":section.instructor,
                         "lecture_day":section.lecture_day,
                         "lecture_time":section.lecture_time,
                         "campus":section.campus,
                         "classroom":section.classroom,
                         "clasroom_link":section.classroom_link})