FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache python3 make gcc g++

WORKDIR /app

COPY database ./database
COPY src ./src
COPY .env ./
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install
RUN npm run migrate:up
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
