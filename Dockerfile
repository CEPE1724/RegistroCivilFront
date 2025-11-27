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

# Etapa 3: imagen final Nginx
FROM nginx:1.23.3 as prod
EXPOSE 80 443

# Copiar build de React
COPY --from=builder /app/build /usr/share/nginx/html

# Configuración de Nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
