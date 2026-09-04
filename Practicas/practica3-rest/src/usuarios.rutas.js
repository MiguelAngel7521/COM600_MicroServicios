const { Router } = require("express");
const { fallo } = require("./errores");
const {
  borrar,
  crear,
  listar,
  obtener,
  porCorreo,
  reemplazar,
} = require("./repositorio");
const { validarUsuario } = require("./usuarios.validacion");

const router = Router();
const TOPE = 100;

const esCorreoDuplicado = error => error?.code === 11000;

router.get("/", async (req, res) => {
  const pagina = Math.max(1, Number(req.query.pagina) || 1);
  const limite = Math.min(TOPE, Number(req.query.limite) || 20);
  const filtro = {};

  if (req.query.edadMin) {
    filtro.edad = { $gte: Number(req.query.edadMin) };
  }

  const orden = {
    [req.query.ordenPor || "nombre"]: req.query.orden === "desc" ? -1 : 1,
  };
  const { datos, total } = await listar(filtro, orden, pagina, limite);

  return res.json({
    datos,
    paginacion: {
      pagina,
      limite,
      total,
      paginas: Math.ceil(total / limite),
    },
  });
});

router.post("/", async (req, res) => {
  const detalles = validarUsuario(req.body);

  if (detalles.length) {
    return fallo(
      res,
      400,
      "VALIDACION",
      "La solicitud tiene campos inválidos",
      detalles,
    );
  }

  const repetido = await porCorreo(req.body.correo);

  if (repetido) {
    return fallo(res, 409, "CONFLICTO", "El correo ya está registrado");
  }

  const { nombre, correo, edad } = req.body;
  const datos = { nombre, correo, edad };

  try {
    const resultado = await crear(datos);
    const usuario = { _id: resultado.insertedId, ...datos };

    return res
      .status(201)
      .location(`/usuarios/${resultado.insertedId}`)
      .json(usuario);
  } catch (error) {
    if (esCorreoDuplicado(error)) {
      return fallo(res, 409, "CONFLICTO", "El correo ya está registrado");
    }
    throw error;
  }
});

router.get("/:id", async (req, res) => {
  const usuario = await obtener(req.params.id);
  if (!usuario) {
    return fallo(res, 404, "NO_ENCONTRADO", "Usuario no encontrado");
  }
  return res.json(usuario);
});

router.put("/:id", async (req, res) => {
  const detalles = validarUsuario(req.body);

  if (detalles.length) {
    return fallo(
      res,
      400,
      "VALIDACION",
      "La solicitud tiene campos inválidos",
      detalles,
    );
  }

  const { nombre, correo, edad } = req.body;
  const datos = { nombre, correo, edad };

  try {
    const resultado = await reemplazar(req.params.id, datos);
    if (!resultado.matchedCount) {
      return fallo(res, 404, "NO_ENCONTRADO", "Usuario no encontrado");
    }

    const usuario = await obtener(req.params.id);
    return res.json(usuario);
  } catch (error) {
    if (esCorreoDuplicado(error)) {
      return fallo(res, 409, "CONFLICTO", "El correo ya está registrado");
    }
    throw error;
  }
});

router.delete("/:id", async (req, res) => {
  const resultado = await borrar(req.params.id);
  if (!resultado.deletedCount) {
    return fallo(res, 404, "NO_ENCONTRADO", "Usuario no encontrado");
  }
  return res.status(204).end();
});

module.exports = { router };
