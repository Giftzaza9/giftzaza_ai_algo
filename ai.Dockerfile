# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG PYTHON_VERSION=3.9
FROM python:${PYTHON_VERSION}-slim as base

RUN apt-get update -y \
    && apt-get install gcc libpq-dev -y \
    && apt-get install python3-dev python3-pip python3-venv python3-wheel -y 

RUN python -m pip install wheel

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY ./backend/ai_recommendation/requirements.txt .
COPY ./backend/ai_recommendation/.env /app
COPY ./backend/ai_recommendation/server_schema.py /app
COPY ./backend/ai_recommendation/server.py /app
COPY ./backend/ai_recommendation/settings.py /app
COPY ./backend/ai_recommendation/src /app/src
COPY ./category.json /app/src/lib/

RUN python -m pip install --upgrade pip setuptools
RUN python -m pip install -r requirements.txt

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/go/dockerfile-user-best-practices/
# ARG UID=10001
# RUN adduser \
#     --disabled-password \
#     --gecos "" \
#     --home "/nonexistent" \
#     --shell "/sbin/nologin" \
#     --no-create-home \
#     --uid "${UID}" \
#     appuser

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.cache/pip to speed up subsequent builds.
# Leverage a bind mount to requirements.txt to avoid having to copy them into
# into this layer.
# RUN --mount=type=cache,target=/root/.cache/pip \
#     --mount=type=bind,source=requirements.txt,target=requirements.txt \
#     python -m pip install -r requirements.txt

# Switch to the non-privileged user to run the application.
# USER appuser

# Copy the source code into the container.
# COPY . .

# Expose the port that the application listens on.
EXPOSE 8001

# Run the application.
CMD ["python", "server.py"]
