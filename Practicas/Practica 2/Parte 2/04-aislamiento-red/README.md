# Ejercicio 4 — Aislamiento de red

La API pertenece a `red_frontal` y `red_datos`; MongoDB pertenece únicamente a `red_datos`; Nginx pertenece únicamente a `red_frontal`. MongoDB no publica ningún puerto al host y la red de datos está marcada como interna.

Así se aplica mínimo privilegio: comprometer el proxy no entrega una ruta de red directa hacia la base de datos. La API sigue disponible directamente en el puerto `3003` del host y a través del proxy en `8084`.

Las pruebas positivas y negativas están en `../GUIA_COMPLETA.md`.
