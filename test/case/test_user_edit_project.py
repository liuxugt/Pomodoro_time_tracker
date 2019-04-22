import time
import unittest
from utils.myselenium import MySelenium
from utils.config import Config
from utils.log import logger
from utils.generator import *
from utils.scripts import *

class TestUserEditProject(unittest.TestCase):

    def setUp(self):
        self.selenium = MySelenium('Chrome')
        self.driver = self.selenium.driver
        self.base_url = Config().get('URL')
        # Variables
        self.first_name = random_first_name()
        self.last_name = random_last_name()
        self.email = random_email()
        self.project_name = random_project_name()
        self.new_project_name = random_project_name()
            
    def tearDown(self):
        clean_up(self)
        self.driver.close()

    def test_user_edit_project_with_non_exist_name(self):
        driver = self.driver

        # create a new user
        self.driver.get(self.base_url + "/login")
        self.driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/div/input").send_keys("admin")
        self.driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/button").click()
        time.sleep(1)

        create_new_user_button = driver.find_element_by_id("create_new_user_button")
        create_new_user_button.click()

        create_first_name = driver.find_element_by_id("create_first_name")
        create_last_name = driver.find_element_by_id("create_last_name")
        create_emal = driver.find_element_by_id("create_email")

        create_first_name.send_keys(self.first_name)
        create_last_name.send_keys(self.last_name)
        create_emal.send_keys(self.email)

        confirm_create_new_user_button = driver.find_element_by_id("confirm_create_new_user_button")
        confirm_create_new_user_button.click()
        logger.info("create a user for deleting")
        time.sleep(1)
        driver.find_element_by_id("logout").click()
        time.sleep(1)

        # create a project with this user
        driver.find_element_by_link_text("User").click()
        time.sleep(1)
        driver.find_element("xpath", "//div[@id='login-tabpane-user']/form/div/input").send_keys(self.email)
        driver.find_element("xpath", "//div[@id='login-tabpane-user']/form/button").click()
        time.sleep(1)
        driver.find_element_by_id("create_project_button").click()
        driver.find_element_by_id("create_project_name").send_keys(self.project_name)
        driver.find_element_by_id("confirm_create_project_button").click()
        logger.info("create a project for the user")
        time.sleep(1)

        # edit the created project
        edit_button = driver.find_element("xpath", "//tr[td[contains(text(), '{}')]]//i[contains(@class, 'pe-7s-note')]".format(self.project_name))
        edit_button.click()
        logger.info("click edit button")
        time.sleep(1)

        # Check edit modal pops up
        is_eidt_modal = self.selenium.is_element_exist("id", "edit_modal")
        self.assertTrue(is_eidt_modal)
        logger.info("edit modal pops up")

        # edit with new project name
        edit_project_name = driver.find_element_by_id("edit_project_name")

        edit_project_name.clear()
        edit_project_name.send_keys(self.new_project_name)
        logger.info("change project name: " + self.project_name + ' to ' + self.new_project_name)

        # click confirm button
        confirm_edit_button = driver.find_element_by_id("confirm_edit")
        confirm_edit_button.click()
        time.sleep(1)
        logger.info("click confirm button")

        # check the user just modified
        is_old_project_name = self.selenium.is_element_exist("xpath", "//tr[td[contains(text(), '{}')]]/td[2]".format(self.project_name))
        self.assertFalse(is_old_project_name)
        is_new_project_name = "xpath", "//tr[td[contains(text(), '{}')]]/td[2]".format(self.new_project_name)
        self.assertTrue(is_new_project_name)
        logger.info("edit project name to: " + self.new_project_name)

    def test_user_edit_project_with_exist_name(self):
        driver = self.driver

        # create a new user
        self.driver.get(self.base_url + "/login")
        self.driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/div/input").send_keys("admin")
        self.driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/button").click()
        time.sleep(1)

        create_new_user_button = driver.find_element_by_id("create_new_user_button")
        create_new_user_button.click()

        create_first_name = driver.find_element_by_id("create_first_name")
        create_last_name = driver.find_element_by_id("create_last_name")
        create_emal = driver.find_element_by_id("create_email")

        create_first_name.send_keys(self.first_name)
        create_last_name.send_keys(self.last_name)
        create_emal.send_keys(self.email)

        confirm_create_new_user_button = driver.find_element_by_id("confirm_create_new_user_button")
        confirm_create_new_user_button.click()
        logger.info("create a user for deleting")
        time.sleep(1)
        driver.find_element_by_id("logout").click()
        time.sleep(1)

        # create two projects with this user
        driver.find_element_by_link_text("User").click()
        time.sleep(1)
        driver.find_element("xpath", "//div[@id='login-tabpane-user']/form/div/input").send_keys(self.email)
        driver.find_element("xpath", "//div[@id='login-tabpane-user']/form/button").click()
        time.sleep(1)
        driver.find_element_by_id("create_project_button").click()
        driver.find_element_by_id("create_project_name").send_keys(self.project_name)
        driver.find_element_by_id("confirm_create_project_button").click()
        logger.info("create a project for the user")
        time.sleep(1)

        driver.find_element_by_id("create_project_button").click()
        driver.find_element_by_id("create_project_name").send_keys(self.new_project_name)
        driver.find_element_by_id("confirm_create_project_button").click()
        logger.info("create another project for the user")
        time.sleep(1)

        # edit the first project with the second project name
        edit_button = driver.find_element("xpath", "//tr[td[contains(text(), '{}')]]//i[contains(@class, 'pe-7s-note')]".format(self.project_name))
        edit_button.click()
        logger.info("click edit button")
        time.sleep(1)

        # Check edit modal pops up
        is_eidt_modal = self.selenium.is_element_exist("id", "edit_modal")
        self.assertTrue(is_eidt_modal)
        logger.info("edit modal pops up")

        # edit with the exisit project name
        edit_project_name = driver.find_element_by_id("edit_project_name")
        edit_project_name.clear()
        edit_project_name.send_keys(self.new_project_name)
        logger.info("change project name: " + self.project_name + ' to ' + self.new_project_name)
        time.sleep(1)

        # click confirm button
        confirm_edit_button = driver.find_element_by_id("confirm_edit")
        confirm_edit_button.click()
        logger.info("click confirm button")
        time.sleep(1)

        # check error_msg
        is_error_modal = self.selenium.is_element_exist("id", "error_modal")
        self.assertTrue(is_error_modal)
        if is_error_modal:
            error_modal = driver.find_element_by_id("error_modal")
            error_msg = driver.find_element_by_xpath("//div[@id='error_modal']/div/div[2]").text
            self.assertEqual(error_msg, "Request failed with status code 409")