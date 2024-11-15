from urllib.parse import urlparse
from decouple import config as decouple_config, Config, RepositoryEnv, Csv
from pathlib import Path
from functools import lru_cache

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_DIR = BASE_DIR.parent
ENV_FILE_PATH = PROJECT_DIR / '.env'

#@lru_cache
def get_config()->Config:

    if ENV_FILE_PATH.exists():
        return Config(RepositoryEnv(str(ENV_FILE_PATH)))
    
    return decouple_config


config = get_config()
