from .env import config

AWS_ACCESS_KEY_ID=config("AWS_ACCESS_KEY_ID", default=None)
AWS_SECRET_ACCESS_KEY=config("AWS_SECRET_ACCESS_KEY", default=None)
AWS_S3_SIGNATURE_VERSION="s3v4"
AWS_STORAGE_BUCKET_NAME = config("AWS_STORAGE_BUCKET_NAME", default="micro-ecommerce")
AWS_S3_ENDPOINT_URL=f"https://{AWS_STORAGE_BUCKET_NAME}.us-east-1.linodeobjects.com"

AWS_ACCESS_KEY_ID = config("AWS_ACCESS_KEY_ID", default=None)
AWS_SECRET_ACCESS_KEY = config("AWS_SECRET_ACCESS_KEY", default=None)
AWS_STORAGE_BUCKET_NAME = config("AWS_STORAGE_BUCKET_NAME", default="inventory-manager")
AWS_S3_REGION_NAME = 'us-east-1'  # e.g. 'us-east-1'
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
#AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.{AWS_S3_REGION_NAME}.s3.amazonaws.com'

AWS_DEFAULT_ACL="public-read"
AWS_S3_USE_SSL=True

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/'
MEDIA_ROOT = 'media/'

STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/'
STATIC_ROOT = "static/"

""" 
    STATIC_ROOT = BASE_DIR / 'staticfiles'
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
"""