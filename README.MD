# ProjectAlign  
**A project management tool for students**

ProjectAlign is a web application designed to help students collaborate effectively on group projects. It streamlines task management, progress tracking, and communication, making teamwork easier and more organized.  

## Technology Stack  
### Backend  
- **Python**: Core programming language.  
- **Django**: Web framework for backend development.  
- **Django REST Framework (DRF)**: API development.  

### Frontend  
- **React**: Dynamic and responsive user interface.  
- **Axios**: API communication with the backend.  

### Database  
- **SQLite** (Development): Lightweight and easy-to-use for local testing.  
- **PostgreSQL** (Production): Scalable and robust database for hosting.  

## System Architecture  
ProjectAlign is built on a modular, three-layered architecture:  

1. **Backend**: Provides APIs for user authentication, project and task management, and email handling.  
2. **Frontend**: A React-based interface for user interaction, integrated with the backend using Axios.  
3. **Database**: Stores user, project, and task data with proper relationships and constraints.  