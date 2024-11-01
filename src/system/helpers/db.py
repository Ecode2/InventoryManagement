from .env import BASE_DIR, config
from urllib.parse import urlparse
from pathlib import Path
from functools import lru_cache

import dj_database_url

@lru_cache
def get_database_url(BASE_DIR:Path, DEBUG:bool, DATABASE_URL)->dict:
    if DEBUG:
        return {
                'default': {
                    'ENGINE': 'django.db.backends.sqlite3',
                    'NAME': BASE_DIR.parent / 'db.sqlite3',
                    'OPTIONS': {
                    'timeout': 20,  # 20 seconds timeout
                    }
                }
            }
        """ return {
            'default': dj_database_url.config(default="postgres://default:HePa1sdgW7vM@ep-young-smoke-a4l644r7-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
                                          conn_max_age=600,
                                          ssl_require=True,
                                          conn_health_checks=True)
        } """
        
        
    return {
        'default': dj_database_url.config(default=DATABASE_URL,
                                          conn_max_age=600,
                                          ssl_require=True,
                                          conn_health_checks=True)
    }


database = get_database_url(BASE_DIR, config("DEBUG", default=True, cast=bool), config("DATABASE_URL", cast=str))