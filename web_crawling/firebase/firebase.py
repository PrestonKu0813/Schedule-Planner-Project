# import sys
# sys.path.append("/web_crawling/firebase")
from web_classes.course_classes import Subject
import firebase_admin
from firebase_admin import credentials, firestore

class FirebaseConn:
    def __init__(self) -> None:
        self.cred = credentials.Certificate("firebase/key.json")
        self.app = firebase_admin.initialize_app(self.cred)
        self.db = firestore.client()

    def allData(self, subject:Subject):
        for course in subject.coursesList:
            print("uploading course: " + course.courseName)
            documentCourseName = course.courseName.replace("/", "-")
            self.db.collection(subject.subjectName).document(documentCourseName).set(
                {"course_number":course.courseNumber,
                    "course_name":course.courseName,
                    "credit":course.credit,
                    "sas_core":course.sasCore})
            print("course: " + course.courseName + " uploaded")
            for section in course.sectionsList:
                print("uploading section: " + section.sectionNumber)
                self.db.collection(subject.subjectName).document(documentCourseName).collection("sections").document(section.sectionNumber).set(
                    {"index_number":section.indexNumber,
                        "section_number":section.sectionNumber,
                        "instructor":section.instructor})
                print("section: " + section.sectionNumber + " uploaded")
                count = 0
                for lecture in section.lectureInfo:
                    print("uploading lecture info" + str(count))
                    self.db.collection(subject.subjectName).document(documentCourseName).collection("sections").document(
                        section.sectionNumber).collection("lecture_info").document("lecture_info"+str(count)).set(
                            {"lecture_day":lecture.lectureDay,
                                "lecture_time":lecture.lectureTime,
                                "campus":lecture.campus,
                                "recitation":lecture.recitation,
                                "classroom":lecture.classroom,
                                "clasroom_link":lecture.classroomLink})
                    count+=1
                    print("lecture info" + str(count) + " uploaded")
                
    def update():
        pass
                