# Используем Node.js как базовый образ
FROM node:latest

WORKDIR .

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
