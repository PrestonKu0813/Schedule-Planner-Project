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
        count = 0
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
                         "instructor":section.instructor})
                    for lecture in section.lecture_info:
                        self.db.collection(subject.subject_name).document(course.course_name).collection("sections").document(
                            section.section_number).collection("lecture_info").document("lecture_info"+str(count)).set(
                                {"lecture_day":lecture.lecture_day,
                                 "lecture_time":lecture.lecture_time,
                                 "campus":lecture.campus,
                                 "recitation":lecture.recitation,
                                 "classroom":lecture.classroom,
                                 "clasroom_link":lecture.classroom_link})
                        count+=1


