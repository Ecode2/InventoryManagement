from django.shortcuts import redirect
from rest_framework import response, status, request
from rest_framework.decorators import api_view

def no_permission(request):
    return redirect('home')


@api_view(['GET'])
def user_role(request):
    user = request.user

    if user.is_authenticated:
        return response.Response(data={"role": user.role}, status=status.HTTP_200_OK)
    else:
        return response.Response(status=status.HTTP_401_UNAUTHORIZED)