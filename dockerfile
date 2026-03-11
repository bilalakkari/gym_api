# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all API source code
COPY . .

# Expose the port your API listens on
EXPOSE 3000

# Start the API
CMD ["node", "server.js"]