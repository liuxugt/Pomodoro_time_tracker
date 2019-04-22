import unittest
from utils.config import REPORT_PATH
from case.test_admin_login import TestAdminLogin
from case.test_admin_add_user import TestAdminAddUser
from case.test_admin_edit_user import TestAdminEditUser
from case.test_admin_delete_user import TestAdminDeleteUser


def adminSuite():
    suite = unittest.TestSuite()

    tests = [
        TestAdminLogin("test_admin_login_with_correct_name"),
        TestAdminLogin("test_admin_login_with_wrong_name"),
        TestAdminAddUser("test_admin_add_new_user_with_non_exist_user"),
        TestAdminAddUser("test_admin_add_user_with_exist_user"),
        TestAdminEditUser("test_admin_edit_user"),
        TestAdminDeleteUser("test_admin_delete_user_without_projects"),
        TestAdminDeleteUser("test_admin_delete_user_with_projects_confirm"),
        TestAdminDeleteUser("test_admin_delete_user_with_projects_not_confirm")
    ]
    suite.addTests(tests)
    
    return suite