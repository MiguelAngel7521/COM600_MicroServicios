"""Ejemplo GraphQL. Su memoria es independiente de la del ejemplo REST."""

import strawberry
from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter


# 1. Tipo de salida que el cliente puede consultar.
@strawberry.type
class Empleado:
    id: int
    nombre: str
    puesto: str
    salario: float


# 2. Tipo de entrada para crear un empleado.
@strawberry.input
class EmpleadoEntrada:
    nombre: str
    puesto: str
    salario: float


empleados = [
    Empleado(id=1, nombre="Ana Torres", puesto="Desarrolladora", salario=5000),
    Empleado(id=2, nombre="Luis Pérez", puesto="Diseñador", salario=4500),
]
siguiente_id = 3


# 3. Query: operaciones de lectura.
@strawberry.type
class Query:
    @strawberry.field
    def empleados(self) -> list[Empleado]:
        return empleados

    @strawberry.field
    def empleado(self, id: int) -> Empleado | None:
        for empleado in empleados:
            if empleado.id == id:
                return empleado
        return None


# 4. Mutation: una operación que modifica datos.
@strawberry.type
class Mutation:
    @strawberry.mutation
    def crear_empleado(self, datos: EmpleadoEntrada) -> Empleado:
        global siguiente_id
        if not 2 <= len(datos.nombre.strip()) <= 80:
            raise ValueError("El nombre debe tener entre 2 y 80 caracteres")
        if not 2 <= len(datos.puesto.strip()) <= 80:
            raise ValueError("El puesto debe tener entre 2 y 80 caracteres")
        if datos.salario <= 0:
            raise ValueError("El salario debe ser mayor que cero")
        nuevo = Empleado(
            id=siguiente_id,
            nombre=datos.nombre,
            puesto=datos.puesto,
            salario=datos.salario,
        )
        empleados.append(nuevo)
        siguiente_id += 1
        return nuevo


# 5. Unimos el contrato y lo publicamos en una ruta HTTP.
schema = strawberry.Schema(query=Query, mutation=Mutation)
app = FastAPI(title="GraphQL · Empleados")
app.include_router(GraphQLRouter(schema), prefix="/graphql")
