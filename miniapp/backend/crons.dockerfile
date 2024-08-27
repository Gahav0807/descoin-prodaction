FROM node:latest

WORKDIR .

COPY package*.json ./

RUN npm install --production

COPY . .

CMD ["node", "crons.js"]
