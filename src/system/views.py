from django.shortcuts import redirect


def no_permission(request):
    return redirect('home')
