FROM node:latest

WORKDIR /app
COPY . .

RUN npm install && npm run build

ENTRYPOINT ["node", "dist/server.js"]
EXPOSE 8080
