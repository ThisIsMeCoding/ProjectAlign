# ProjectAlign Backend

The backend for **ProjectAlign**, a project management application built using **Django** and **Django REST Framework (DRF)**. This backend serves as the API layer, handling user authentication, project management, and task tracking.

## Features

- **User Authentication**:
  - Supports JWT-based authentication.
  - Endpoints for user registration, login, and logout.
  
- **Project Management**:
  - Create, update, delete, and list projects.
  - Manage participants in a project.

- **Task Management**:
  - Create, update, delete, and list tasks.
  - Drag-and-drop functionality for updating task status.

## Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.10 or later
- Django 5.1.2
- SQLite (default database)

## Installation

1. **Clone the Repository**:
   ```bash
   git clone repository-url
   cd ProjectAlign/Backend
2. **Create and Activate a Virtual Environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
3. **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
4. **Run Migrations**:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
5. **Run the Development Server**:
    ```bash
    python manage.py runserver

## API Endpoints

### Authentication
- POST /auth/register/: User registration.
- POST /auth/login/: User login (JWT-based).
- POST /auth/logout/: User logout.

### Projects 
- GET /projects/list: List all projects for a user.
- GET /projects/project_id/details: View all project details.
- POST /projects/create/: Create a new project.
- PUT /projects/project_id/update/: Update an existing project.
- DELETE /projects/project_id/delete/: Delete a project.

### Tasks
- GET /tasks/list: List all tasks for a user.
- GET /tasks/project_id/list: List all tasks for a specific project.
- POST /tasks/create/: Create a new task.
- PUT /tasks/task_id/update/: Update an existing task.
- PUT /tasks/task_id/update-status/: Update the status of an existing task.
- DELETE /tasks/task_id/delete/: Delete a task.

