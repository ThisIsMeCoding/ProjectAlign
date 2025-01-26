import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import logout
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .utils import account_activation_token
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

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
            user.is_active = False
            user.save()

            print(f"User created: {user.username}, email: {user.email}")


            # Send email verification
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = account_activation_token.make_token(user)
            activation_link = f"http://127.0.0.1:8000/auth/activate/{uid}/{token}/"
            print(f"Activation link: {activation_link}")

            subject = "Activate your ProjectAlign account"
            print("message:", subject)
            message = f"""
            Hi {user.username},

            Welcome to ProjectAlign!

            Please click the link below to activate your account:
            {activation_link}

            If you did not sign up for this account, you can ignore this email.

            Regards,
            The ProjectAlign Team
            """


            try:
                send_mail(subject, message, "projectalign75@gmail.com", [user.email], fail_silently=False)
                print(f"Email sent to {user.email}")  # Debugging output
            except Exception as e:
                print(f"Error sending email: {e}")   # Log the error

            return JsonResponse({"message": "User registered successfully. Please check your email to activate your account."}, status=201)
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": "An unexpected error occurred."}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def activate_user(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = CustomUser.objects.get(pk=uid)

        if account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return JsonResponse({"message": "Account activated successfully"}, status=200)
        else:
            return JsonResponse({"error": "Invalid activation link"}, status=400)

    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)
    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred"}, status=500)
