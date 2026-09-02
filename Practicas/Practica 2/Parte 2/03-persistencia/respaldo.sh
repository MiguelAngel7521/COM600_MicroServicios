#!/bin/sh
set -eu

VOLUME_NAME="${MONGO_VOLUME:-parte2_ej3_datos_mongo}"
BACKUP_DATE="$(date +%Y-%m-%d_%H-%M-%S)"
BACKUP_FILE="backup_mongo_${BACKUP_DATE}.tar.gz"

docker run --rm \
  -v "${VOLUME_NAME}:/data:ro" \
  -v "$(pwd):/backup" \
  alpine \
  tar czf "/backup/${BACKUP_FILE}" -C /data .

echo "Respaldo creado: ${BACKUP_FILE}"
