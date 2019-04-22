import os
import platform
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from selenium.common.exceptions import NoSuchElementException     
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from utils.config import DRIVER_PATH

class MySelenium:
	def __init__(self, browser):
		chrome_options = Options()
		chrome_options.add_argument("--headless")
		chrome_options.add_argument("--window-size=1920x1080")

		system = platform.system()
		if browser == 'Firefox':
			driver = webdriver.Firefox()
		elif browser == 'Chrome':
			if system == 'Windows':
				driver = webdriver.Chrome(chrome_options=chrome_options, executable_path=os.path.join(DRIVER_PATH, 'chromedriver_win32', 'chromedriver'))
			elif system == 'Darwin':
				driver = webdriver.Chrome(chrome_options=chrome_options, executable_path=os.path.join(DRIVER_PATH, 'chromedriver_mac', 'chromedriver'))
			else:
				driver = webdriver.Chrome(chrome_options=chrome_options, executable_path=os.path.join(DRIVER_PATH, 'chromedriver_linux', 'chromedriver'))
		else:
			raise NameError('Only support firefox and Chrome')
		self.driver = driver

	def is_element_exist(self, method, location):
		try:
			if method == 'id':
				elements = self.driver.find_element_by_id(location)
			elif method == 'class':
				elements = self.driver.find_element_by_class_name(location)
			elif method == 'css':
				elements = self.driver.find_element_by_css_selector(location)
			elif method == 'name':
				elements = self.driver.find_element_by_name(location)
			elif method == 'link':
				elements = self.driver.find_element_by_link_text(location)
			elif method == 'tag':
				elements = self.driver.find_element_by_tag_name(location)
			elif method == 'xpath':
				elements = self.driver.find_element_by_xpath(location)
			else:
				raise NameError("Please enter the  elements,'id','name','class','link','xpath','css','tag'.")
				return False
		except NoSuchElementException:
			return False
		return True

	def element_wait(self,method,location,wait=6):
		if method == "id":
			WebDriverWait(self.driver,wait,1).until(EC.presence_of_element_located((By.ID, location)))
		elif method == "name":
			WebDriverWait(self.driver,wait,1).until(EC.presence_of_element_located((By.NAME, location)))
		elif method == "class":
			WebDriverWait(self.driver,wait,1).until(EC.presence_of_element_located((By.CLASS_NAME, location)))
		elif method == "link_text":
			WebDriverWait(self.driver,wait,1).until(EC.presence_of_element_located((By.LINK_TEXT, location)))
		elif method == "xpath":
			WebDriverWait(self.driver,wait,1).until(EC.presence_of_element_located((By.XPATH, location)))
		elif method == "css":
			WebDriverWait(self.driver,wait,1).until(EC.presence_of_element_located((By.CSS_SELECTOR, location)))
		else:
			raise NameError("Please enter the  elements,'id','name','class','link_text','xpath','css'.")
