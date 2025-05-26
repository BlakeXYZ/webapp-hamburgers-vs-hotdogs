import subprocess
import os
from datetime import date, timezone, timedelta
from dotenv import load_dotenv

# @app.shell_context_processor
# def make_shell_context():
#     return {
#   }

# Load environment variables from .env file
load_dotenv()


def running_flask_app():

    os.environ.setdefault('FLASK_APP', 'autoapp.py')  # Update if your app entry point is different

    # Command to run Flask
    command = ['flask', 'run', '--host=0.0.0.0', '--port=8080', '--reload']

    # Use subprocess to run the command
    process = subprocess.Popen(command, env=os.environ.copy())

    # Optionally, wait for the process to complete
    try:
        process.wait()
    except KeyboardInterrupt:
        process.terminate()

if __name__ == '__main__':

    running_flask_app()
    