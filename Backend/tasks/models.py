from django.db import models
from projects.models import Project
from users.models import CustomUser

# Create your models here.
class Task(models.Model):
    STATUS_CHOICES=[
        ("toDo", "To Do"),
        ("ongoing", "Ongoing"),
        ("done", "Done"),
    ]
    title=models.CharField(max_length=255)
    description=models.TextField(blank=True)
    project=models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    assigned_to=models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    due_date=models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="toDo")
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


