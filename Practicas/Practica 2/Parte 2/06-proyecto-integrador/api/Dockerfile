# Imagen propia de la API de biblioteca.
FROM node:20-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY --chown=app:app . .
USER app
EXPOSE 3000
CMD ["node", "app.js"]
