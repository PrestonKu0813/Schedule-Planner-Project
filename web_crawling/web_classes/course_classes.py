from typing import List

class Lecture:
    def __init__(self, lectureDay, lectureTime, campus, recitation, classroom, classroomLink) -> None:
        self.lectureDay = lectureDay
        self.lectureTime = lectureTime
        self.campus = campus
        self.recitation = recitation
        self.classroom = classroom
        self.classroomLink = classroomLink

class Section:
    def __init__(self, indexNumber:int, sectionNumber:int, instructor:str, lectureInfo:List[Lecture]) -> None:
        self.indexNumber = indexNumber
        self.sectionNumber = sectionNumber
        self.instructor = instructor
        self.lectureInfo = lectureInfo
        

    def __str__(self) -> str:
        return f"[{self.sectionNumber}], taught by {self.instructor}"

class Course:
    def __init__(self, courseNumber:str, courseName:str, credit:int, coreCode:str, sectionsList:List[Section]) -> None:
        self.courseNumber = courseNumber
        self.courseName = courseName
        self.credit = credit
        self.coreCode = coreCode
        self.sectionsList = sectionsList

    def __str__(self) -> str:
        return f"[{self.courseNumber}] {self.courseName}, {self.credit} credits, with {len(self.sections)} sections"

class Subject:
    def __init__(self, subjectName, subjectCode, coursesList:List[Course]) -> None:
        self.subjectName = subjectName
        self.subjectCode = subjectCode
        self.coursesList = coursesList
