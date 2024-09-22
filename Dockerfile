FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache python3 make gcc g++

WORKDIR /app

COPY package*.json ./
COPY .env ./
COPY . .

RUN npm install
RUN npm run migrate:up
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
