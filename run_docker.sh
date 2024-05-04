#!/bin/bash

# Check if an argument is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <environment>"
    exit 1
fi

# installing npm and node js
sudo apt install nodejs npm

cd backend
npm install 
cd ..

cd frontend
npm install 
cd ..

# Check the provided argument
if [ "$1" == "dev" ]; then
    # biuld docker-compose for development
    docker-compose -f docker-compose.dev.yml build
    # Run docker-compose for development environment
    docker-compose -f docker-compose.dev.yml up
elif [ "$1" == "prod" ]; then
    # biuld docker-compose for prodcution
    docker-compose -f docker-compose.prod.yml build
    # Run docker-compose for production environment
    docker-compose -f docker-compose.prod.yml up
else
    echo "Invalid environment specified. Please use 'dev' or 'prod'."
    exit 1
fi
