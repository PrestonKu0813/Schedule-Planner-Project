from typing import Dict
import selenium
from selenium import webdriver
import selenium.webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait

class WebSubject:
    #SUBJECT INFORMATION
    def subjectList(self, driver:webdriver.Chrome) -> Dict[str,str]:
        subjectDict = {}

        year = 2024
        semester = 9
        driver.get("https://sis.rutgers.edu/soc/#subjects?semester="+str(semester)+str(year)+"&campus=NB&level=U")

        wait = WebDriverWait(driver, timeout=30)
        wait.until(lambda d : driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[1]/div[1]/div[1]/div[3]/div[1]/div/div[1]/input"))

        dropDown = driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[1]/div[1]/div[1]/div[3]/div[1]/div/div[1]/input")
        dropDown.click()

        wait = WebDriverWait(driver, timeout=30)
        wait.until(lambda d : driver.find_element(By.ID, "dijit_form_FilteringSelect_0_popup0"))

        length = 164

        for i in range(0, length):
            subjectList = driver.find_element(By.ID, "dijit_form_FilteringSelect_0_popup"+str(i))
            subjectName = subjectList.get_attribute("textContent").split(" (")[0].replace("/", "-")
            subjectNumber = subjectList.get_attribute("textContent").split("(")[1].removesuffix(")")
            subjectDict[subjectNumber] = subjectName

        return subjectDict