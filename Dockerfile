FROM node:18.20.7-alpine
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build
