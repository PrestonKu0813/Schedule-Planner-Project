from typing import List

class Lecture:
    def __init__(self, lecture_day, lecture_time, campus, recitation, classroom, classroom_link) -> None:
        self.lecture_day = lecture_day
        self.lecture_time = lecture_time
        self.campus = campus
        self.recitation = recitation
        self.classroom = classroom
        self.classroom_link = classroom_link

class Section:
    def __init__(self, index_number:int, section_number:int, instructor:str, lecture_info:List[Lecture]) -> None:
        self.index_number = index_number
        self.section_number = section_number
        self.instructor = instructor
        self.lecture_info = lecture_info
        

    def __str__(self) -> str:
        return f"[{self.section_number}], taught by {self.instructor}"

class Course:
    def __init__(self, number:str, name:str, credit:int, sas_core:str, sections_list:List[Section]) -> None:
        self.course_number = number
        self.course_name = name
        self.credit = credit
        self.sas_core = sas_core
        self.section_list = sections_list

    def __str__(self) -> str:
        return f"[{self.course_number}] {self.course_name}, {self.credit} credits, with {len(self.sections)} sections"

class Subject:
    def __init__(self, subject_name, courses_list:List[Course]) -> None:
        self.subject_name = subject_name
        self.course_list = courses_list
