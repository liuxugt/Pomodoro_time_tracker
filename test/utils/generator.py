import random
from faker import Factory

fake = Factory().create('en_us')

def random_first_name():
    return fake.first_name()

def random_last_name():
    return fake.last_name()

def random_email():
    return fake.email()

def random_project_name(min_chars=6, max_chars=10):
    return fake.pystr(min_chars=min_chars, max_chars=max_chars)