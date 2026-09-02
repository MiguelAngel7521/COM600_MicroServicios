# Ejercicio 3 — Persistencia, respaldo y restauración

Este stack guarda las tareas en el volumen nombrado `parte2_ej3_datos_mongo`. El nombre puede cambiarse con `MONGO_VOLUME` en el `.env` local.

El respaldo se realiza desde un contenedor Alpine efímero porque Docker monta el volumen de forma portable y controlada. Copiar el `Mountpoint` directamente depende del sistema del host, puede exigir privilegios y en Docker Desktop esa ruta vive dentro de la máquina virtual. El contenedor efímero desaparece al terminar y el archivo `.tar.gz` queda en la carpeta del proyecto.

La secuencia completa, incluidos los diez `POST`, la destrucción y la restauración, está explicada en la guía principal `../GUIA_COMPLETA.md`.
