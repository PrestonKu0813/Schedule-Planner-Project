from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from mySQL.tables import SQLSubject, SQLCourse, SQLSection
from web_classes.course_classes import Subject
from mySQL.ENUM import Key
import json

class MySQLConn:
    def __init__(self) -> None:
        path = "mySQL/key.json"
        file = open(path)
        key = json.load(file)

        host = key[Key.HOST.value]
        user = key[Key.USR.value]
        password = key[Key.PASS.value]
        port = key[Key.PORT.value]
        database = key[Key.DB.value]

        mysql_db_url = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"
        engine = create_engine(mysql_db_url)
        Session = sessionmaker(bind=engine)
        self.session = Session()
    
    def insertData(self, subject:Subject):
        self.session.merge(SQLSubject(subject.subjectCode, subject.subjectName))
        self.session.commit()

        for course in subject.coursesList:
            self.session.merge(SQLCourse(course.courseNumber, subject.subjectCode, course.courseName, int(course.credit), course.coreCode))
            self.session.commit()
            
            for section in course.sectionsList:
                counter = 0
                lectureInfosDict = {}
                
                for lectureInfo in section.lectureInfo:
                    lectureInfoDict = {}
                    lectureInfoDict["lecture_day"] = lectureInfo.lectureDay
                    lectureInfoDict["lecture_time"] = lectureInfo.lectureTime
                    lectureInfoDict["campus"] = lectureInfo.campus
                    lectureInfoDict["recitation"] = lectureInfo.recitation
                    lectureInfoDict["classroom"] = lectureInfo.classroom
                    lectureInfoDict["classroom_link"] = lectureInfo.classroomLink
                    lectureInfosDict[f"info{counter}"] = lectureInfoDict
                    counter+=1

                lectureInfosDictString = json.dumps(lectureInfosDict)
                self.session.merge(SQLSection(section.indexNumber, course.courseNumber, section.sectionNumber, section.instructor, lectureInfosDictString))
                self.session.commit()
