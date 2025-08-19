# Etapa de build
FROM node:20 AS build

WORKDIR /app

# Copiar el frontend local
COPY . .

# Instalar dependencias y build
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
RUN npm run build

# Etapa ligera para servir estáticos
FROM node:20-alpine

WORKDIR /srv

# Instalar "serve" para servir el build
RUN npm install -g serve

# Copiar el build
COPY --from=build /app/dist /srv/dist

# Puerto interno del contenedor
EXPOSE 80

# Servir el build
CMD ["serve", "-s", "dist", "-l", "80"]
