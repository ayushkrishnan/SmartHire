FROM node:latest
WORKDIR /app
COPY . .
RUN npm install && npm run build && \
    # Convert line endings
    apt-get update && \
    apt-get install -y dos2unix && \
    dos2unix entrypoint.sh && \
    chmod +x entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
EXPOSE 8080