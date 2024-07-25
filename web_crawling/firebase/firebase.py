# import sys
# sys.path.append("/web_crawling/firebase")
from web_classes.course_classes import Lecture, Section, Course, Subject
from typing import List
import firebase_admin
from firebase_admin import credentials, firestore

class DatabaseConn:
    def __init__(self) -> None:
        self.cred = credentials.Certificate("firebase/key.json")
        self.app = firebase_admin.initialize_app(self.cred)
        self.db = firestore.client()

    def allData(self, subject:Subject):
        for course in subject.course_list:
            print("uploading course: " + course.course_name)
            document_course_name = course.course_name.replace("/", "-")
            self.db.collection(subject.subject_name).document(document_course_name).set(
                {"course_number":course.course_number,
                    "course_name":course.course_name,
                    "credit":course.credit,
                    "sas_core":course.sas_core})
            print("course: " + course.course_name + " uploaded")
            for section in course.section_list:
                print("uploading section: " + section.section_number)
                self.db.collection(subject.subject_name).document(document_course_name).collection("sections").document(section.section_number).set(
                    {"index_number":section.index_number,
                        "section_number":section.section_number,
                        "instructor":section.instructor})
                print("section: " + section.section_number + " uploaded")
                count = 0
                for lecture in section.lecture_info:
                    print("uploading lecture info" + str(count))
                    self.db.collection(subject.subject_name).document(document_course_name).collection("sections").document(
                        section.section_number).collection("lecture_info").document("lecture_info"+str(count)).set(
                            {"lecture_day":lecture.lecture_day,
                                "lecture_time":lecture.lecture_time,
                                "campus":lecture.campus,
                                "recitation":lecture.recitation,
                                "classroom":lecture.classroom,
                                "clasroom_link":lecture.classroom_link})
                    count+=1
                    print("lecture info" + str(count) + " uploaded")
                
    def update():
        pass
                