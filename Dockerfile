FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl && apt-get clean

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 1234

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:1234/health || exit 1

CMD ["npm", "start"]
