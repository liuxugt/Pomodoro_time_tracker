import time
import unittest
from utils.myselenium import MySelenium
from utils.config import Config
from utils.log import logger


class TestAdminLogin(unittest.TestCase):

    def setUp(self):
        self.selenium = MySelenium('Chrome')
        self.driver = self.selenium.driver
        self.base_url = Config().get('URL')
        self.driver.get(self.base_url + "/login")
        time.sleep(1)
    
    def tearDown(self):
        self.driver.close()

    def test_admin_login_with_correct_name(self):
        driver = self.driver

        # type "admin" into username_input
        username_input = driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/div/input")
        username_input.send_keys("admin")
        logger.info("type 'admin' into input")
        
        # click submit button
        submit_button = driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/button")
        submit_button.click()
        logger.info('click submit button')
        time.sleep(1)

        # Check url is "/dashboard" and username is "admin"
        curURL = driver.current_url
        logger.info('curURL is: ' + curURL)
        self.assertEqual(curURL, self.base_url+"/dashboard")
        name = driver.find_element("id", "username").text
        logger.info('current username is' + name)
        self.assertEquals(name, "admin")

    
    def test_admin_login_with_wrong_name(self):
        driver = self.driver

        # type "admin1" into username_input
        username_input = driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/div/input")
        username_input.send_keys("admin1")
        logger.info("type 'admin1' into input")

        # click submit button
        submit_button = driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/button")
        submit_button.click()
        logger.info('click submit button')
        time.sleep(1)

        # Find url is "/dashboard" and alert is "Enter 'admin' as the username"
        curURL = driver.current_url
        logger.info('curURL is: ' + curURL)
        self.assertEqual(curURL, self.base_url+"/login")
        is_alert = self.selenium.is_element_exist("xpath", "//div[@role='alert']")
        self.assertTrue(is_alert)
        logger.info('alert pops up')
        if is_alert:
            alert_msg = driver.find_element("xpath", "//div[@role='alert']").text
            self.assertEqual(alert_msg, "Admin name is wrong!")
            logger.info('check alert_msg is: ' + alert_msg)
        
