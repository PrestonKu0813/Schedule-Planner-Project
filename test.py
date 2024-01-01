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

driver.get("https://sis.rutgers.edu/soc/#courses?subject=620&semester=12024&campus=NB&level=U")

#"/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div[1]/div/div/div[3]/div[2]/div[2]/div[1]/div[2]/span[5]"
"/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div[1]/div/div/div[3]/div[2]/div[2]/div[2]/div[2]/span[5]"
"/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div[1]/div/div/div[3]/div[2]/div[2]/div[1]/div/span[5]"

#"/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div["+str(course)+"]/div/div/div[3]/div[2]/div[2]/div["+str(section)+"]/div[2]/span[5]"
#testing

def test():
    wait = WebDriverWait(driver, timeout=30)
    wait.until(lambda d : driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div[0]/div/div/div[3]/div[2]/div[2]/div[1]/div[2]/span[5]"))

    instructor = driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div/div[0]/div/div/div[3]/div[2]/div[2]/div[1]/div[2]/span[5]")
    print(instructor.get_attribute("textContent"))



    # if instructor.get_attribute("textContent") == None:
    #     return "no instructor given"
    # else:
    #     return instructor.get_attribute("textContent")

test()
driver.quit()

