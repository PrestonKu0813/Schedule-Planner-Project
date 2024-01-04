from course_classes import Section, Course, Subject
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
course = "data structure"
course.replace(" ", "%20")

driver.get("https://sis.rutgers.edu/soc/#courses?subject=640&semester=12024&campus=NB&level=U")


#SECTION INFORMATION
def section_class(course_id:WebElement) -> List[WebElement]:
    section_class = course_id.find_elements(By.CLASS_NAME, "sectionData")
    return section_class

def section_id(section_class:WebElement) -> WebElement:
    id = section_class.get_attribute("id")
    section_id = driver.find_element(By.ID, id)
    return section_id


def index_number(section_id:WebElement) -> str:
    # wait = WebDriverWait(driver, timeout=30)
    # wait.until(lambda d : driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[3]/div[2]/div[2]/div["+str(section)+"]/div[2]/span[2]"))

    # index_number = driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[3]/div[2]/div[2]/div["+str(section)+"]/div[2]/span[2]")
    # return index_number.get_attribute("textContent")

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

def lecture_info(section_id:WebElement) -> List[str]:
    lecture_info_array = []
    count = 0
    while True:
        try:
            lecture_info = section_id.find_element(By.ID, str(section_id.get_attribute("id"))+".meetingTimes.divInner"+str(count))
            lecture_day = lecture_info.find_element(By.CLASS_NAME, "meetingTimeDay").get_attribute("textContent")
            lecture_time = lecture_info.find_element(By.CLASS_NAME, "meetingTimeHours").get_attribute("textContent")
            campus = lecture_info.find_element(By.CLASS_NAME, "meetingTimeCampus").get_attribute("textContent")
            classroom = lecture_info.find_element(By.CLASS_NAME, "meetingTimeBuildingAndRoom").get_attribute("textContent")
            classroom_link = lecture_info.find_element(By.CLASS_NAME, "meetingTimeBuildingAndRoom").get_attribute("href")
            lecture_info_inner_array = [lecture_day, lecture_time, campus, classroom, classroom_link]
            lecture_info_array.append(lecture_info_inner_array)
            count+=1
        except:
            break
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

    # wait = WebDriverWait(driver, timeout=30)
    # wait.until(lambda d : driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[2]/span[4]/span[1]/span"))

    # course_name = driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[2]/span[4]/span[1]/span")

    course_info = course_id.find_elements(By.CLASS_NAME, "highlighttext")

    return course_info 
    #odd index: course number
    #even index: course name
    
def credit(course_id:WebElement) -> str:
    # wait = WebDriverWait(driver, timeout=30)
    # wait.until(lambda d : driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[2]/span[4]/span[2]"))

    # course_name = driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[2]/span[4]/span[2]")

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
            count+=1
            subject_array.append(subject_list.get_attribute("textContent"))
        except:
            break
    return subject_array


def all_info(): #information of all the subjects
    subjects = subject_list()
    for subject in range(len(subjects)):
        driver.get("https://sis.rutgers.edu/soc/#courses?subject="+str(subject)+"&semester=12024&campus=NB&level=U")

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
    id = test_subject[2]
    section_class_list = section_class(id)
    section_ids = section_id(section_class_list[0])
    time_info = lecture_info(section_ids)
    for i in range(len(time_info)):
        for j in range(len(time_info[i])):
            print(time_info[i][j])
    

test_function()
driver.quit()