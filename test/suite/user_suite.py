import unittest
import HtmlTestRunner
from case.test_user_login import TestUserLogin
from case.test_user_add_project import TestUserAddProject
from case.test_user_edit_project import TestUserEditProject
from case.test_user_delete_project import TestUserDeleteProject


def userSuite():
    suite = unittest.TestSuite()

    tests = [
        TestUserLogin('test_admin_login_with_existing_user'), 
        TestUserLogin('test_admin_login_with_non_existing_user'),
        TestUserAddProject("test_user_add_new_project_with_non_exist_name"),
        TestUserAddProject("test_user_add_project_with_exist_name"),
        TestUserEditProject('test_user_edit_project_with_non_exist_name'),
        TestUserEditProject('test_user_edit_project_with_exist_name'),
        TestUserDeleteProject('test_user_delete_project_without_sessions'),
        TestUserDeleteProject('test_user_delete_project_with_sessions_confirm'),
        TestUserDeleteProject('test_user_delete_project_with_sessions_not_confirm')
    ]
    suite.addTests(tests)

    return suite