from course_classes import Section, Course, Subject, Lecture
from firebase.firebase import DatabaseConn
from typing import List
import selenium
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.remote.webelement import WebElement

options = webdriver.ChromeOptions()
options.add_experimental_option("detach",True)

driver = webdriver.Chrome(options=options)
driver.get("https://sis.rutgers.edu/soc/#keyword?keyword=HISTORY%20OF%20LABOR%20AND%20WORK%20IN%20THE%20U.S.%201880%20TO%201945&semester=12024&campus=NB&level=U")

#SECTION INFORMATION
def section_class(course_id:WebElement) -> List[WebElement]:
    section_class = course_id.find_elements(By.CLASS_NAME, "sectionData")
    return section_class

def section_id(section_class:WebElement) -> WebElement:
    id = section_class.get_attribute("id")
    section_id = driver.find_element(By.ID, id)
    return section_id

def index_number(section_id:WebElement) -> str:
    index_number = section_id.find_element(By.CLASS_NAME, "sectionIndexNumber")
    return index_number.get_attribute("textContent")

def section_number(section_id:WebElement) -> str: 
    section_number = section_id.find_element(By.ID, str(section_id.get_attribute("id"))+".number.span")
    return section_number.get_attribute("textContent")

def instructor(section_id:WebElement) -> str:
    instructor = section_id.find_element(By.CLASS_NAME, "instructors")

    if instructor.get_attribute("textContent") == "":
        return -1
    else:
        return instructor.get_attribute("textContent")

def lecture_info(section_id:WebElement) -> List[List[str]]:
    lecture_info_array = []
    length_info = section_id.find_element(By.ID, str(section_id.get_attribute("id"))+".meetingTimes.divOuter")
    length = len(length_info.find_elements(By.TAG_NAME, "div"))

    for i in range(0, length):
        lecture_info = section_id.find_element(By.ID, str(section_id.get_attribute("id"))+".meetingTimes.divInner"+str(i))
        if lecture_info.find_element(By.XPATH, "//span").get_attribute("textContent") == "Asynchronous content" and lecture_info.find_element(By.XPATH, "//span[2]").get_attribute("textContent") == "Online":
            lecture_day = "Asynchronous content"
            lecture_time = -1
            campus = "Online"
            recitation = -1
            classroom = -1
            classroom_link = -1
        else:
            lecture_day = lecture_info.find_element(By.CLASS_NAME, "meetingTimeDay").get_attribute("textContent")
            lecture_time = lecture_info.find_element(By.CLASS_NAME, "meetingTimeHours").get_attribute("textContent")
            campus = lecture_info.find_element(By.CLASS_NAME, "meetingTimeCampus").get_attribute("textContent")
            classroom_info = lecture_info.find_element(By.CLASS_NAME, "meetingTimeBuildingAndRoom")
            if classroom_info.get_attribute("textContent") == "":
                classroom = -1
                classroom_link = -1
            else:
                classroom = classroom_info.get_attribute("textContent")
                classroom_link = classroom_info.find_element(By.TAG_NAME, "a").get_attribute("href")
        
        lecture_info_inner_array = [lecture_day, lecture_time, campus, recitation, classroom, classroom_link]
        lecture_info_array.append(lecture_info_inner_array)

    return lecture_info_array

#COURSE INFORMATION
def course_class() -> List[WebElement]:
    wait = WebDriverWait(driver, timeout=30)
    wait.until(lambda d : driver.find_element(By.CLASS_NAME, "subject"))

    course_class = driver.find_elements(By.CLASS_NAME, "subject")
    return course_class

def course_id(subject_class:WebElement) -> WebElement:
    id = subject_class.get_attribute("id")
    course_id = driver.find_element(By.ID, id)
    return course_id

def course_info(course_id:WebElement) -> List[WebElement]:  #return course name and number
    course_info = course_id.find_elements(By.CLASS_NAME, "highlighttext")
    return course_info 
    #odd index: course number
    #even index: course name
    
def credit(course_id:WebElement) -> str:
    credit = course_id.find_element(By.CLASS_NAME, "courseCredits")
    return credit.get_attribute("textContent")

def core_code(course_id:WebElement) -> str:
    try:
        core_code = course_id.find_element(By.CLASS_NAME, "coreCodes")
        return core_code.get_attribute("textContent")
    except:
        return -1

#SUBJECT INFORMATION
def subject_list() -> List[str]:
    subject_array = []

    wait = WebDriverWait(driver, timeout=30)
    wait.until(lambda d : driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[1]/div[1]/div[1]/div[3]/div[1]/div/div[1]/input"))

    drop_down = driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[1]/div[1]/div[1]/div[3]/div[1]/div/div[1]/input")
    drop_down.click()

    wait = WebDriverWait(driver, timeout=30)
    wait.until(lambda d : driver.find_element(By.XPATH, "/html/body/div[7]/div[1]/div[1]"))

    count = 2
    while True:
        try:
            subject_list = driver.find_element(By.XPATH, "/html/body/div[7]/div[1]/div["+str(count)+"]")
            subject_array.append(subject_list.get_attribute("textContent"))
            count+=1
        except:
            break
    return subject_array

#READ DATA
def all_subjects(): #information of all the subjects
    result_subjects = []
    subjects = subject_list()
    for subject in subjects:
        driver.get("https://sis.rutgers.edu/soc/#courses?subject="+str(subject)+"&semester=12024&campus=NB&level=U")
        result = Subject(subject, all_courses())
        result_subjects.append(result)
    return result_subjects

def all_courses() -> List[Course]:
    result_courses = []
    classes = course_class()
    for i in range(len(classes)):
        ids = course_id(classes[i])
        course_infos = course_info(ids)
        course_number = course_infos[0]
        course_name = course_infos[1]
        result = Course(course_number, course_name, credit(ids), core_code(ids), all_sections(ids))
        result_courses.append(result)
    return result_courses

def all_sections(course_id:WebElement) -> List[Section]:
    result_sections = []
    classes = section_class(course_id)
    for i in range(len(classes)):
        ids = section_id(classes[i])
        result = Section(index_number(ids), section_number(ids), instructor(ids), lecture_class(ids))
        result_sections.append(result)
    return result_sections

def lecture_class(course_id:WebElement) -> List[Lecture]:
    lecture_class_array = []
    read_lecture_info = lecture_info(course_id)
    for i in range(len(read_lecture_info)):
        result = Lecture(read_lecture_info[i][0], read_lecture_info[i][1], 
                         read_lecture_info[i][2],read_lecture_info[i][3],
                         read_lecture_info[i][4], read_lecture_info[i][5])
        lecture_class_array.append(result)
    return lecture_class_array

def firebase():
    data = all_subjects()
    firebase = DatabaseConn()
    firebase.post_data(data)

def test():
    test_subject = course_class()
    for i in range(0, 3): #len(test_subject)
        id = course_id(test_subject[i])
        course_infos = course_info(id)
        print(course_infos[0].get_attribute("textContent"))
        print(course_infos[1].get_attribute("textContent"))
        print(credit(id))
        print(core_code(id))
        section_classes = section_class(id)
        for j in range(0, 3): #len(section_classes)
            try:
                section_ids = section_id(section_classes[j])
                print(section_ids.get_attribute("id"))
                print(index_number(section_ids))
                print(section_number(section_ids))
                print(instructor(section_ids))
            except:
                continue

def test_function():
    test_subject = course_class()
    id = test_subject[0]
    section_class_list = section_class(id)
    section_ids = section_id(section_class_list[10])
    print(section_ids.get_attribute("id"))
    time_info = lecture_info(section_ids)
    for i in range(len(time_info)):
        for j in range(len(time_info[i])):
            print(time_info[i][j])

test_function()
driver.quit()