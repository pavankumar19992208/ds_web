# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Set the Node.js memory limit
ENV NODE_OPTIONS=--max_old_space_size=4096

# Build the React application
RUN npm run build

# Install serve to serve the build
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["serve", "-s", "build", "-l", "3000"]