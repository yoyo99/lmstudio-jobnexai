FROM node:20-slim

WORKDIR /app

# Dépendances système
RUN apt-get update && apt-get install -y curl unzip wget && apt-get clean

# Installer LM Studio CLI (llmster)
RUN wget https://releases.lmstudio.ai/linux/x64/llmster -O /usr/local/bin/llmster && \
    chmod +x /usr/local/bin/llmster

# Installer le daemon LM Studio
RUN wget https://releases.lmstudio.ai/linux/x64/lms -O /usr/local/bin/lms && \
    chmod +x /usr/local/bin/lms

# Installer les dépendances Node
COPY package.json package-lock.json* ./
RUN npm install

# Copier le proxy
COPY index.js .
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 2345

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:2345/health || exit 1

CMD ["./entrypoint.sh"]
