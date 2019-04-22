import unittest
import HtmlTestRunner
from case.test_start_pomodoro import TestStartPomodoro
from case.test_stop_pomodoro import TestStopPomodoro
from case.test_report import TestReport

def pomodoroSuite():
    suite = unittest.TestSuite()
    
    tests = [
        TestStartPomodoro("test_start_pomodoro_not_associate"),
        TestStartPomodoro("test_start_pomodoro_associate"),
        TestStartPomodoro("test_start_pomodoro_associate_break_stop"),
        TestStartPomodoro("test_start_pomodoro_associate_break_continue"),
        TestStartPomodoro("test_start_pomodoro_no_associate_break"),
        TestStopPomodoro("test_stop_pomodoro_associate_no_log"),
        TestStopPomodoro("test_stop_pomodoro_associate_do_log"),
        TestStopPomodoro("test_stop_pomodoro_not_associated"),
        TestReport("test_both_checked"),
        TestReport("test_total_hours_unchecked"),
        TestReport("test_completed_pomodoros_unchecked"),
        TestReport("test_both_unchecked"),
    ]
    suite.addTests(tests)

    return suite