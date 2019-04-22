import time
import unittest
from utils.myselenium import MySelenium
from utils.config import Config
from utils.log import logger
from utils.generator import *
from utils.scripts import *


class TestUserLogin(unittest.TestCase):
    def setUp(self):
        self.selenium = MySelenium('Chrome')
        self.driver = self.selenium.driver
        self.base_url = Config().get('URL')
        # Variables
        self.user_first_name = random_first_name()
        self.user_last_name = random_last_name()
        self.user_email = random_email()

    def tearDown(self):
        clean_up(self)
        self.driver.close()

    def test_admin_login_with_existing_user(self):
        # setup script
        admin_create_new_user_logout(self)

        driver = self.driver
        driver.get(self.base_url + "/login")

        # Find tab for the user form
        user_tab = driver.find_element_by_link_text("User")
        logger.info('find user tab: ' + user_tab.text)

        # Click the user tab
        user_tab.click()
        logger.info('click the tab')
        time.sleep(1)

        # Find input for the user login
        username_input = driver.find_element("xpath", "//div[@id='login-tabpane-user']/form/div/input")

        # Check the input placeholder
        placeholder = username_input.get_attribute('placeholder')
        logger.info('find input: ' + placeholder)
        self.assertEqual(placeholder, "Enter your email")

        # type existing user email into username_input
        username_input.send_keys(self.user_email)
        logger.info('type into input: ' + username_input.get_attribute("value"))

        # find submit button
        submit_button = driver.find_element("xpath", "//div[@id='login-tabpane-user']/form/button")
        logger.info('find button: ' + submit_button.text)

        # click "submit" button
        submit_button.click()
        logger.info('click button')
        time.sleep(1)

        # Check url is "/dashboard" and username is "jack.jones1@gmail.com"
        curURL = driver.current_url
        logger.info('curURL is: ' + curURL)
        self.assertEqual(curURL, self.base_url + "/dashboard")
        name = driver.find_element("id", "username").text
        logger.info('current username is' + name)
        self.assertEquals(name, self.user_email)

    def test_admin_login_with_non_existing_user(self):
        driver = self.driver
        driver.get(self.base_url + "/login")

        # Find tab for the user form
        user_tab = driver.find_element_by_link_text("User")
        logger.info('find user tab: ' + user_tab.text)

        # Click the user tab
        user_tab.click()
        logger.info('click the tab')
        time.sleep(1)

        # Find input for the user login
        username_input = driver.find_element("xpath", "//div[@id='login-tabpane-user']/form/div/input")

        # type non-existing user into username_input
        username_input.send_keys(random_email())
        logger.info('type into input: ' + username_input.get_attribute("value"))

        # find submit button
        submit_button = driver.find_element("xpath", "//div[@id='login-tabpane-user']/form/button")
        logger.info('find button: ' + submit_button.text)

        # click "submit" button
        submit_button.click()
        logger.info('click button')
        time.sleep(1)

        # Find alert is "User does not exist!"
        curURL = driver.current_url
        logger.info('curURL is: ' + curURL)
        self.assertEqual(curURL, self.base_url + "/login")
        # Give it a few seconds to load...
        self.selenium.element_wait("xpath", "//div[@role='alert']", 5)
        alert = driver.find_element("xpath", "//div[@role='alert']")
        logger.info('check alert is: ' + alert.text)
        self.assertEqual(alert.text, "User does not exist!")