from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import CustomUser, Project
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import json

# Create project
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_project(request):
    if request.method == "POST":
        data = json.loads(request.body)
        title = data.get("title")
        description = data.get("description", "")
        due_date = data.get("due_date")
        participants = data.get("participants", [])

        # Create the project
        project = Project.objects.create(
            title=title,
            description=description,
            project_owner=request.user,
            due_date=due_date,
        )

        # Add participants to the project
        for participant_username in participants:
            participant = CustomUser.objects.filter(username=participant_username).first()
            if participant:
                project.participants.add(participant)

        project.save()
        return JsonResponse({"message": "Project created successfully!", "id": project.id})


# Delete project
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_project(request, project_id):
    project = get_object_or_404(Project, id=project_id, project_owner=request.user)
    project.delete()
    return JsonResponse({"message": "Project deleted successfully"})


# Update project
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_project(request, project_id):
    project = get_object_or_404(Project, id=project_id, project_owner=request.user)
    data = json.loads(request.body)
    project.title = data.get("title", project.title)
    project.description = data.get("description", project.description)
    project.due_date = data.get("due_date", project.due_date)
    project.save()
    return JsonResponse({"message": "Project updated successfully"})


# List projects
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_projects(request):
    projects = Project.objects.filter(
        Q(project_owner=request.user) | Q(participants=request.user)
    ).distinct()
    data = [
        {
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "due_date": p.due_date,
            "progress": p.progress,
            "created_at": p.created_at,
            "updated_at": p.updated_at,
        }
        for p in projects
    ]
    return JsonResponse(data, safe=False)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def project_details(request, project_id):
    project = get_object_or_404(Project, id=project_id)

    if request.user != project.project_owner and request.user not in project.participants.all():
        return JsonResponse({"error": "You don't have access to this project"}, status=403)

    data = {
        "id": project.id,
        "name": project.title,
        "owner": project.project_owner.username,
        "dueDate": project.due_date,
        "progress": project.progress,
        "participants": [p.username for p in project.participants.all()]
    }
    return JsonResponse(data, status=200)