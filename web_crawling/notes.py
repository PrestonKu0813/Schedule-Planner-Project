import selenium
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait


options = webdriver.ChromeOptions()
options.add_experimental_option("detach",True)

driver = webdriver.Chrome(options=options)
driver.get("https://sis.rutgers.edu/soc/#subjects?semester=12024&campus=NB&level=U")


search_box = driver.find_element(By.XPATH, '/html/body/main/div[2]/table/tbody/tr/td[1]/div[1]/div[1]')

#wait for the search box to load
wait = WebDriverWait(driver, timeout=30)
wait.until(lambda d : search_box.is_displayed())

#locate subject search box input (default)
# subject_search = driver.find_element(By.XPATH, '/html/body/main/div[2]/table/tbody/tr/td[1]/div[1]/div[1]/div[3]/div[1]/div/div[3]/input[1]')

#click keyword search box input
keyword_search = driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[1]/div[1]/div[1]/ul/li[3]")

wait = WebDriverWait(driver, timeout=30)
wait.until(lambda d : keyword_search.is_displayed())

#click the keyword search button
keyword_search.click()

search = driver.find_element(By.XPATH, '/html/body/main/div[2]/table/tbody/tr/td[1]/div[1]/div[1]/div[4]/div/form/input')

wait = WebDriverWait(driver, timeout=30)
wait.until(lambda d : search.is_displayed())

#search course
course = "data structure"
search.send_keys(course)
search.send_keys(Keys.RETURN) #ENTER key

wait = WebDriverWait(driver, timeout=30)
wait.until(lambda d : driver.find_element(By.XPATH, '/html/body/main/div[2]/table/tbody/tr/td[2]/div[5]/div[1]/div').is_displayed())

# close the tab
# driver.close()

#close the browser
# driver.quit()

#print web title
# print(driver.title)