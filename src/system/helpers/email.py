from decouple import config


# Looking to send emails in production? Check out our Email API/SMTP product!
EMAIL_HOST = config("EMAIL_HOST", default=None)
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default=None)
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default=None)
EMAIL_PORT =  config("EMAIL_PORT", default=None)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=None)
DEFAULT_FROM_EMAIL = config("DEFAULT_FROM_EMAIL", default=None)