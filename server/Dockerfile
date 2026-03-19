# Base image
FROM node:20-alpine

# Workspace
WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm install

# Source code
COPY . .

# Environment
ENV PORT=3001
EXPOSE 3001

# Start
CMD ["node", "index.js"]
