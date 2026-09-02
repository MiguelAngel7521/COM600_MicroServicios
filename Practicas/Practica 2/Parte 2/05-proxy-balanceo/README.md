# Ejercicio 5 — Proxy inverso y balanceo

El único puerto publicado pertenece a Nginx. La API se descubre por el nombre `api` en `red_frontal`, puede escalar porque no define `container_name` ni un puerto fijo del host, y MongoDB queda aislado en `red_datos`.

Antes de levantar el stack, cree su `.env` local tomando como referencia `.env.example`; el `.env` está ignorado por Git. Luego:

```bash
docker compose config
docker compose up -d --build --scale api=3
docker compose ps
curl http://localhost:8085
curl http://localhost:8085
curl http://localhost:8085
docker compose down
```

Las respuestas deben mostrar distintos valores de `host`, correspondientes a las réplicas.
