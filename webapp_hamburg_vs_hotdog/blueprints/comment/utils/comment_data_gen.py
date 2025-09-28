import coolname
import hashlib
import random
from datetime import datetime, timezone

def build_session_ids_coolname(session_id):
    random.seed(int(hashlib.sha256(session_id.encode()).hexdigest(), 16))
    while True:
        name = coolname.generate_slug(2)
        parts = name.split('-')
        if parts[0][0] == parts[1][0]:
            name = name.replace('-', '_')
            return name

def build_session_ids_vote_color(session_id):
    

# using comment.timestamp: 2025-09-23 00:00:25 and time now. return: "ago time
def build_comment_time_ago(timestamp):
    
    # Make timestamp timezone-aware if it isn't already
    if timestamp.tzinfo is None:
        timestamp = timestamp.replace(tzinfo=timezone.utc)

    now = datetime.now(timezone.utc)
    diff = now - timestamp


    seconds = diff.total_seconds()
    minutes = seconds / 60
    hours = minutes / 60
    days = hours / 24
    weeks = days / 7
    months = days / 30.44  # Average month length in days
    years = days / 365.25  # Average year length in days

    if seconds < 60:
        return f"{int(seconds)} seconds ago" if int(seconds) != 1 else "1 second ago"
    elif minutes < 60:
        return f"{int(minutes)} minutes ago" if int(minutes) != 1 else "1 minute ago"
    elif hours < 24:
        return f"{int(hours)} hours ago" if int(hours) != 1 else "1 hour ago"
    elif days < 7:
        return f"{int(days)} days ago" if int(days) != 1 else "1 day ago"
    elif weeks < 4:
        return f"{int(weeks)} weeks ago" if int(weeks) != 1 else "1 week ago"
    elif months < 12:
        return f"{int(months)} months ago" if int(months) != 1 else "1 month ago"
    else:
        return f"{int(years)} years ago" if int(years) != 1 else "1 year ago"

