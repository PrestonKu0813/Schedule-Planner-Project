from typing import List
import selenium
from selenium import webdriver
import selenium.webdriver
import selenium.webdriver.chrome
import selenium.webdriver.chrome.webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.remote.webelement import WebElement

class WebCourse:
    #COURSE INFORMATION
    def courseClass(self, driver:webdriver.Chrome) -> List[WebElement]:
        wait = WebDriverWait(driver, timeout=30)
        wait.until(lambda d : driver.find_element(By.CLASS_NAME, "subject"))

        courseClass = driver.find_elements(By.CLASS_NAME, "subject")
        return courseClass

    def courseID(self, subjectClass:WebElement, driver:webdriver.Chrome) -> WebElement:
        id = subjectClass.get_attribute("id")
        courseID = driver.find_element(By.ID, id)
        return courseID

    def courseInfo(self, courseID:WebElement) -> List[WebElement]:  #return course name and number
        courseInfo = courseID.find_elements(By.CLASS_NAME, "highlighttext")
        return courseInfo
        #odd index: course number
        #even index: course name
        
    def credit(self, courseID:WebElement) -> str:
        credit = courseID.find_element(By.CLASS_NAME, "courseCredits")
        return credit.get_attribute("textContent")

    def coreCode(self, courseID:WebElement) -> str:
        try:
            coreCode = courseID.find_element(By.CLASS_NAME, "coreCodes")
            return coreCode.get_attribute("textContent")
        except:
            return -1