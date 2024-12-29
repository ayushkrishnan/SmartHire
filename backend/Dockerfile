FROM node:latest

WORKDIR /app
COPY . .

RUN npm install && npm run build && chmod +x entrypoint.sh

ENTRYPOINT ["npx", "drizzle-kit", "push", "&&", "node", "dist/server.js"]
EXPOSE 8080
