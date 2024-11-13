from django.shortcuts import render
from django.views.generic import TemplateView
from django.core.mail import send_mail
from django.contrib import messages

# Create your views here.
class HomeView(TemplateView):
    template_name = "home/home.html"