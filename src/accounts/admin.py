from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from .models import User


# Register your models here.



class CustomUserCreationForm(UserCreationForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    class Meta:
        model = User
        fields = ('role',)

class CustomUserChangeForm(UserChangeForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field."""

    class Meta:
        model = User
        fields = ('role',)

class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'role', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'role')}),  # Add custom fields here
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'role', 'password1', 'password2')}
        ),
    )
    search_fields = ('email', 'username',)
    ordering = ('email', 'username',)
    #filter_horizontal = ()

# Now register the new UserAdmin...
admin.site.register(User, UserAdmin)