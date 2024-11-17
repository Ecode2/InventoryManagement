"""
Django settings for system project.

Generated by 'django-admin startproject' using Django 5.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
from decouple import config, Csv
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config("SECRET_KEY", default=None, cast=str)

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS
print("\n\n\n DEBUG \n\n\n", os.getenv("DEBUG"), "\n\n\n")
print(config("DEBUG", cast=bool))

# SECURITY WARNING: don't run with debug turned on in production!
if config("DEBUG", default=False, cast=bool) == False:
    DEBUG = config("DEBUG", default=False, cast=bool)
    
    ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="", cast=Csv())

    CSRF_TRUSTED_ORIGINS = config("CSRF_TRUSTED_ORIGINS", default="", cast=Csv())

    SECURE_SSL_REDIRECT=False

    SECURE_HSTS_INCLUDE_SUBDOMAINS=True

    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

    SECURE_HSTS_SECONDS=30

    SESSION_COOKIE_SECURE=True

    CSRF_COOKIE_SECURE=True

    SECURE_HSTS_PRELOAD=True

    SECURE_BROWSER_XSS_FILTER=True

    X_FRAME_OPTIONS='SAMEORIGIN'

    print("\n\n",  ALLOWED_HOSTS, CSRF_TRUSTED_ORIGINS, "\n\n\n")

else:
    DEBUG = True
    ALLOWED_HOSTS = ['localhost', '127.0.0.1'] #["2c50-2a09-bac5-4dd3-d2-00-15-378.ngrok-free.app"]
    #CSRF_TRUSTED_ORIGINS = ["https://2c50-2a09-bac5-4dd3-d2-00-15-378.ngrok-free.app"]
    X_FRAME_OPTIONS='SAMEORIGIN'

ACCOUNT_LOGIN_BY_CODE_ENABLED = True

# Application definition
INSTALLED_APPS = [
    "admin_interface",
    "colorfield",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    'django.contrib.humanize',
    "core",
    "home",
    "dashboard",
    'accounts',
    "products",
    "management",
    "sales",

    # Third-party apps
    'allauth',
    'allauth.account',
    "allauth.usersessions",
    "rest_framework",
    "django_filters",
    "drf_spectacular",
    "drf_spectacular_sidecar",
    "django_notification",
    "whitenoise.runserver_nostatic",
    #"widget_tweaks",
    #"slippers",
    'storages',
    #'compressor',
    "pwa",

]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    #"system.middleware.AllowIframeFromSameOrigin",
    #"csp.middleware.CSPMiddleware",

    # Third-party middleware
    "allauth.account.middleware.AccountMiddleware",
    'allauth.usersessions.middleware.UserSessionsMiddleware',
]

#CSP_FRAME_ANCESTORS = ["'self'"]

ROOT_URLCONF = "system.urls"

AUTH_USER_MODEL = 'accounts.User'

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",

                'system.helpers.context_processors.vendor_files'
            ],
        },
    },
]

AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',

    # `allauth` specific authentication methods, such as login by email
    'allauth.account.auth_backends.AuthenticationBackend',
]
USERSESSIONS_ADAPTER = "allauth.usersessions.adapter.DefaultUserSessionsAdapter"
USERSESSIONS_TRACK_ACTIVITY = True

LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/'  # Redirect after login
LOGOUT_REDIRECT_URL = '/accounts/login/'      # Redirect after logout
ACCOUNT_LOGOUT_REDIRECT_URL = '/accounts/login/'

WSGI_APPLICATION = "system.wsgi.application"


#X_FRAME_OPTIONS = "SAMEORIGIN"
SILENCED_SYSTEM_CHECKS = ["security.W019"]

ALLAUTH_UI_THEME = "light"

# For development (console backend)
if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
else:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    from .helpers.email import *



# Databasedjango-widget-tweaksdjango-widget-tweaks
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

from .helpers.db import database
DATABASES = database
print(DATABASES, "\n\n\n")  

# settings.py
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(message)s',
)



REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        'rest_framework.authentication.SessionAuthentication',
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
        "core.permissions.IsAdminOrStaff",
    ],
    "DEFAULT_FILTER_BACKENDS": ['django_filters.rest_framework.DjangoFilterBackend',
                                 'rest_framework.filters.OrderingFilter',
                                 'rest_framework.filters.SearchFilter'],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day'
    },
    'TEST_REQUEST_DEFAULT_FORMAT': 'json',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Inventory Management Sysem',
    'DESCRIPTION': 'API endpoints for the Inventory Management System',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SWAGGER_UI_DIST': 'SIDECAR',
    'SWAGGER_UI_FAVICON_HREF': 'SIDECAR',
    'REDOC_DIST': 'SIDECAR',
}

DJANGO_NOTIFICATION_API_FILTERSET_CLASS = (
    "django_notification.api.filters.notification_filter.NotificationFilter"
)


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 9,
        },
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


#CACHES = {
#    "default": {
#        "BACKEND": "django_redis.cache.RedisCache",
#        "LOCATION": "redis://127.0.0.1:6379/0",
#        #rediss://[[username]:[password]]@localhost:6379/0
#        "OPTIONS": {
#            "CLIENT_CLASS": "django_redis.client.DefaultClient",
#        },
#        'KEY_PREFIX': 'drf_cache'
#    }
#}
#CACHE_TTL = 60 * 15 

#SESSION_ENGINE = "django.contrib.sessions.backends.cache"
#SESSION_CACHE_ALIAS = "default"

# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "en"

TIME_ZONE = "UTC"

LANGUAGES = [
    ("ar", "Arabic"),
    ("az", "Azerbaijani"),
    ("bg", "Bulgarian"),
    ("ca", "Catalan"),
    ("cs", "Czech"),
    ("da", "Danish"),
    ("de", "German"),
    ("el", "Greek"),
    ("en", "English"),
    ("es", "Spanish"),
    ("et", "Estonian"),
    ("eu", "Basque"),
    ("fa", "Persian"),
    ("fi", "Finnish"),
    ("fr", "French"),
    ("he", "Hebrew"),
    ("hr", "Croatian"),
    ("hu", "Hungarian"),
    ("id", "Indonesian"),
    ("it", "Italian"),
    ("ja", "Japanese"),
    ("ka", "Georgian"),
    ("ko", "Korean"),
    ("ky", "Kyrgyz"),
    ("lt", "Lithuanian"),
    ("lv", "Latvian"),
    ("mn", "Mongolian"),
    ("nb", "Norwegian Bokmål"),
    ("nl", "Dutch"),
    ("pl", "Polish"),
    ("pt-BR", "Portuguese (Brazil)"),
    ("pt-PT", "Portuguese (Portugal)"),
    ("ro", "Romanian"),
    ("ru", "Russian"),
    ("sk", "Slovak"),
    ("sl", "Slovenian"),
    ("sr", "Serbian"),
    ("sr-Latn", "Serbian (Latin)"),
    ("sv", "Swedish"),
    ("th", "Thai"),
    ("tr", "Turkish"),
    ("uk", "Ukrainian"),
    ("zh-hans", "Chinese (Simplified)"),
    ("zh-hant", "Chinese (Traditional)"),
]

SITE_ID = 1

#ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = 'email'
#ACCOUNT_CONFIRM_EMAIL_ON_GET = True
ACCOUNT_UNIQUE_EMAIL = True
#ACCOUNT_EMAIL_VERIFICATION = 'mandatory'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/


from decouple import config

if not DEBUG:

    if config("CPANEL", default=False, cast=bool):

        STATIC_URL = "/static/"
        MEDIA_URL = 'media/'

        STATIC_ROOT = BASE_DIR.parent.parent / 'staticfiles'
        MEDIA_ROOT = BASE_DIR.parent.parent / "media"
        STATICFILES_DIRS = [BASE_DIR.parent.parent / "static"]

        #STATICFILES_FINDERS = (
        #    "django.contrib.staticfiles.finders.FileSystemFinder",
        #    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
        #    # 'django.contrib.staticfiles.finders.DefaultStorageFinder',
        #)
        print(STATIC_URL, STATICFILES_DIRS, STATIC_ROOT, BASE_DIR, "\n\n\n")

    else:

        STATIC_URL = "/static/"
        STATIC_ROOT = BASE_DIR / 'staticfiles'
        STATICFILES_DIRS = [BASE_DIR / "static"]
        print(STATIC_URL, STATICFILES_DIRS, STATIC_ROOT, BASE_DIR, "\n\n\n")

        AWS_ACCESS_KEY_ID = config("B2_ACCESS_KEY_ID", default=None)
        AWS_SECRET_ACCESS_KEY = config("B2_SECRET_ACCESS_KEY", default=None)
        AWS_STORAGE_BUCKET_NAME = config("B2_STORAGE_BUCKET_NAME", default="production-bucket")
        AWS_S3_REGION_NAME = 'us-east-005'
        #AWS_DEFAULT_ACL = "public-read"

        AWS_S3_ENDPOINT = f's3.{AWS_S3_REGION_NAME}.backblazeb2.com'
        AWS_S3_ENDPOINT_URL = f'https://{AWS_S3_ENDPOINT}'

        AWS_S3_OBJECT_PARAMETERS = {
            'CacheControl': 'max-age=86400',
        }

        AWS_LOCATION = 'static'
        DEFAULT_FILE_STORAGE = 'system.storage_backends.MediaStorage'

        STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

        #MEDIA_URL = 'media/'
        #MEDIA_ROOT = BASE_DIR.parent / "media"
        
        #STATIC_URL = f"https://{AWS_STORAGE_BUCKET_NAME}.{AWS_S3_ENDPOINT}/

        #DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
        #STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

else:

    STATIC_URL = "/static/"
    MEDIA_URL = 'media/'
    STATIC_ROOT = BASE_DIR / "staticfiles"
    STATICFILES_DIRS = [BASE_DIR / "static"]
    print(STATIC_URL, STATICFILES_DIRS, "\n\n\n")


    #COMPRESS_ROOT = BASE_DIR / 'static'
    #COMPRESS_ENABLED = True
    
    STATICFILES_FINDERS = (
        #'compressor.finders.CompressorFinder',
        "django.contrib.staticfiles.finders.FileSystemFinder",
        "django.contrib.staticfiles.finders.AppDirectoriesFinder",
        # 'django.contrib.staticfiles.finders.DefaultStorageFinder',
    )

    MEDIA_ROOT = BASE_DIR.parent / "media"

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

def print_directory_structure(startpath):
    startpath = str(startpath)
    for root, dirs, files in os.walk(startpath):
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * (level)
        print(f'{indent}{os.path.basename(root)}/')
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            print(f'{subindent}{f}')

print("Project Directory Structure:")
#print_directory_structure(BASE_DIR)

print("\nStatic Files Directory Structure:")
#print_directory_structure(STATIC_ROOT)



PWA_SERVICE_WORKER_PATH = BASE_DIR / "static/js/serviceworker.js"

PWA_APP_NAME = 'Inventory Management System'
PWA_APP_DESCRIPTION = "Inventory Management System"
PWA_APP_THEME_COLOR = '#000000'
PWA_APP_BACKGROUND_COLOR = '#ffffff'
PWA_APP_DISPLAY = 'standalone'
PWA_APP_SCOPE = '/'
PWA_APP_ORIENTATION = 'any'
PWA_APP_START_URL = '/'
PWA_APP_STATUS_BAR_COLOR = 'default'
PWA_APP_ICONS = [
    {
    "src": "src/static/images/manifest-icon-192.maskable.png",
    "sizes": "192x192",
    "type": "image/png",
    "purpose": "any"
  },
  {
    "src": "src/static/images/manifest-icon-192.maskable.png",
    "sizes": "192x192",
    "type": "image/png",
    "purpose": "maskable"
  },
  {
    "src": "src/static/images/manifest-icon-512.maskable.png",
    "sizes": "512x512",
    "type": "image/png",
    "purpose": "any"
  },
  {
    "src": "src/static/images/manifest-icon-512.maskable.png",
    "sizes": "512x512",
    "type": "image/png",
    "purpose": "maskable"
  }
]
PWA_APP_ICONS_APPLE = [
    {
    "src": "static/images/manifest-icon-192.maskable.png",
    "sizes": "192x192",
    "type": "image/png",
    "purpose": "any"
  },
  {
    "src": "static/images/manifest-icon-192.maskable.png",
    "sizes": "192x192",
    "type": "image/png",
    "purpose": "maskable"
  },
  {
    "src": "static/images/manifest-icon-512.maskable.png",
    "sizes": "512x512",
    "type": "image/png",
    "purpose": "any"
  },
  {
    "src": "static/images/manifest-icon-512.maskable.png",
    "sizes": "512x512",
    "type": "image/png",
    "purpose": "maskable"
  }
]
PWA_APP_SPLASH_SCREEN = [

    { 
        'src': 'static/images/apple-splash-2048-2732.jpg',
        'media': '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2732-2048.jpg',
        'media': '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-1668-2388.jpg',
        'media': '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2388-1668.jpg',
        'media': '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-1536-2048.jpg',
        'media': '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2048-1536.jpg',
        'media': '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-1488-2266.jpg',
        'media': '(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2266-1488.jpg',
        'media': '(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-1640-2360.jpg',
        'media': '(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2360-1640.jpg',
        'media': '(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-1668-2224.jpg',
        'media': '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2224-1668.jpg',
        'media': '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-1620-2160.jpg',
        'media': '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2160-1620.jpg',
        'media': '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-1320-2868.jpg',
        'media': '(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2868-1320.jpg',
        'media': '(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-1206-2622.jpg',
        'media': '(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2622-1206.jpg',
        'media': '(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-1290-2796.jpg',
        'media': '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2796-1290.jpg',
        'media': '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-1179-2556.jpg',
        'media': '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2556-1179.jpg',
        'media': '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-1284-2778.jpg',
        'media': '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2778-1284.jpg',
        'media': '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-1170-2532.jpg',
        'media': '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2532-1170.jpg',
        'media': '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-1125-2436.jpg',
        'media': '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2436-1125.jpg',
        'media': '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-1242-2688.jpg',
        'media': '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2688-1242.jpg',
        'media': '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-828-1792.jpg',
        'media': '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-1792-828.jpg',
        'media': '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-1242-2208.jpg',
        'media': '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-2208-1242.jpg',
        'media': '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-750-1334.jpg',
        'media': '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-1334-750.jpg',
        'media': '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    { 
        'src': 'static/images/apple-splash-640-1136.jpg',
        'media': '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    { 
        'src': 'static/images/apple-splash-1136-640.jpg',
        'media': '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    }
]
PWA_APP_DIR = 'ltr'
PWA_APP_LANG = 'en-US'
