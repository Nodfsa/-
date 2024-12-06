import sys
import os

# Укажите путь к директории, где находится ваш проект
project_home = '/opt/render/project/src/diodamn/Production/lock'

# Добавляем этот путь в sys.path, чтобы Python мог найти ваш проект
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Устанавливаем текущую рабочую директорию
os.chdir(project_home)

# Импортируем Flask-приложение из app.py
from app import app as application
