# -*- coding: utf-8 -*-
"""Application configuration.

Most configuration is set via environment variables.

For local development, use a .env file to set
environment variables.
"""
import os
from environs import Env

env = Env()
env.read_env()

ENV = env.str("FLASK_ENV", default="production")
DEBUG = ENV == "development"


if ENV == "production":
    # Read DB password from Docker secret file
    POSTGRES_PASSWORD_FILE = env.str("POSTGRES_PASSWORD_FILE", default=None)
    POSTGRES_PASSWORD = None
    if POSTGRES_PASSWORD_FILE and os.path.exists(POSTGRES_PASSWORD_FILE):
        with open(POSTGRES_PASSWORD_FILE) as f:
            POSTGRES_PASSWORD = f.read().strip()

    SQLALCHEMY_DATABASE_URI = (
        f"postgresql+psycopg2://{env.str('POSTGRES_USER', 'postgres')}:{POSTGRES_PASSWORD}@"
        f"{env.str('POSTGRES_HOST', 'localhost')}:{env.int('POSTGRES_PORT', 5432)}/{env.str('POSTGRES_DB', 'app')}"
    )

if ENV == "development":
    SQLALCHEMY_DATABASE_URI = env.str("DATABASE_URL")

SECRET_KEY = env.str("SECRET_KEY")
SEND_FILE_MAX_AGE_DEFAULT = env.int("SEND_FILE_MAX_AGE_DEFAULT")
BCRYPT_LOG_ROUNDS = env.int("BCRYPT_LOG_ROUNDS", default=13)
DEBUG_TB_ENABLED = DEBUG
DEBUG_TB_INTERCEPT_REDIRECTS = False
CACHE_TYPE = (
    "flask_caching.backends.SimpleCache"  # Can be "MemcachedCache", "RedisCache", etc.
)
SQLALCHEMY_TRACK_MODIFICATIONS = False
