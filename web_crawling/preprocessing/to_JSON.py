# import sys
# sys.path.append("/web_crawling/firebase")
from web_classes.course_classes import Lecture, Section, Course, Subject
from typing import List
import json, os

data = {}

def create_dictionary(subject:Subject):
    
    for course in subject.coursesList:
        print("creating course: " + course.courseName)
        document_course_name = course.courseName.replace("/", "-")
        
        data[document_course_name] = {
            "course_number":course.courseNumber,
            "course_name":course.courseName,
            "credit":course.credit,
            "sas_core":course.coreCode,
            "sections":{}}
        print("course: " + course.courseName + " created")

        for section in course.sectionsList:
            print("creating section: " + section.sectionNumber)

            data[document_course_name]["sections"][section.sectionNumber] = {
                "index_number":section.indexNumber,
                "section_number":section.sectionNumber,
                "instructor":section.instructor,
                "lecture_infos":{}
            }
            print("section: " + section.sectionNumber + " created")
            count = 0

            for lecture in section.lectureInfo:
                print("creating lecture info" + str(count))

                data[document_course_name]["sections"][section.sectionNumber]["lecture_infos"][str(count)] = {
                    "lecture_day":lecture.lectureDay,
                    "lecture_time":lecture.lectureTime,
                    "campus":lecture.campus,
                    "recitation":lecture.recitation,
                    "classroom":lecture.classroom,
                    "clasroom_link":lecture.classroomLink
                }
                count+=1
                print("lecture info" + str(count) + " created")
    return data