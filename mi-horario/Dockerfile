# Etapa 1: construir la app
FROM node:20-alpine as build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Etapa 2: servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
