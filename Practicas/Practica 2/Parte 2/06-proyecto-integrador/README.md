# Proyecto integrador — Biblioteca COM-600

Aplicación de biblioteca formada por tres servicios:

- `web`: interfaz estática y proxy inverso Nginx, única entrada desde el host.
- `api`: API REST propia construida con Node.js, Express y un Dockerfile propio.
- `mongo`: base de datos persistente con carga inicial de tres libros.

## Requisitos

- Docker Engine 24 o superior.
- Docker Compose v2.

No hace falta instalar Node.js ni MongoDB en el host.

## Levantar el stack

En una copia recién clonada, desde esta carpeta, ejecute un solo comando:

```bash
docker compose up -d
```

Compose usa valores de desarrollo seguros por defecto. Si necesita otros valores, cree un `.env` local basándose en `.env.example`; ese archivo no se versiona.

Compruebe el estado y abra `http://localhost:8086`:

```bash
docker compose ps
curl http://localhost:8086/api/salud
curl http://localhost:8086/api/libros
```

## Endpoints

| Método | Ruta pública | Uso |
|---|---|---|
| GET | `/api/` | Información de la API |
| GET | `/api/salud` | Salud de API y conexión a MongoDB |
| GET | `/api/libros` | Listar libros |
| POST | `/api/libros` | Crear un libro |
| PUT | `/api/libros/:id` | Actualizar un libro |
| DELETE | `/api/libros/:id` | Eliminar un libro |

Ejemplo de alta:

```bash
curl -X POST http://localhost:8086/api/libros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Docker Deep Dive","autor":"Nigel Poulton"}'
```

## Persistencia y datos iniciales

`datos_biblioteca` conserva MongoDB fuera del ciclo de vida de los contenedores. `mongo-init/seed.js` inserta tres libros únicamente la primera vez que se crea un volumen vacío.

## Detener

```bash
docker compose down
```

Para borrar también los datos, únicamente cuando realmente se quiera reiniciar la base:

```bash
docker compose down -v
```
