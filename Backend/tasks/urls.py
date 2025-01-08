from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_task, name="create_task"),
    path("<int:task_id>/update/", views.update_task, name="update_task"),
    path("<int:task_id>/delete/", views.delete_task, name="delete_task"),
    path("<int:task_id>/update-status/", views.update_task_status, name="update_task_status"),
    path("list/", views.list_tasks, name="list_tasks"),
    path("<int:project_id>/list/", views.list_project_tasks, name="list_project_tasks"),
]
