import time
import unittest
from utils.myselenium import MySelenium
from utils.config import Config
from utils.log import logger
from utils.generator import *
from utils.scripts import *

class TestAdminAddUser(unittest.TestCase):

    def setUp(self):
        self.selenium = MySelenium('Chrome')
        self.base_url = Config().get('URL')
        self.first_name = random_first_name()
        self.last_name = random_last_name()
        self.email = random_email()
        self.driver = self.selenium.driver
        self.driver.get(self.base_url + "/login")
        self.driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/div/input").send_keys("admin")
        self.driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/button").click()
        time.sleep(1)
    
    def tearDown(self):
        clean_up(self)
        self.driver.close()

    def test_admin_add_new_user_with_non_exist_user(self):
        driver = self.driver

        # Click create new user button to show modal
        create_new_user_button = driver.find_element_by_id("create_new_user_button")
        create_new_user_button.click()
        logger.info('click the create new user button')
        time.sleep(1)

        # Check CreateModal is pop up
        create_modal = self.selenium.is_element_exist("id", "create_modal")
        self.assertTrue(create_modal)
        logger.info('create user modal pops up')

        # Type in firstname, lastname, email into inputs
        create_first_name = driver.find_element_by_id("create_first_name")
        create_last_name = driver.find_element_by_id("create_last_name")
        create_emal = driver.find_element_by_id("create_email")

        create_first_name.send_keys(self.first_name)
        create_last_name.send_keys(self.last_name)
        create_emal.send_keys(self.email)

        logger.info("input first name: " + self.first_name)
        logger.info("input last name: " + self.last_name)
        logger.info("input email: " + self.email)

        # click confirm button
        confirm_create_new_user_button = driver.find_element_by_id("confirm_create_new_user_button")
        confirm_create_new_user_button.click()
        logger.info("click submit button")
        time.sleep(1)

        # check whether the user is created successfully
        new_user_email = self.selenium.is_element_exist("xpath", "//tr[td[contains(text(), '{}')]]".format(self.email))
        self.assertTrue(new_user_email)
        logger.info("create user successfully")
        
        if new_user_email:
            new_user_first_name = driver.find_element("xpath", "//tr[td[contains(text(), '{}')]]/td[2]".format(self.email)).text
            new_user_last_name = driver.find_element("xpath", "//tr[td[contains(text(), '{}')]]/td[3]".format(self.email)).text
            self.assertEqual(new_user_first_name, self.first_name)
            self.assertEqual(new_user_last_name, self.last_name)
            logger.info("check the first name: " + new_user_first_name)
            logger.info("check the last name: " + new_user_last_name)


    def test_admin_add_user_with_exist_user(self):
        driver = self.driver

        # Click create new user button to add a new user
        create_new_user_button = driver.find_element_by_id("create_new_user_button")
        create_new_user_button.click()
        logger.info('click the create new user button')
        time.sleep(1)

        # Check CreateModal is pop up
        create_modal = self.selenium.is_element_exist("id", "create_modal")
        self.assertTrue(create_modal)
        logger.info('create user modal pops up')

        # Type in firstname, lastname, email into inputs
        create_first_name = driver.find_element_by_id("create_first_name")
        create_last_name = driver.find_element_by_id("create_last_name")
        create_emal = driver.find_element_by_id("create_email")

        create_first_name.send_keys(self.first_name)
        create_last_name.send_keys(self.last_name)
        create_emal.send_keys(self.email)

        logger.info("input first name: " + self.first_name)
        logger.info("input last name: " + self.last_name)
        logger.info("input email: " + self.email)

        # click confirm button
        confirm_create_new_user_button = driver.find_element_by_id("confirm_create_new_user_button")
        confirm_create_new_user_button.click()
        logger.info("click submit button")
        time.sleep(1)

        # Click create new user button to add the same user again
        create_new_user_button = driver.find_element_by_id("create_new_user_button")
        create_new_user_button.click()
        logger.info('click the create new user button')
        time.sleep(1)

        # Check CreateModal is pop up
        create_modal = self.selenium.is_element_exist("id", "create_modal")
        self.assertTrue(create_modal)
        logger.info('create user modal pops up')

        # Type in firstname, lastname, email into inputs
        create_first_name = driver.find_element_by_id("create_first_name")
        create_last_name = driver.find_element_by_id("create_last_name")
        create_emal = driver.find_element_by_id("create_email")

        create_first_name.send_keys(self.first_name)
        create_last_name.send_keys(self.last_name)
        create_emal.send_keys(self.email)

        logger.info("input first name: " + self.first_name)
        logger.info("input last name: " + self.last_name)
        logger.info("input email: " + self.email)

        # click confirm button
        confirm_create_new_user_button = driver.find_element_by_id("confirm_create_new_user_button")
        confirm_create_new_user_button.click()
        logger.info("click submit button")
        time.sleep(1)

        # check error_msg
        is_error_modal = self.selenium.is_element_exist("id", "error_modal")
        self.assertTrue(is_error_modal)
        logger.info('error modal pops up')
        if is_error_modal:
            error_modal = driver.find_element_by_id("error_modal")
            error_msg = driver.find_element_by_xpath("//div[@id='error_modal']/div/div[2]").text
            self.assertEqual(error_msg, "Request failed with status code 409")
            logger.info("error msg is: ", error_msg)

