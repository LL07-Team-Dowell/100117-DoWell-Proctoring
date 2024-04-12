FROM node:20.11.1 AS build

WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 8005

# Command to run your app
CMD ["npm", "run", "dev"]
