"""Ejemplo REST de empleados. Los datos se guardan solo en memoria."""

from pathlib import Path

from fastapi import FastAPI, HTTPException, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

app = FastAPI(title="REST · Empleados", version="1.0")


class EmpleadoEntrada(BaseModel):
    nombre: str = Field(min_length=2, max_length=80)
    puesto: str = Field(min_length=2, max_length=80)
    salario: float = Field(gt=0, allow_inf_nan=False)


class Empleado(EmpleadoEntrada):
    id: int


empleados = {
    1: Empleado(id=1, nombre="Ana Torres", puesto="Desarrolladora", salario=5000),
    2: Empleado(id=2, nombre="Luis Pérez", puesto="Diseñador", salario=4500),
}
siguiente_id = 3


@app.get("/empleados", response_model=list[Empleado])
async def listar_empleados():
    return list(empleados.values())


@app.get("/empleados/{empleado_id}", response_model=Empleado)
async def obtener_empleado(empleado_id: int):
    if empleado_id not in empleados:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleados[empleado_id]


@app.post("/empleados", response_model=Empleado, status_code=201)
async def crear_empleado(datos: EmpleadoEntrada):
    global siguiente_id
    nuevo = Empleado(id=siguiente_id, **datos.model_dump())
    empleados[siguiente_id] = nuevo
    siguiente_id += 1
    return nuevo


@app.put("/empleados/{empleado_id}", response_model=Empleado)
async def actualizar_empleado(empleado_id: int, datos: EmpleadoEntrada):
    if empleado_id not in empleados:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    actualizado = Empleado(id=empleado_id, **datos.model_dump())
    empleados[empleado_id] = actualizado
    return actualizado


@app.delete("/empleados/{empleado_id}", status_code=204)
async def eliminar_empleado(empleado_id: int):
    if empleado_id not in empleados:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    del empleados[empleado_id]
    return Response(status_code=204)


app.mount(
    "/web",
    StaticFiles(directory=Path(__file__).parent / "web", html=True),
    name="web",
)
