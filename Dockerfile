# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    build-essential \
    libpango1.0-0 \
    libcairo2 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    libjpeg-dev \
    zlib1g-dev \
    libxml2-dev \
    libxslt1-dev \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Install WeasyPrint dependencies
RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libjpeg62-turbo \
    libpango1.0-0 \
    libgdk-pixbuf2.0-0 \
    libpangoft2-1.0-0 \
    libpangocairo-1.0-0 \
    libgobject-2.0-0 \
    && apt-get clean

# Create and set the working directory
WORKDIR /app

# Copy the requirements file into the container
COPY src/requirements.txt /app/src/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r src/requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app/

# Pre-start commands
#RUN python src/manage.py vendor_pull
#RUN python src/manage.py makemigrations
RUN python src/manage.py migrate
RUN python src/manage.py collectstatic --noinput

# Expose the port the app runs on
EXPOSE 8000

# Run the WSGI server
CMD ["gunicorn", "--chdir", "src", "system.wsgi:application", "--bind", "0.0.0.0:8000"]
