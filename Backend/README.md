# ProjectAlign
## Implementation
### 1- Setup the virtual environment:
```bash
python -m venv myvirtualenv  # Create the virtual environment
myvirtualenv\Scripts\activate  # Activate the virtual environment
```
### 2- Install Django and create the Django project
```bash
pip install django
django-admin startproject ProjectAlign
```
### 3- Create the core applications
```bash
python manage.py startapp users
python manage.py startapp projects
python manage.py startapp tasks
```

