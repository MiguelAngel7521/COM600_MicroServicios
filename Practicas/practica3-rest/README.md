# Práctica 3: API REST

## Diseño del recurso `usuarios`

Primera versión del contrato de la API:

GET /usuarios lista la colección 200
POST /usuarios crea un usuario 201 + cabecera Location
GET /usuarios/:id obtiene uno 200 o 404
PUT /usuarios/:id reemplaza uno completo 200 o 404
PATCH /usuarios/:id modifica parte de uno 200 o 404
DELETE /usuarios/:id elimina uno 204 o 404

## Antes y después

Las rutas que convierten la URL en el nombre de una función remota usan HTTP, pero no siguen el diseño REST. En REST, la URL identifica el recurso y el verbo HTTP expresa la acción.

# NO es REST # Sí lo es
GET /obtenerUsuarios GET /usuarios
GET /getUsuarioById?id=7 GET /usuarios/7
POST /crearUsuario POST /usuarios
POST /actualizarUsuario PUT /usuarios/7
POST /borrarUsuario?id=7 DELETE /usuarios/7
GET /usuarios/eliminar/7 DELETE /usuarios/7

## Contrato de error

Todas las respuestas `4xx` y `5xx` usan un único formato:

```json
{
  "error": {
    "codigo": "VALIDACION",
    "mensaje": "La solicitud tiene campos inválidos",
    "detalles": [
      { "campo": "correo", "problema": "formato de correo inválido" },
      { "campo": "edad", "problema": "debe ser un entero mayor que 0" }
    ]
  }
}
```

`codigo` es un identificador estable para el consumidor de la API; `mensaje` está dirigido a la persona que depura. Las trazas de las excepciones se registran en el servidor y nunca se incluyen en la respuesta.

