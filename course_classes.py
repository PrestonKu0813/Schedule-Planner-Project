class Section:
    def __init__(self, index_number:int, section_number:int, instructor:str, lecture_time: list, recitation:list, campus:str, classroom:str) -> None:
        self.index_number = index_number
        self.section_number = section_number
        self.instructor = instructor
        self.lecture_time = lecture_time
        self.recitation = recitation
        self.campus = campus
        self.classroom = classroom

    def __str__(self) -> str:
        return f"[{self.section_number}], taught by {self.instructor} on {self.campus}"
    

class Course:
    def __init__(self, num:str, name:str, credit:int, prereqs:str, SAS_core:str, sections_list:list = []) -> None:
        self.course_number = num
        self.course_name = name
        self.credit = credit
        self.prereqs = prereqs
        self.SAS_core = SAS_core
        self.sections = sections_list

    def __str__(self) -> str:
        return f"[{self.course_number}] {self.course_name}, {self.credit} credits, with {len(self.sections)} sections"
    
    def add_section(self, section:Section):
        self.sections.append(section)
    
    def get_sections(self):
        return self.sections
    

class Subject:
    def __init__(self, subject, courses_list:list = []) -> None:
        self.subject = subject
        self.courses = courses_list
    
    def add_course(self, course:Course):
        self.subject = course
    
    def get_courses(self):
        return self.courses