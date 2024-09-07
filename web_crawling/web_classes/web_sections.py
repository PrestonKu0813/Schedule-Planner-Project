from typing import List
import selenium
from selenium import webdriver
import selenium.webdriver
import selenium.webdriver.chrome
import selenium.webdriver.chrome.webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement

class WebSection:
    #SECTION INFORMATION
    def sectionClass(self, courseID:WebElement) -> List[WebElement]:
        sectionClass = courseID.find_elements(By.CLASS_NAME, "sectionData")
        return sectionClass

    def sectionID(self, driver:webdriver.Chrome, sectionClass:WebElement) -> WebElement:
        id = sectionClass.get_attribute("id")
        sectionID = driver.find_element(By.ID, id)
        return sectionID

    def indexNumber(self, sectionID:WebElement) -> str:
        indexNumber = sectionID.find_element(By.CLASS_NAME, "sectionIndexNumber")
        return indexNumber.get_attribute("textContent")

    def sectionNumber(self, sectionID:WebElement) -> str: 
        sectionNumber = sectionID.find_element(By.ID, str(sectionID.get_attribute("id"))+".number.span")
        return sectionNumber.get_attribute("textContent")

    def instructor(self, sectionID:WebElement) -> str:
        instructor = sectionID.find_element(By.CLASS_NAME, "instructors")

        if instructor.get_attribute("textContent") == "":
            return -1
        else:
            return instructor.get_attribute("textContent")

    #consider 3 cases:
        #Asynchronous content and Online
        #Online Lecture/Classes
        #Recitation

    # lecture_day = lecture_info.find_element(By.CLASS_NAME, "meetingTimeDay").get_attribute("textContent")
    # lecture_time = lecture_info.find_element(By.CLASS_NAME, "meetingTimeHours").get_attribute("textContent")
    # campus = lecture_info.find_element(By.CLASS_NAME, "meetingTimeCampus").get_attribute("textContent")
    # recitation = 0
    # classroom_info = lecture_info.find_element(By.CLASS_NAME, "meetingTimeBuildingAndRoom")

    def lectureInfo(self, sectionID:WebElement) -> List[List[str]]:
        lectureInfoArray = []
        lengthInfo = sectionID.find_element(By.ID, str(sectionID.get_attribute("id"))+".meetingTimes.divOuter")
        length = len(lengthInfo.find_elements(By.TAG_NAME, "div"))

        for i in range(0, length):
            lectureInfo = sectionID.find_element(By.ID, str(sectionID.get_attribute("id"))+".meetingTimes.divInner"+str(i))
            if lectureInfo.find_element(By.XPATH, "./span").get_attribute("textContent") == "Asynchronous content" and lectureInfo.find_element(By.XPATH, "./span[2]").get_attribute("textContent") == "Online":
                lectureDay = "Asynchronous content"
                lectureTime = -1
                campus = "Online"
                recitation = 0
                classroom = -1
                classroomLink = -1
            elif lectureInfo.find_element(By.XPATH, "./span").get_attribute("textContent") == "Hours by arrangement":
                lectureDay = "Hours by arrangement"
                lectureTime = -1
                campus = -1
                recitation = 0
                classroom = -1
                classroomLink = -1
            else:
                if "recitation" in lectureInfo.find_element(By.XPATH, "./span").get_attribute("class"):
                    recitation = 1
                else:
                    recitation = 0

                lectureDay = lectureInfo.find_element(By.ID, lectureInfo.get_attribute("id")+".dayName").get_attribute("textContent")
                lectureTime = lectureInfo.find_element(By.ID, lectureInfo.get_attribute("id")+".hours").get_attribute("textContent")
                campus = lectureInfo.find_element(By.ID, lectureInfo.get_attribute("id")+".campus").get_attribute("textContent")
                classroomInfo = lectureInfo.find_element(By.ID, lectureInfo.get_attribute("id")+".building")

                if classroomInfo.get_attribute("textContent") == "":
                    classroom = -1
                    classroomLink = -1
                else:
                    classroom = classroomInfo.get_attribute("textContent")
                    classroomLink = classroomInfo.find_element(By.TAG_NAME, "a").get_attribute("href")
            
            lectureInfoInnerArray = [lectureDay, lectureTime, campus, recitation, classroom, classroomLink]
            lectureInfoArray.append(lectureInfoInnerArray)

        return lectureInfoArray