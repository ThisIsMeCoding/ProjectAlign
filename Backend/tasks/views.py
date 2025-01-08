import json
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Task, Project
from users.models import CustomUser

# Create a task
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task(request):
    data = request.data
    title = data.get("title")
    description = data.get("description")
    project_title = data.get("project")
    assigned_to_username = data.get("assigned_to")
    due_date = data.get("due_date")

    project = get_object_or_404(Project, title=project_title)
    if project.project_owner != request.user:
        return Response({"error": "Only the project owner can create tasks"}, status=status.HTTP_403_FORBIDDEN)

    assigned_to = CustomUser.objects.filter(username=assigned_to_username).first()

    task = Task.objects.create(
        title=title,
        description=description,
        project=project,
        assigned_to=assigned_to,
        due_date=due_date,
        status="toDo"
    )
    return Response({"message": "Task created successfully", "task_id": task.id}, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_task_status(request, task_id):
    data = request.data
    new_status = data.get("status")

    if new_status not in ["toDo", "ongoing", "done"]:
        return Response({"error": "Invalid status value"}, status=status.HTTP_400_BAD_REQUEST)

    task = get_object_or_404(Task, id=task_id)

    if task.project.project_owner != request.user and request.user not in task.project.participants.all():
        return Response({"error": "You don't have permission to update this task"}, status=status.HTTP_403_FORBIDDEN)

    task.status = new_status
    task.save()
    return Response({"message": "Task status updated successfully"}, status=status.HTTP_200_OK)

# Delete a task
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)

    if task.project.project_owner != request.user:
        return Response({"error": "Only the project owner can delete this task"}, status=status.HTTP_403_FORBIDDEN)

    task.delete()
    return Response({"message": "Task deleted successfully!"}, status=status.HTTP_200_OK)

# Update task
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_task(request, task_id):
    data = request.data
    task = get_object_or_404(Task, id=task_id)

    if task.project.project_owner != request.user:
        return Response({"error": "Only the project owner can update this task"}, status=status.HTTP_403_FORBIDDEN)

    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.due_date = data.get("due_date", task.due_date)
    task.status = data.get("status", task.status)
    task.save()
    return Response({"message": "Task updated successfully!"}, status=status.HTTP_200_OK)

# List tasks
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_tasks(request):
    tasks = Task.objects.filter(assigned_to=request.user)
    data = [{
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "project": t.project.title,  
        "status": t.status,
        "due_date": t.due_date
    } for t in tasks]
    return Response(data, status=status.HTTP_200_OK)

# List all tasks for a specific project if the user is a participant or the owner
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_project_tasks(request, project_id):
    project = get_object_or_404(Project, id=project_id)

    # Check if the user is the owner or a participant in the project
    if project.project_owner != request.user and request.user not in project.participants.all():
        return Response({"error": "You don't have permission to view tasks for this project"}, status=status.HTTP_403_FORBIDDEN)

    tasks = Task.objects.filter(project=project)
    data = [{
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "status": t.status,
        "due_date": t.due_date,
        "assigned_to": t.assigned_to.username if t.assigned_to else None
    } for t in tasks]

    return Response(data, status=status.HTTP_200_OK)
