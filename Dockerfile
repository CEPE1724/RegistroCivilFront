# Etapa 1: Build de la app
FROM node:18 AS build
WORKDIR /app

# Aumentar límite de memoria para Node.js (4 GB)
ENV NODE_OPTIONS=--max-old-space-size=4096

# Copiar archivos de dependencias e instalar
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Asegura que la carpeta src/css exista
RUN mkdir -p src/css

# Copiar variables de entorno (si existen)
COPY .env .env

# Ejecutar Tailwind para generar styles.css
RUN npm run tailBuild

# Ejecutar build de React (ahora con más memoria disponible)
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
