from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_project, name="create_project"),
    path("<int:project_id>/update/", views.update_project, name="update_project"),
    path("<int:project_id>/delete/", views.delete_project, name="delete_project"),
    path("list/", views.list_projects, name="list_projects"),
    path("<int:project_id>/details/",views.project_details, name="project_details"),
]
