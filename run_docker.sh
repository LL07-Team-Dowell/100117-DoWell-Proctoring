#!/bin/bash

# Check if an argument is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <environment>"
    exit 1
fi

# Check if the system is running Linux
if [ "$(uname)" == "Linux" ]; then
    echo "System OS: Linux Detected"
    
    # installing npm and node js
    echo "installing nodejs and npm"
    sudo apt install nodejs npm

    # getting the ip address
    # Get the IP address of the Linux system
    ip_address=$(hostname -I | awk '{print $1}')

    cd backend

    # Check if the variables exist in the .env file
    if grep -q "^IP=" .env; then
        sed -i "s/^IP=.*/IP=$ip_address:9092/" .env
    else
        echo "" >> .env
        echo "IP=$ip_address:9092" >> .env
    fi

    if grep -q "^IPDEV=" .env; then
        sed -i "s/^IPDEV=.*/IPDEV=$ip_address:9092/" .env
    else
        echo "IPDEV=$ip_address:9092" >> .env
    fi

    if grep -q "^KAFKA_HOST=" .env; then
        sed -i "s/^KAFKA_HOST=.*/KAFKA_HOST=$ip_address/" .env
    else
        echo "KAFKA_HOST=$ip_address" >> .env
    fi

    cd ..
    # Store the IP address in a .env file
    echo "KAFKA_HOST=$ip_address" > .env


elif [ "$(expr substr $(uname -s) 1 5)" == "MINGW" ]; then
    echo "System OS: Windows Detected"
    echo "Ensure nodejs and npm are installed manually for your OS"
    
    # Get the IP address for Windows
    ip_address=$(ipconfig | grep IPv4 | grep -v "127.0.0.1" | awk '{print $NF}')
    num_addresses=$(echo "$ip_address" | wc -l)

    if [ "$num_addresses" -eq 1 ]; then
        ip_address=$(echo "$ip_address")
    else
        ip_address=$(echo "$ip_address" | sed -n '2p')
    fi

    cd backend

    # Check if the variables exist in the .env file
    if grep -q "^IP=" .env; then
        sed -i "s/^IP=.*/IP=$ip_address:9092/" .env
    else
        echo "" >> .env
        echo "IP=$ip_address:9092" >> .env
    fi

    if grep -q "^IPDEV=" .env; then
        sed -i "s/^IPDEV=.*/IPDEV=$ip_address:9092/" .env
    else
        echo "IPDEV=$ip_address:9092" >> .env
    fi

    if grep -q "^KAFKA_HOST=" .env; then
        sed -i "s/^KAFKA_HOST=.*/KAFKA_HOST=$ip_address/" .env
    else
        echo "KAFKA_HOST=$ip_address" >> .env
    fi

    cd ..
    # Store the IP address in a .env file
    echo "KAFKA_HOST=$ip_address" > .env


elif [ "$(uname)" == "Darwin" ]; then
    echo "System OS: macOS Detected"

    brew install node

    # Get the IP address for macOS
    ip_address=$(ifconfig | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}')
    echo "$ip_address"
    
    cd backend

    # Check if the variables exist in the .env file
    if grep -q "^IP=" .env; then
        sed -i "s/^IP=.*/IP=$ip_address:9092/" .env
    else
        echo "" >> .env
        echo "IP=$ip_address:9092" >> .env
    fi

    if grep -q "^IPDEV=" .env; then
        sed -i "s/^IPDEV=.*/IPDEV=$ip_address:9092/" .env
    else
        echo "IPDEV=$ip_address:9092" >> .env
    fi

    if grep -q "^KAFKA_HOST=" .env; then
        sed -i "s/^KAFKA_HOST=.*/KAFKA_HOST=$ip_address/" .env
    else
        echo "KAFKA_HOST=$ip_address" >> .env
    fi

    cd ..
    # Store the IP address in a .env file
    echo "KAFKA_HOST=$ip_address" > .env

else
    echo "Unsupported operating system"
    echo "Ensure nodejs and npm are installed manually for your OS"
fi


cd backend
npm install 

cd ..

cd frontend
npm install 
cd ..


#==========================================================================================================
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
