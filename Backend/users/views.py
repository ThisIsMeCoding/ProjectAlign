import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import logout
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from .models import CustomUser

@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            email = data.get("email", "")

            # Validate required fields
            if not username or not password:
                return JsonResponse(
                    {"username": ["This field is required."], "password": ["This field is required."]},
                    status=400
                )

            # Validate email format
            if email:
                try:
                    validate_email(email)
                except ValidationError:
                    return JsonResponse({"email": ["Enter a valid email address."]}, status=400)

            # Check if username already exists
            if CustomUser.objects.filter(username=username).exists():
                return JsonResponse({"username": ["A user with this username already exists."]}, status=400)

            # Create user
            user = CustomUser.objects.create_user(username=username, password=password, email=email)
            return JsonResponse({"message": "User registered successfully"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": "An unexpected error occurred."}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)
