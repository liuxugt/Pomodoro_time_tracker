import time
import unittest
from utils.myselenium import MySelenium
from utils.config import Config
from utils.log import logger
from utils.generator import *
from utils.scripts import *


class TestUserDeleteProject(unittest.TestCase):

    def setUp(self):
        self.selenium = MySelenium('Chrome')
        self.driver = self.selenium.driver
        self.base_url = Config().get('URL')
        # Variables
        self.user_first_name = random_first_name()
        self.user_last_name = random_last_name()
        self.user_email = random_email()
        self.project_name = random_project_name()

        admin_create_new_user_logout(self)
        login_as_user(self)
        user_add_project(self)
        time.sleep(1)

    def tearDown(self):
        clean_up(self)
        self.driver.close()

    def test_user_delete_project_without_sessions(self):
        driver = self.driver

        # delete the created project
        delete_button = driver.find_element("xpath", "//tr[td[contains(text(), '{}')]]//i[contains(@class, 'pe-7s-trash')]".format(self.project_name))
        delete_button.click()
        logger.info("click the delete button")
        time.sleep(1)

        # Check delete modal doesn't pop up
        is_delete_modal = self.selenium.is_element_exist("id", "delete_modal")
        self.assertFalse(is_delete_modal)
        logger.info("delete modal doesn't pop up")

        # Check delete success
        is_project = self.selenium.is_element_exist("xpath", "//tr[td[contains(text(), '{}')]]".format(self.project_name))
        self.assertFalse(is_project)
        logger.info("delete the project successfully")

    def test_user_delete_project_with_sessions_confirm(self):
        driver = self.driver
        create_session_for_project(self)

        # delete the created project
        delete_button = driver.find_element("xpath", "//tr[td[contains(text(), '{}')]]//i[contains(@class, 'pe-7s-trash')]".format(self.project_name))
        delete_button.click()
        logger.info("click the delete button")
        time.sleep(1)

        # Check delete modal pops up
        is_delete_modal = self.selenium.is_element_exist("id", "delete_modal")
        self.assertTrue(is_delete_modal)
        logger.info("delete modal pop up")
        time.sleep(1)

        # click confirm
        confirm_delete_button = driver.find_element_by_id("confirm_delete")
        confirm_delete_button.click()
        logger.info("click the confirm button")
        time.sleep(1)

        # Check delete success
        is_project = self.selenium.is_element_exist("xpath", "//tr[td[contains(text(), '{}')]]".format(self.project_name))
        self.assertFalse(is_project)
        logger.info("delete the project successfully")

    def test_user_delete_project_with_sessions_not_confirm(self):
        driver = self.driver        
        create_session_for_project(self)

        # delete the created project
        delete_button = driver.find_element("xpath", "//tr[td[contains(text(), '{}')]]//i[contains(@class, 'pe-7s-trash')]".format(self.project_name))
        delete_button.click()
        logger.info("click the delete button")
        time.sleep(1)

        # Check delete modal pops up
        is_delete_modal = self.selenium.is_element_exist("id", "delete_modal")
        self.assertTrue(is_delete_modal)
        logger.info("delete modal doesn't pop up")

        # click cancel
        cancel_delete_button = driver.find_element_by_id("cancel_delete")
        cancel_delete_button.click()
        logger.info("click the cancel button")
        time.sleep(1)

        # Check delete success
        is_project = self.selenium.is_element_exist("xpath", "//tr[td[contains(text(), '{}')]]".format(self.project_name))
        self.assertTrue(is_project)
        logger.info("cancel deleting the project")


