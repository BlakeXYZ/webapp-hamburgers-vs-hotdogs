import coolname
import hashlib
import random

def print_random_name(session_id):
    random.seed(int(hashlib.sha256(session_id.encode()).hexdigest(), 16))
    while True:
        name = coolname.generate_slug(2)
        parts = name.split('-')
        if parts[0][0] == parts[1][0]:
            name = name.replace('-', '_')
            return name

