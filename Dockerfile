FROM node:19-alpine3.15 as dev-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production


FROM node:19-alpine3.15 as builder
WORKDIR /app

# Aumentar límite de memoria para Node.js (4 GB)
ENV NODE_OPTIONS=--max-old-space-size=4096

COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

# Asegura que la carpeta src/css exista
RUN mkdir -p src/css

# Ejecutar Tailwind para generar styles.css
RUN npm run tailBuild

# Ejecutar build de React
RUN npm run build


FROM nginx:1.23.3 as prod
EXPOSE 80 443

COPY --from=builder /app/build /usr/share/nginx/html

# Copiar certificados SSL
COPY ssl/app.services.crt /etc/nginx/ssl/app.services.crt
COPY ssl/app.services.key /etc/nginx/ssl/app.services.key

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/

CMD [ "nginx","-g", "daemon off;" ]
