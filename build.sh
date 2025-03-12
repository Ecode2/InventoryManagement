#!/bin/bash
#Exit on error
set -o errexit

# Install dependencies
cd src
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Collect static files
python manage.py vendor_pull
python manage.py collectstatic --noinput


echo "Build completed successfully."
