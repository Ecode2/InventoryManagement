from .env import config

# Backblaze B2 configuration for production
B2_ACCESS_KEY_ID = config("B2_ACCESS_KEY_ID", default=None)
B2_SECRET_ACCESS_KEY = config("B2_SECRET_ACCESS_KEY", default=None)
B2_STORAGE_BUCKET_NAME = config("B2_STORAGE_BUCKET_NAME", default="production-bucket")
B2_S3_ENDPOINT_URL = "https://s3.us-east-005.backblazeb2.com"

# AWS S3-compatible settings for Backblaze B2
AWS_ACCESS_KEY_ID = B2_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY = B2_SECRET_ACCESS_KEY
AWS_STORAGE_BUCKET_NAME = B2_STORAGE_BUCKET_NAME
AWS_S3_ENDPOINT_URL = B2_S3_ENDPOINT_URL

AWS_S3_REGION_NAME = 'us-east-005'  # or the appropriate region
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.us-east-005.backblazeb2.com'
AWS_DEFAULT_ACL = "public-read"
AWS_S3_USE_SSL = True

# Static and media files configuration
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'
MEDIA_ROOT = 'media/'

STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/'
STATIC_ROOT = "static/"

""" 

    Set region_name to your Backblaze B2 region, for example, us-west-004

    Set endpoint_url to https://s3.${AWS_S3_REGION_NAME}.backblazeb2.com

    Set the values of access_key and secret_key to the application key id and application key you created in step 2.
 """