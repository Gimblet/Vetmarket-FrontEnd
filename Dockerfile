# --- ETAPA 1: Construcción ---
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=docker
# Compila Angular con el perfil "docker"

# --- ETAPA 2: Servir con Nginx ---
FROM nginx:stable-alpine
COPY --from=build /app/dist/proyecto-dawii-frontend-angular/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
