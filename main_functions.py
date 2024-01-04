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

def subject_class() -> List[WebElement]:
    wait = WebDriverWait(driver, timeout=30)
    wait.until(lambda d : driver.find_element(By.CLASS_NAME, "subject"))

    subject_class = driver.find_elements(By.CLASS_NAME, "subject")
    return subject_class

def subject_id(subject_class:WebElement) -> str:
    subject_id = subject_class.get_attribute("id")
    return subject_id

def section_class(course_id:str) -> List[WebElement]:
    wait = WebDriverWait(driver, timeout=30)
    wait.until(lambda d : driver.find_element(By.ID, course_id))

    section_class_info = driver.find_element(By.ID, course_id)
    section_class = section_class_info.find_elements(By.CLASS_NAME, "sectionData")
    return section_class

def section_id(section_class:WebElement) -> str:
    section_id = section_class.get_attribute("id")
    return section_id


for i in range(0, 3):
    test = subject_class()
    course_id = subject_id(test[i])
    for j in range(0, 3):
        try:
            section_classes = section_class(course_id)
            section_ids = section_id(section_classes[j])
            print(section_ids)
        except:
            break

driver.quit()