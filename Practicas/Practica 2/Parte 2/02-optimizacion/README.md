# Ejercicio 2 — Optimización de una imagen

Desde esta carpeta, construya y compare las dos variantes:

```bash
docker build -f Dockerfile.original -t rodriguez-app:original .
docker build -f Dockerfile.optimizado -t rodriguez-app:optimizada .
docker images
docker history rodriguez-app:original
docker history rodriguez-app:optimizada
```

Compruebe la variante optimizada:

```bash
docker run -d --name app-optimizada -p 3001:3000 rodriguez-app:optimizada
curl http://localhost:3001
docker rm -f app-optimizada
```

Después cambie solo una línea del mensaje de `app.js`, vuelva a ejecutar ambos `docker build` y registre los tiempos que muestra BuildKit. Los problemas, las mejoras y la tabla para datos reales están en `COMPARACION.md`.
