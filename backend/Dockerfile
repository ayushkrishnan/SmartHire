FROM node:latest

WORKDIR /app
COPY . .

RUN npm install && npm run build && chmod +x entrypoint.sh

ENTRYPOINT /app/entrypoint.sh
EXPOSE 8080
