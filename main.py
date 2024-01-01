from course_classes import Section, Course, Subject
import selenium
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait

options = webdriver.ChromeOptions()
options.add_experimental_option("detach",True)

driver = webdriver.Chrome(options=options)
course = "data structure"
course.replace(" ", "%20")

driver.get("https://sis.rutgers.edu/soc/#keyword?keyword=LINEAR%20ALGEBRA&semester=12024&campus=NB&level=U")

def index_number(course, section): #tested
    wait = WebDriverWait(driver, timeout=30)
    wait.until(lambda d : driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[3]/div[2]/div[2]/div["+str(section)+"]/div[2]/span[2]"))

    index_number = driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[3]/div[2]/div[2]/div["+str(section)+"]/div[2]/span[2]")
    return index_number.get_attribute("textContent")


def section_number(course, section): #tested
    wait = WebDriverWait(driver, timeout=30)
    wait.until(lambda d : driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[3]/div[2]/div[2]/div["+str(section)+"]/div[2]/span[1]/span"))

    section_number = driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[3]/div[2]/div[2]/div["+str(section)+"]/div[2]/span[1]/span")
    return section_number.get_attribute("textContent")

def instructor(course, section):
    wait = WebDriverWait(driver, timeout=30)
    wait.until(lambda d : driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[3]/div[2]/div[2]/div["+str(section)+"]/div[2]/span[5]"))

#/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div[1]/div/div/div[3]/div[2]/div[2]/div["+str(section)+"]/div[2]/span[5]
#/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div[1]/div/div/div[3]/div[2]/div[2]/div[1]/div[2]/span[5]
#/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div[1]/div/div/div[3]/div[2]/div[2]/div[1]/div/span[5]   

    instructor = driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[3]/div[2]/div[2]/div["+str(section)+"]/div[2]/span[5]")

    if instructor.get_attribute("textContent") == None:
        return "no instructor given"
    else:
        return instructor.get_attribute("textContent")
    

def lecture_time(course, section):
    pass

def recitation(course, section):
    pass

def campus(course, section):
    pass

def classroom(course, section):
    pass


def course_name(course):
    wait = WebDriverWait(driver, timeout=30)
    wait.until(lambda d : driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[2]/span[4]/span[1]/span"))

    course_name = driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[2]/span[4]/span[1]/span")
    return course_name.get_attribute("textContent")

def credit(course):
    wait = WebDriverWait(driver, timeout=30)
    wait.until(lambda d : driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[2]/span[4]/span[2]"))

    course_name = driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[2]/span[4]/span[2]")
    return course_name.get_attribute("textContent")

def subject_list():
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
    


def all_subject_courses(): #information of all courses in one subject
    course = 0
    section: 1
    while True: 
        try:
            while True: #information of all sections in one course
                try:
                    index_number(course, section)
                    section_number(course, section)
                    instructor(course, section)
                    lecture_time(course, section)
                    recitation(course, section)
                    campus(course, section)
                    classroom(course, section)
                    section+=1
                except:
                    break
            course+=1
        except:
            break

def all_info(): #information of all the subjects
    subjects = []
    for subject in range(len(subjects)):
        driver.get("https://sis.rutgers.edu/soc/#courses?subject="+str(subject)+"&semester=12024&campus=NB&level=U")
        all_subject_courses()
        
def test(): # test succeed
    for course in range(0, 4):
        try:
            for section in range(1, 5):
                try:
                    print(index_number(course, section))
                except:
                    break
        except:
            break

print(credit(1))
print(credit(2))
driver.quit()