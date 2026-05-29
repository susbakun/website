FROM node:18-alpine

# Native build tools for better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json package-lock.json ./

# Reproducible production install; fail the image build if deps are broken
RUN npm ci --omit=dev && \
    node -e "require('express'); require('cors'); require('dotenv');"

COPY . .

EXPOSE 5001

CMD ["node", "src/server.js"]
