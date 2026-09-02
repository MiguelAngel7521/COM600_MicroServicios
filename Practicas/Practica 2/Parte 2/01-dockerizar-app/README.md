# Ejercicio 1 — Dockerizar una aplicación propia

Esta API, escrita únicamente con módulos nativos de Node.js, presenta materias cursadas y expone los endpoints `/`, `/salud` y `/materias`.

El `.dockerignore` excluye dependencias del host, logs, metadatos de Git, variables de entorno y archivos que no necesita la aplicación. Así reduce el contexto de construcción y evita copiar datos locales o sensibles dentro de la imagen.

Desde esta carpeta:

```bash
docker build -t rodriguez-app:1.0 .
docker run -d --name rodriguez-app -p 3000:3000 rodriguez-app:1.0
docker logs rodriguez-app
curl http://localhost:3000
curl http://localhost:3000/materias
docker stop rodriguez-app
docker rm rodriguez-app
```

La aplicación arranca con un único `docker run`; el host solo necesita Docker.
