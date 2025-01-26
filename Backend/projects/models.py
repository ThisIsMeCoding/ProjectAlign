from django.db import models
from users.models import CustomUser

# Create your models here.
class Project(models.Model):
    title=models.CharField(max_length=255)
    description=models.TextField(blank=True)
    project_owner=models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='owned_projects')
    participants=models.ManyToManyField(CustomUser, related_name="participating_projects", blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    due_date=models.DateField()

    def __str__(self):
        return self.title
    
    @property
    def progress(self):
        total_tasks=self.tasks.count()
        if total_tasks==0:
            return 0
        completed_tasks=self.tasks.filter(status="done").count()
        return int((completed_tasks/total_tasks)*100)

class Invitation(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="invitations")
    email = models.EmailField()
    is_accepted = models.BooleanField(null=True)  # True for accepted, False for declined, None for pending
    token = models.CharField(max_length=255, unique=True)
