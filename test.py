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

driver.get("https://sis.rutgers.edu/soc/#subjects?semester=12024&campus=NB&level=U")

#"/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div[1]/div/div/div[3]/div[2]/div[2]/div[1]/div[2]/span[5]"
"/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div[1]/div/div/div[3]/div[2]/div[2]/div[2]/div[2]/span[5]"
"/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div[1]/div/div/div[3]/div[2]/div[2]/div[1]/div/span[5]"

#"/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[3]/div[2]/div[2]/div["+str(section)+"]/div[2]/span[5]"
#testing

def test():
    for i in range(1,6):
        wait = WebDriverWait(driver, timeout=30)
        wait.until(lambda d : driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(i)+"]/div/div/div[3]/div[2]/div[2]/div[1]/div[2]/span[5]"))

        section_number = driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(i)+"]/div/div/div[3]/div[2]/div[2]/div[1]/div[2]/span[5]")


        print(section_number.get_attribute("textContent"))

    wait = WebDriverWait(driver, timeout=30)
    wait.until(lambda d : driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div[1]/div/div/div[3]/div[2]/div[2]/div[1]/div[2]/span[5]"))

    section_number = driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div[1]/div/div/div[3]/div[2]/div[2]/div[1]/div[2]/span[5]")

    if section_number.get_attribute("textContent") == None:
        print(True)
    else:
        print(False)

driver.quit()

