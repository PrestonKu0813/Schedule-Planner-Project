from web_classes.course_classes import Section, Course, Subject, Lecture
from web_classes.web_subjects import WebSubject
from web_classes.web_courses import WebCourse
from web_classes.web_sections import WebSection
from web_classes.error_class import Error
from firebase.firebase import FirebaseConn
from preprocessing.to_JSON import create_dictionary
from typing import List
import selenium
from selenium import webdriver
from selenium.webdriver.remote.webelement import WebElement
# import os, json
# from deepdiff import DeepDiff

options = webdriver.ChromeOptions()
driver = webdriver.Chrome(options=options) 

webSubject = WebSubject()
webCourse = WebCourse()
webSection = WebSection()
error = Error()

#READ DATA
def oneSubject(subjectName, subjectNumber) -> Subject: #information of one subject
    originalWindow = driver.current_window_handle
    print("pulling subject: " + subjectName)
    driver.switch_to.new_window("tab")
    driver.get("https://sis.rutgers.edu/soc/#courses?subject="+str(subjectNumber)+"&semester=92024&campus=NB&level=U")
    result = Subject(subjectName, subjectNumber, allCourses())
    print("posting subject: " + subjectName)
    driver.close()
    driver.switch_to.window(originalWindow)
    return result

def allCourses() -> List[Course]:
    resultCourses = []
    classes = webCourse.courseClass(driver)
    for i in range(len(classes)):
        ids = webCourse.courseID(classes[i], driver)
        courseInfos = webCourse.courseInfo(ids)
        courseNumber = courseInfos[0].get_attribute("textContent")
        courseName = courseInfos[1].get_attribute("textContent")
        print("pulling course: " + courseName)
        result = Course(courseNumber, courseName, webCourse.credit(ids), webCourse.coreCode(ids), allSections(ids))
        print("posting course: " + courseName)
        resultCourses.append(result)
    return resultCourses

def allSections(courseID:WebElement) -> List[Section]:
    resultSections = []
    classes = webSection.sectionClass(courseID)
    for i in range(len(classes)):
        ids = webSection.sectionID(driver, classes[i])
        print("pulling section: " + webSection.sectionNumber(ids))
        result = Section(webSection.indexNumber(ids), webSection.sectionNumber(ids), webSection.instructor(ids), lectureClass(ids))
        print("posting section: " + webSection.sectionNumber(ids))
        resultSections.append(result)
    return resultSections

def lectureClass(courseID:WebElement) -> List[Lecture]:
    lectureClassArray = []
    readLectureInfo = webSection.lectureInfo(courseID)
    for i in range(len(readLectureInfo)):
        print("pulling lecture info" + str(i))
        result = Lecture(readLectureInfo[i][0], readLectureInfo[i][1], 
                         readLectureInfo[i][2],readLectureInfo[i][3],
                         readLectureInfo[i][4], readLectureInfo[i][5])
        print("posting lecture info" + str(i))
        lectureClassArray.append(result)
    return lectureClassArray

def firebase():
    errorMessageDict = {}
    firebase = FirebaseConn()
    subjects = webSubject.subjectList(driver)
    for subject in subjects.keys():
        try:
            data = oneSubject(subjects[subject], subject)
            print("uploading suject: " + subjects[subject])
            firebase.allData(data)
            print("subject: " + subjects[subject] + " uploaded!")
        except Exception as errorMessage:
            print(errorMessage)
            print(subjects[subject])
            errorMessageDict[errorMessage] = subjects[subject]
            continue
    error.bugsDectect(errorMessageDict)

# def compare(subject:str, newSubjectDict:dict):

#     with open("firebase/data.json", "r") as file:
#         data = json.load(file)

#     # with open("firebase/data_copy.json", "r") as file:
#     #     data_copy = json.load(file)

#     oldSubjectDict = data[subject]
#     newSubjectDict = newSubjectDict[subject]

#     # data = data[subject]
#     # data_copy = data_copy[subject]
#     # result = DeepDiff(data_copy, data)

#     updateDict = DeepDiff(oldSubjectDict, newSubjectDict)
#     updateDict["item_added"] = {}
#     updateDict["item_removed"] = {}
#     updateDict["values_changed"] = {}
    
#     with open("firebase/update.json", "w") as outfile:
#         updateData = json.dump(updateDict, outfile)

# def update():
#     jsonData = {}
#     subjects = subjectList()

#     counter = 0

#     for subject in subjects.keys():
#         if counter >= 1:
#             break
        
#         data = oneSubject(subjects[subject], subject)
#         # data = one_subject("Accounting", "010")
#         print("creating suject: " + subjects[subject])
#         subjectDict = create_dictionary(data)
#         jsonData[subjects[subject]] = subjectDict
#         print("subject: " + subjects[subject] + " created!")
#         if os.path.exists("firebase/data.json"): 
#             compare(subjects[subject], jsonData)
#         else:
#             with open("firebase/data.json", "w") as outfile:
#                 json.dump(jsonData, outfile)
#         counter+=1
    

# update()

firebase()
driver.quit()