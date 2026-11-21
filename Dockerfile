FROM node:26-alpine

RUN apk add --no-cache python3 make gcc g++ sqlite

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY database ./database
COPY src ./src
COPY .env ./

RUN npm run migrate:up
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
