from sqlalchemy import create_engine, ForeignKey, Column, SmallInteger, Integer, VARCHAR, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from ENUM import Key
import json

Base = declarative_base()
path = "mySQL/key.json"
file = open(path)
key = json.load(file)

host = key[Key.HOST]
user = key[Key.USR]
password = key[Key.PASS]
port = key[Key.PORT]
database = key[Key.DB]

mysql_db_url = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"

class SQLSubject(Base):
    __tablename__ = "subject"

    subject_code = Column("subject_code", Integer, primary_key=True)
    subject_name = Column("subject_name", VARCHAR(255))

    def __init__(self, subject_code, subject_name):
        self.subject_code = subject_code
        self.subject_name = subject_name
    
    def __repr__(self):
        return f"subject_name: {self.subject_name}, subject_code: {self.subject_code}"

class SQLCourse(Base):
    __tablename__ = "course"

    course_number = Column("course_number", VARCHAR(255), primary_key=True)
    subject_code = Column(Integer, ForeignKey("subject.subject_code"))
    course_name = Column("course_name", VARCHAR(255))
    credit = Column("credit", SmallInteger)
    core_code = Column("core_code", VARCHAR)

    def __init__(self, course_number, subject_code, course_name, credit, core_code):
        self.course_number = course_number
        self.subject_code = subject_code
        self.course_name = course_name
        self.credit = credit
        self.core_code = core_code
    
    def __repr__(self):
        return f"course_number: {self.course_number}, subject_code: {self.subject_code}, course_name: {self.course_name}, credit: {self.credit}, core_code: {self.core_code}"

class SQLSection(Base):
    __tablename__ = "section"

    index_number = Column("index_number", Integer, primary_key=True)
    course_number = Column(VARCHAR(255), ForeignKey("course.course_number"))
    section_number = Column("section_number", VARCHAR(255))
    instructor = Column("instructor", VARCHAR(255))
    lecture_info = Column("lecture_info", JSON)

    def __init__(self, index_number, course_number, section_number, instructor, lecture_info):
        self.index_number = index_number
        self.course_number = course_number
        self.section_number = section_number
        self.instructor = instructor
        self.lecture_info = lecture_info

    def __repr__(self):
        return f"index_number: {self.index_number}, course_number: {self.course_number}, section_number: {self.section_number}, instructor: {self.instructor}, lecture_info: {self.lecture_info}"

engine = create_engine(mysql_db_url)
Base.metadata.create_all(bind=engine)

Session = sessionmaker(bind=engine)
session = Session()
session.commit()
