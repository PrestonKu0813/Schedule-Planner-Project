from typing import List

class Section:
    def __init__(self, index_number:int, section_number:int, instructor:str, lecture_info:List[str]) -> None:
        self.index_number = index_number
        self.section_number = section_number
        self.instructor = instructor
        self.lecture_day = lecture_info[0]
        self.lecture_time = lecture_info[1]
        self.campus = lecture_info[2]
        self.recitation = lecture_info[3]
        self.classroom = lecture_info[4]
        self.classroom_link = lecture_info[5]

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
