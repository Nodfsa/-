import sys
import os

# Укажите путь к вашему проекту
project_home = ''
if project_home not in sys.path:
    sys.path.insert(0, project_home)
    
os.chdir(project_home)

from app import app as application
