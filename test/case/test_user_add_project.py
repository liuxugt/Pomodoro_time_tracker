import time
import unittest
from utils.myselenium import MySelenium
from utils.config import Config
from utils.log import logger
from utils.generator import *
from utils.scripts import *

class TestUserAddProject(unittest.TestCase):

    def setUp(self):
        self.selenium = MySelenium('Chrome')
        self.driver = self.selenium.driver
        self.base_url = Config().get('URL')
        # Variables
        self.user_first_name = random_first_name()
        self.user_last_name = random_last_name()
        self.user_email = random_email()
        self.project_name = random_project_name()
        # Scripts
        admin_create_new_user_logout(self)
        login_as_user(self)
        time.sleep(1)
            
    def tearDown(self):
        clean_up(self)
        self.driver.close()

    def test_user_add_new_project_with_non_exist_name(self):
        """
            Test add a new project
        """
        driver = self.driver


        # Click create new user button to show modal
        create_project_button = driver.find_element_by_id("create_project_button")
        create_project_button.click()
        time.sleep(1)

        # Check CreateModal is pop up
        create_modal = self.selenium.is_element_exist("id", "create_project_modal")

        # Type in project name
        create_project_name = driver.find_element_by_id("create_project_name")

        create_project_name.send_keys(self.project_name)

        # click "create" button
        confirm_create_project_button = driver.find_element_by_id("confirm_create_project_button")
        confirm_create_project_button.click()
        time.sleep(1)

        # look for the user just generated
        new_project_name = self.selenium.is_element_exist("xpath", "//tr[td[contains(text(), '{}')]]".format(self.project_name))

        self.assertTrue(new_project_name)

    def test_user_add_project_with_exist_name(self):
        driver = self.driver

        # Add first project
        user_add_project(self)

        time.sleep(1)
        
        # Test add another project with same name
        user_add_project(self)
        
        # check error_msg
        is_error_modal = self.selenium.is_element_exist("id", "error_modal")
        self.assertTrue(is_error_modal)
        if is_error_modal:
            error_modal = driver.find_element_by_id("error_modal")
            error_msg = driver.find_element_by_xpath("//div[@id='error_modal']/div/div[2]").text
            self.assertEqual(error_msg, "Request failed with status code 409")