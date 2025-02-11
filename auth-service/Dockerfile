FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

RUN npx prisma generate  



COPY . .

#for bcrypt
RUN npm rebuild bcrypt --build-from-source  

EXPOSE 3001

CMD ["sh", "-c", "node src/index.js & node src/kafka/consumer.js"]
