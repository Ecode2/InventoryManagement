from django.utils.decorators import method_decorator
#from django.views.decorators.cache import cache_page
#from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from core.decorators import admin_staff_role

# Create your views here.
decorators = [admin_staff_role("staff")]#, cache_page(60 * 15)]

class DashboardView(TemplateView):
    template_name = "dashboard/main.html"

    @method_decorator(admin_staff_role("staff"))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)