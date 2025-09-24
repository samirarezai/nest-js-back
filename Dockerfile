FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose the port your NestJS app runs on (default is 3000)
EXPOSE 8001

# Start the application
CMD ["npm", "run", "start:dev"]