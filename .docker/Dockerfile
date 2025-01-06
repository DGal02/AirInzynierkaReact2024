FROM node:22-alpine
RUN apk add --no-cache bash
WORKDIR /app
COPY . /app
RUN npm install
RUN npm install -g serve
RUN npm run build

EXPOSE 8080 3000

CMD ["sh", "-c", "node server.js & serve -s build"]
