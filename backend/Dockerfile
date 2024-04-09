# This is the Dockerfile for the backend service
FROM node:20-alpine

# Create a directory where our app will be placed
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Set the working directory in the container
WORKDIR /home/node/app

# Copy the package.json and package-lock.json
COPY package*.json ./

#Change the owner of the /home/node/app directory to the non-root user
USER node

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY --chown=node:node . .

# Expose the port your app runs on
EXPOSE 5000

# Command to run your app using nodemon
CMD ["npm", "run", "dev"]
