# FROM selecciona una imagen base versionada y liviana con Node.js 20.
FROM node:20-alpine

# WORKDIR crea /app y lo establece como directorio de trabajo.
WORKDIR /app

# COPY copia primero el manifiesto para poder reutilizar la cache de dependencias.
COPY package*.json ./

# RUN instala solo las dependencias necesarias durante la construccion.
RUN npm install --omit=dev

# COPY incorpora el codigo de la aplicacion a la imagen.
COPY . .

# EXPOSE documenta el puerto interno; no lo publica en el host.
EXPOSE 3000

# CMD arranca la aplicacion cada vez que se crea el contenedor.
CMD ["node", "app.js"]
