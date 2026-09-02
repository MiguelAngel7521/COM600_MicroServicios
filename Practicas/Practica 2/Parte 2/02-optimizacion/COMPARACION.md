# Comparación de imágenes

## Problemas identificados

1. `node:20` usa una distribución más grande que `node:20-alpine` y la etiqueta no fija una variante concreta del sistema base.
2. `COPY . /app` se ejecuta antes de instalar dependencias: cualquier cambio del código invalida la capa de `npm install`.
3. Los dos `RUN apt-get ...` crean capas separadas y se conserva la caché de paquetes; además, `curl` no es necesario para arrancar la aplicación.
4. `npm install -g nodemon` agrega una herramienta de desarrollo y peso innecesarios a una imagen de ejecución.
5. `ENV DB_PASSWORD=admin123` incrusta un secreto recuperable desde la imagen y su historial.
6. El proceso se ejecuta como `root`, aumentando el impacto de una vulnerabilidad.
7. `CMD npm start` usa la forma shell; la forma exec transmite las señales directamente al proceso de Node.
8. Falta un `.dockerignore`, por lo que pueden entrar `node_modules`, Git, logs y secretos al contexto.

## Cambios aplicados

La versión optimizada usa Alpine, copia primero `package.json`, instala solo dependencias de producción, limpia la caché de npm, descarta `curl` y `nodemon`, usa un usuario sin privilegios, no guarda secretos y emplea `CMD ["node", "app.js"]`.

## Tabla de resultados reales

Complete esta tabla después de ejecutar las construcciones en su máquina. No deben inventarse valores.

| Versión | Tamaño (MB) | N.º de capas | Tiempo de rebuild |
|---|---:|---:|---:|
| Original | PENDIENTE | PENDIENTE | PENDIENTE |
| Optimizada | PENDIENTE | PENDIENTE | PENDIENTE |
| Mejora (%) | PENDIENTE | PENDIENTE | PENDIENTE |

Para contar las capas se consideran las filas significativas mostradas por `docker history`. El tiempo se toma de la salida final de cada reconstrucción después de modificar únicamente el texto de `mensaje` en `app.js`.
