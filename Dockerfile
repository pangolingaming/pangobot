FROM node:12
LABEL org.opencontainers.image.source https://github.com/pangolingaming/pangobot

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD [ "node", "index.js" ]