import time
import unittest
from utils.myselenium import MySelenium
from utils.config import Config
from utils.log import logger
from utils.generator import *
from utils.scripts import *

class TestAdminEditUser(unittest.TestCase):
    def setUp(self):
        self.selenium = MySelenium('Chrome')
        self.driver = self.selenium.driver
        self.base_url = Config().get('URL')
        self.first_name = random_first_name()
        self.last_name = random_last_name()
        self.email = random_email()
        self.new_first_name = random_first_name()
        self.new_last_name = random_last_name()

    def tearDown(self):
        clean_up(self)
        self.driver.close()

    def test_admin_edit_user(self):
        driver = self.driver

        # create a new user for editting
        self.driver.get(self.base_url + "/login")
        self.driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/div/input").send_keys("admin")
        self.driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/button").click()
        time.sleep(1)
        
        create_new_user_button = driver.find_element_by_id("create_new_user_button")
        create_new_user_button.click()
        time.sleep(1)

        create_first_name = driver.find_element_by_id("create_first_name")
        create_last_name = driver.find_element_by_id("create_last_name")
        create_emal = driver.find_element_by_id("create_email")

        create_first_name.send_keys(self.first_name)
        create_last_name.send_keys(self.last_name)
        create_emal.send_keys(self.email)

        confirm_create_new_user_button = driver.find_element_by_id("confirm_create_new_user_button")
        confirm_create_new_user_button.click()
        time.sleep(1)
        logger.info("create a user for editting")

        # edit the created user
        edit_button = driver.find_element("xpath", "//tr[td[contains(text(), '{}')]]//i[contains(@class, 'pe-7s-note')]".format(self.email))
        edit_button.click()
        logger.info("click edit button")
        time.sleep(1)

        # Check edit modal pops up
        is_eidt_modal = self.selenium.is_element_exist("id", "edit_modal")
        self.assertTrue(is_eidt_modal)
        logger.info("edit modal pops up")

        # edit with new firstname and new lastname
        edit_first_name = driver.find_element_by_id("edit_first_name")
        edit_last_name = driver.find_element_by_id("edit_last_name")

        edit_first_name.clear()
        edit_first_name.send_keys(self.new_first_name)
        edit_last_name.clear()
        edit_last_name.send_keys(self.new_last_name)
        logger.info("change first name: " + self.first_name + ' to ' + self.new_first_name)
        logger.info("change last name: " + self.last_name + ' to ' + self.new_last_name)

        # click confirm button
        confirm_edit_button = driver.find_element_by_id("confirm_edit")
        confirm_edit_button.click()
        time.sleep(1)
        logger.info("click confirm button")

        # check the user just modified
        editted_first_name = driver.find_element("xpath", "//tr[td[contains(text(), '{}')]]/td[2]".format(self.email)).text
        editted_last_name = driver.find_element("xpath", "//tr[td[contains(text(), '{}')]]/td[3]".format(self.email)).text

        self.assertEqual(editted_first_name, self.new_first_name)
        self.assertEqual(editted_last_name, self.new_last_name)
        logger.info("edit first name to: " + editted_first_name)
        logger.info("edit last name to: " + editted_last_name)
