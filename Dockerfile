# Etapa 1: Build de la app
FROM node:18 AS build
WORKDIR /app

# Copia los archivos de dependencias y los instala
COPY package*.json ./
RUN npm install

# Copia el resto del código fuente
COPY . .

# Asegura que la carpeta src/css exista
RUN mkdir -p src/css

COPY .env .env

# Ejecutar Tailwind para generar styles.css
RUN npm run tailBuild

# Build de React (usa styles.css)
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
