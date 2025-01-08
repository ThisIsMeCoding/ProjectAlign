from django.contrib import admin
from .models import Task

class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'assigned_to', 'due_date', 'status')
    search_fields = ('title', 'project__name', 'assigned_to__username')
    list_filter = ('status', 'due_date')

admin.site.register(Task, TaskAdmin)