# Use the official Python 3.12 image as a base image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create and set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY src/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY rav.YAML /app/
RUN rav run vendor_pull

# Copy the Django project code into the container
COPY src /app/src

# Set the working directory to the Django project root
WORKDIR /app/src

# Run migrations and collectstatic (optional for production)
RUN rav run vendor_pull
RUN python src/manage.py migrate
RUN python src/manage.py collectstatic --noinput

# Start the Django server
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "system.wsgi:application"]
