FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production


RUN npx prisma generate  


# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 3003

# Set environment variables
ENV NODE_ENV=production

# Command to run the application and consumer
CMD ["sh", "-c", "node src/index.js & node src/kafka/consumer.js"]
