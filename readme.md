# Project Setup Guide

## Introduction
This project is designed to run using Docker, which simplifies the process of managing dependencies and setting up the environment. The steps below will guide you through getting the project up and running.

## Prerequisites
Ensure you have the following installed:
- Docker
- Docker Compose

## Setup Instructions

1. Clone the project repository to your local machine:

    ```bash
    git clone https://github.com/BURZUMANE/pasteis.git
    cd pasteis
    ```

2. Start up the project with Docker:

    ```bash
    docker compose up --build
    ```

    This command will:
    - Build the Docker images defined in the `docker-compose.yml` file.
    - Start the necessary services (such as the backend and frontend).

3. Once Docker has successfully started the services, open your browser and navigate to:

    ```
    http://localhost:5173/
    ```

    This is where the application's frontend will be accessible.

## Login Information

There are two pre-configured user accounts for testing purposes:

- **Username:** Driver  
  **Password:** password

- **Username:** BigBoss777  
  **Password:** password

In order to see how the system works there's need to login to both users from different browsers or two incognito tabs.


## Stopping the Application

To stop the Docker services, press `CTRL + C` in the terminal where `docker compose` is running, or run the following command in a separate terminal window:

```bash
docker compose down
