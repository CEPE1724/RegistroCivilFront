# Etapa 1: dependencias de producción
FROM node:19-alpine3.15 as dev-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Etapa 2: build de React
FROM node:19-alpine3.15 as builder
WORKDIR /app
ENV NODE_OPTIONS=--max-old-space-size=4096
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p src/css
RUN npm run tailBuild
RUN npm run build

# Etapa 3: servidor Node para servir el build
FROM node:19-alpine3.15 as prod
WORKDIR /app

# Instalar serve para servir archivos estáticos
RUN npm install -g serve

# Copiar build de React
COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
