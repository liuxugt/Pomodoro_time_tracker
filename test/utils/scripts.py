"""
    This file contains repetitive procedural scripts that perform certain sequence of actions
    that are necessary for a unittest but too ugly to be in those files 
"""

import time
from selenium.webdriver.support.ui import Select


def admin_create_new_user_logout(obj):
    """
        Login to admin
        Create a new random user using information in the unitest object
        Logout
    """

    # Admin login
    driver = obj.driver
    driver.get(obj.base_url + "/login")
    username_input = driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/div/input")
    placeholder = username_input.get_attribute('placeholder')
    username_input.send_keys("admin")
    submit_button = driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/button")
    submit_button.click()
    # Add a new user
    create_new_user_button = driver.find_element_by_id("create_new_user_button")
    create_new_user_button.click()
    create_modal = obj.selenium.is_element_exist("id", "create_modal")
    create_first_name = driver.find_element_by_id("create_first_name")
    create_last_name = driver.find_element_by_id("create_last_name")
    create_emal = driver.find_element_by_id("create_email")
    create_first_name.send_keys(obj.user_first_name)
    create_last_name.send_keys(obj.user_last_name)
    create_emal.send_keys(obj.user_email)
    confirm_create_new_user_button = driver.find_element_by_id("confirm_create_new_user_button")
    confirm_create_new_user_button.click()
    # Log out from admin
    logout_button = driver.find_element_by_id("logout")
    time.sleep(1)
    logout_button.click()

def login_as_user(obj):
    """
        Just ... login as an user. Using information in the unittest object.
    """
    obj.driver.get(obj.base_url + "/login")
    obj.driver.find_element_by_link_text("User").click()
    obj.driver.find_element("xpath", "//div[@id='login-tabpane-user']/form/div/input").send_keys(obj.user_email)
    obj.driver.find_element("xpath", "//div[@id='login-tabpane-user']/form/button").click()


def user_add_project(obj, another_project_name=None):
    """
        Create a project
    """
    driver = obj.driver
    time.sleep(1)
    # Click create new user button to show modal
    create_project_button = driver.find_element_by_id("create_project_button")
    create_project_button.click()
    # Check CreateModal is pop up
    create_modal = obj.selenium.is_element_exist("id", "create_project_modal")
    # Type in project name
    create_project_name = driver.find_element_by_id("create_project_name")
    create_project_name.clear()
    if another_project_name == None:
        create_project_name.send_keys(obj.project_name)
    else:
        create_project_name.send_keys(another_project_name)
    # click "create" button
    confirm_create_project_button = driver.find_element_by_id("confirm_create_project_button")
    confirm_create_project_button.click()
    time.sleep(1)


def pull_out_create_pomodoro_modal(obj):
    """
        The name tells it
    """
    driver = obj.driver
    # Click on "Pomodoro" tab
    driver.find_element_by_id("sidebar_user_Pomodoro").click()
    # Click on "Create a new pomodoro" button
    driver.find_element_by_id("create_pomodoro_button").click()

def create_session_for_project(obj):
    """
        Make a trivial session for given project
    """
    driver = obj.driver
    # Type in 1 second pomodoro
    pull_out_create_pomodoro_modal(obj)
    driver.find_element_by_id("create_second").send_keys(1)
    # Select given project
    Select(driver.find_element_by_id("project_select_box")).select_by_visible_text(obj.project_name)
    # Confirm create pomodoro
    driver.find_element_by_id("create_confirm_button").click()
    # Wait for continue modal then click "No"
    obj.selenium.element_wait("id", "decide_stop")
    driver.find_element_by_id("decide_stop").click()
    time.sleep(1)
    # Go back to project tab
    driver.find_element_by_id("sidebar_user_Projects").click()
    time.sleep(1)

def start_associated_pomodoro(obj):
    """
        The name tells it.
    """
    pull_out_create_pomodoro_modal(obj)

    driver = obj.driver
    # # Type in 10 second pomodoro
    driver.find_element_by_id("create_second").send_keys(10)
    # Select given project
    Select(driver.find_element_by_id("project_select_box")).select_by_visible_text(obj.project_name)
    # Confirm create pomodoro
    driver.find_element_by_id("create_confirm_button").click()

def start_not_associated_pomodoro(obj):
    """
        The name tells it.
    """
    pull_out_create_pomodoro_modal(obj)

    driver = obj.driver
    # Type in 10 second pomodoro
    driver.find_element_by_id("create_second").send_keys(10)
    # Select given project
    Select(driver.find_element_by_id("project_select_box")).select_by_visible_text('No association')
    # Confirm create pomodoro
    driver.find_element_by_id("create_confirm_button").click()


def make_a_session_switch_to_report(obj):
    """
        Create a session related to a project with just 1 pomodoro
    """
    pull_out_create_pomodoro_modal(obj)

    driver = obj.driver
    driver.find_element_by_id("create_second").send_keys(1)
    Select(driver.find_element_by_id("project_select_box")).select_by_visible_text(obj.project_name)
    driver.find_element_by_id("create_confirm_button").click()
    st = time.time()

    obj.selenium.element_wait("id", "decide_stop")
    driver.find_element_by_id("decide_stop").click()
    et = time.time()

    time.sleep(1)
    driver.find_element_by_id("sidebar_user_Report").click()

def clean_up(obj):
    """
        Switch to admin and delete the user just created in tearDown
    """
    driver = obj.driver
    driver.get(obj.base_url + "/login")
    driver.find_element_by_link_text("Admin").click()
    driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/div/input").send_keys('admin')
    driver.find_element("xpath", "//div[@id='login-tabpane-admin']/form/button").click()
    time.sleep(1)

    for i in ["email", "user_email"]:
        if hasattr(obj, i):
            j = getattr(obj, i)

            driver.find_element_by_id("general-search").send_keys(j)
            is_user = obj.selenium.is_element_exist("xpath", "//tr[td[contains(text(), '{}')]]//i[contains(@class, 'pe-7s-trash')]".format(j))
            if is_user:
                driver.find_element_by_xpath("//tr[td[contains(text(), '{}')]]//i[contains(@class, 'pe-7s-trash')]".format(j)).click()
                is_delete_modal = obj.selenium.is_element_exist("id", "delete_modal")
                if is_delete_modal:
                    confirm_delete_button = driver.find_element_by_id("confirm_delete")
                    confirm_delete_button.click()
                time.sleep(1)
    
    