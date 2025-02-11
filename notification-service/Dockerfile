FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 3004

ENV NODE_ENV=production

CMD ["sh", "-c", "node src/index.js & node src/kafka/consumer.js"]