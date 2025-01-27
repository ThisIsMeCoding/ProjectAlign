from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import CustomUser, Project, Invitation
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import json
import uuid
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

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
        for participant_email in participants:
           token = str(uuid.uuid4())
           Invitation.objects.create(project=project, email=participant_email, token=token)
           # Email content
           subject = "You’ve been invited to join a project!"
           message = f"""
           Hi,
           You’ve been invited to join the project "{title}" on ProjectAlign.
           Click the link below to accept the invitation:
           http://127.0.0.1:8000/projects/invitations/accept/{token}/
           If you don’t want to join, you can ignore this email.
           Regards,
           ProjectAlign Team
           """
           send_mail(subject, message, "projectalign75@gmail.com", [participant_email])
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

    participants = data.get("participants", [])
    # Add participants to the project
    participants = data.get("participants", [])
    for participant_email in participants:
            try:
                # Validate email format
                validate_email(participant_email)

                # Check for existing invitations and avoid duplicates
                if not Invitation.objects.filter(project=project, email=participant_email).exists():
                    # Generate a unique token for the invitation
                    token = str(uuid.uuid4())
                    Invitation.objects.create(project=project, email=participant_email, token=token)

                    # Email content
                    subject = "You’ve been invited to join a project!"
                    message = f"""
                    Hi,

                    You’ve been invited to join the project "{project.title}" on ProjectAlign.

                    Click the link below to accept the invitation:
                    http://127.0.0.1:8000/projects/invitations/accept/{token}/

                    If you don’t want to join, you can ignore this email.

                    Regards,
                    ProjectAlign Team
                    """
                    # Send the invitation email
                    send_mail(subject, message, "projectalign75@gmail.com", [participant_email])

            except ValidationError:
                # Ignore invalid emails and proceed with others
                continue

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
    
    participants = [project.project_owner.username] + [p.username for p in project.participants.all()]
    isOwner = request.user == project.project_owner

    data = {
        "id": project.id,
        "name": project.title,
        "owner": project.project_owner.username,
        "dueDate": project.due_date,
        "description":project.description,
        "progress": project.progress,
        "participants": participants,
        "isOwner": isOwner
    }
    return JsonResponse(data, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def accept_invitation(request, token):
    try:
        invitation = Invitation.objects.get(token=token, is_accepted=None)
        user = request.user

        # Add user to the project
        invitation.project.participants.add(user)
        invitation.is_accepted = True
        invitation.save()

        return JsonResponse({"message": "Invitation accepted!"}, status=200)

    except Invitation.DoesNotExist:
        return JsonResponse({"error": "Invalid or expired invitation."}, status=400)


@api_view(["GET"])
def decline_invitation(request, token):
    try:
        invitation = Invitation.objects.get(token=token, is_accepted=None)
        invitation.is_accepted = False
        invitation.save()
        return JsonResponse({"message": "Invitation declined."}, status=200)

    except Invitation.DoesNotExist:
        return JsonResponse({"error": "Invalid or expired invitation."}, status=400)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_invitations(request):
    invitations = Invitation.objects.filter(email=request.user.email, is_accepted=None)
    data = [
        {
            "project": invitation.project.title,
            "owner": invitation.project.project_owner.username,
            "token": invitation.token,
        }
        for invitation in invitations
    ]
    return JsonResponse(data, safe=False)

