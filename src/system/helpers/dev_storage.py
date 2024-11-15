from .env import config

# Wasabi configuration for development
WASABI_ACCESS_KEY_ID = config("WASABI_ACCESS_KEY_ID", default=None)
WASABI_SECRET_ACCESS_KEY = config("WASABI_SECRET_ACCESS_KEY", default=None)
WASABI_STORAGE_BUCKET_NAME = config("WASABI_STORAGE_BUCKET_NAME", default="development-bucket")
WASABI_S3_ENDPOINT_URL = f"https://s3.us-west-1.wasabisys.com"

AWS_ACCESS_KEY_ID = WASABI_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY = WASABI_SECRET_ACCESS_KEY
AWS_STORAGE_BUCKET_NAME = WASABI_STORAGE_BUCKET_NAME
AWS_S3_ENDPOINT_URL = WASABI_S3_ENDPOINT_URL

AWS_S3_REGION_NAME = 'us-west-1'  # or the appropriate region
AWS_S3_CUSTOM_DOMAIN = f's3.us-west-1.wasabisys.com/{AWS_STORAGE_BUCKET_NAME}/'
AWS_DEFAULT_ACL = "public-read"
AWS_S3_USE_SSL = True

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/'
MEDIA_ROOT = 'media/'

STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/'
STATIC_ROOT = "static/"
