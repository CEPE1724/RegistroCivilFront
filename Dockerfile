FROM node:19-alpine3.15 as dev-deps
WORKDIR /app
COPY package.json package.json
RUN yarn install --frozen-lockfile


FROM node:19-alpine3.15 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

# Asegura que la carpeta src/css exista
RUN mkdir -p src/css

# Ejecutar Tailwind para generar styles.css
RUN yarn tailBuild

# Ejecutar build de React
RUN yarn build


FROM nginx:1.23.3 as prod
EXPOSE 80

COPY --from=builder /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ngnix/nginx.conf /etc/nginx/conf.d/

CMD [ "nginx","-g", "daemon off;" ]
