const CORREO = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;

function validarUsuario(cuerpo = {}) {
  const detalles = [];
  const { nombre, correo, edad } = cuerpo;

  if (!nombre || String(nombre).trim().length < 3) {
    detalles.push({
      campo: "nombre",
      problema: "obligatorio, mínimo 3 caracteres",
    });
  }

  if (!CORREO.test(String(correo || ""))) {
    detalles.push({
      campo: "correo",
      problema: "formato de correo inválido",
    });
  }

  if (!Number.isInteger(edad) || edad <= 0 || edad > 120) {
    detalles.push({
      campo: "edad",
      problema: "entero entre 1 y 120",
    });
  }

  return detalles;
}

module.exports = { validarUsuario };