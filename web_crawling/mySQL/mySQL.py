from typing import List, Dict
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from mySQL.tables import SQLSubject, SQLCourse, SQLSection
from web_classes.course_classes import Subject
from ENUM import Key
import json

class MySQLConn:
    def __init__(self) -> None:
        path = "mySQL/key.json"
        file = open(path)
        key = json.load(file)

        host = key[Key.HOST]
        user = key[Key.USR]
        password = key[Key.PASS]
        port = key[Key.PORT]
        database = key[Key.DB]

        mysql_db_url = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"
        engine = create_engine(mysql_db_url)
        Session = sessionmaker(bind=engine)
        self.session = Session()
    
    def insertData(self, subject:Subject):
        self.session.add(SQLSubject(subject.subjectCode, subject.subjectName))
        self.session.commit()

        for course in subject.coursesList:
            self.session.add(SQLCourse(course.courseNumber, subject.subjectCode, course.courseName, int(course.credit), course.coreCode))
            self.session.commit()
            
            for section in course.sectionsList:
                counter = 0
                lectureInfosDict = {}
                
                for lectureInfo in section.lectureInfo:
                    lectureInfoDict = {}
                    lectureInfoDict["lectureDay"] = lectureInfo.lectureDay
                    lectureInfoDict["lectureTime"] = lectureInfo.lectureTime
                    lectureInfoDict["campus"] = lectureInfo.campus
                    lectureInfoDict["recitation"] = lectureInfo.recitation
                    lectureInfoDict["classroom"] = lectureInfo.classroom
                    lectureInfoDict["classroomLink"] = lectureInfo.classroomLink
                    lectureInfosDict[f"info{counter}"] = lectureInfoDict
                    counter+=1

                lectureInfosDictString = json.dumps(lectureInfosDict)
                self.session.add(SQLSection(section.indexNumber, course.courseNumber, section.sectionNumber, section.instructor, lectureInfosDictString))
                self.session.commit()
