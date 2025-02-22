from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_project, name="create_project"),
    path("<int:project_id>/update/", views.update_project, name="update_project"),
    path("<int:project_id>/delete/", views.delete_project, name="delete_project"),
    path("list/", views.list_projects, name="list_projects"),
    path("<int:project_id>/details/",views.project_details, name="project_details"),
    path("invitations/accept/<str:token>/", views.accept_invitation, name="accept_invitation"),
    path("invitations/decline/<str:token>/", views.decline_invitation, name="decline_invitation"),
    path("invitations/list/", views.list_invitations, name="list_invitations"),
]
