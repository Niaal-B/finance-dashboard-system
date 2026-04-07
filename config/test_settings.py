"""
Test-only settings override.
Uses SQLite so the test suite can run without a running PostgreSQL instance.
Usage: python manage.py test --settings=config.test_settings
"""
from .settings import *  # noqa: F401, F403

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'test.db',  # noqa: F405
    }
}

# Disable rate limiting during tests so it doesn't interfere with test requests
RATELIMIT_ENABLE = False
