# Etapa de build
FROM node:20 AS build

WORKDIR /app

# Clonar el frontend
RUN git clone https://github.com/eurbana-dev/e-urbana-front.git .

# Inyectar la URL de la API en build si el proyecto usa Vite con variables VITE_*
# Puedes pasarla desde docker-compose como ARG
ARG VITE_API_URL="http://localhost:3000"

# Crear un .env.production local para el build de Vite
# (Si el proyecto ya maneja sus .env.* propios, esto los complementa)
RUN printf "VITE_API_URL=%s\n" "$VITE_API_URL" > .env.production

# Instalar y compilar
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
RUN npm run build

# Etapa ligera para servir estáticos
FROM node:20-alpine

WORKDIR /srv

# "serve" para servir /dist en un contenedor sencillo sin Nginx
RUN npm install -g serve

# Copiar el build
COPY --from=build /app/dist /srv/dist

# Escucharemos en el puerto 80 dentro del contenedor
EXPOSE 80

# Servir el build
CMD ["serve", "-s", "dist", "-l", "80"]
