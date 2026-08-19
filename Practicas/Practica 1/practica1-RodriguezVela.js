

use('tienda');

print("--- INICIO DE LA PRÁCTICA COMPLETA ---");


// B1. Mostrá los productos de la categoría 2 o 7, con el nombre y el precio únicamente, sin el _id.
db.productos.find(
  { categoria: { $in: [2, 7] } },
  { nombre: 1, precio: 1, _id: 0 }
);

// B2. Mostrá los productos cuyo precio esté entre 100 y 300, incluidos los dos extremos.
db.productos.find({ precio: { $gte: 100, $lte: 300 } });

// B3. Mostrá los productos que no están activos.
db.productos.find({ activo: false });

// B4. Mostrá los productos cuyo nombre empiece con la letra A o con la letra C.
db.productos.find({ nombre: /^[AC]/ });

// B5. Mostrá los productos que tienen el campo variantes.
db.productos.find({ variantes: { $exists: true } });

// B6. Encontrá los productos donde stock_minimo se cargó como texto en vez de número.
db.productos.find({ stock_minimo: { $type: "string" } });

// B7. Mostrá los 4 productos con más stock, con el nombre y el stock únicamente.
db.productos.find({}, { nombre: 1, stock: 1, _id: 0 }).sort({ stock: -1 }).limit(4);

// B8. Mostrá la segunda página de un listado ordenado por nombre ascendente, de 4 en 4.
db.productos.find().sort({ nombre: 1 }).skip(4).limit(4);

// B9. Mostrá los productos que tengan la etiqueta "organico" o la etiqueta "artesania".
db.productos.find({ etiquetas: { $in: ["organico", "artesania"] } });

// B10. Mostrá los productos cuyo array categorias tenga exactamente un elemento.
db.productos.find({ categorias: { $size: 1 } });

// B11. Mostrá los productos con menos de 10 unidades en el almacén de La Paz (versión sin $elemMatch y con $elemMatch).
db.productos.find({ "inventario.almacen": "La Paz", "inventario.cantidad": { $lt: 10 } });
db.productos.find({ inventario: { $elemMatch: { almacen: "La Paz", cantidad: { $lt: 10 } } } });

// B12. Mostrá los productos cuya primera categoría del array categorias sea 1.
db.productos.find({ "categorias.0": 1 });

// B13. Mostrá los productos registrados durante el año 2025.
db.productos.find({
  registrado: {
    $gte: new Date("2025-01-01T00:00:00Z"),
    $lt: new Date("2026-01-01T00:00:00Z")
  }
});

// B14. Averiguá cuántos productos están activos. Se pide el número, no la lista.
db.productos.countDocuments({ activo: true });

// B15. Mostrá los pedidos de la ciudad de Sucre cuyo total sea mayor a 300.
db.pedidos.find({ ciudad: "Sucre", total: { $gt: 300 } });

// B16. Mostrá los pedidos que incluyan el producto de código "ALM-005".
db.pedidos.find({ "items.codigo": "ALM-005" });

// B17. Mostrá los pedidos que tengan más de un ítem.
db.pedidos.find({ "items.1": { $exists: true } });

// B18. Mostrá la lista de clientes distintos que hicieron pedidos.
db.pedidos.distinct("cliente");


// B19. Insertá un producto nuevo con array de textos, subdocumento y array de subdocumentos.
db.productos.insertOne({
  codigo: 'MCO-001',
  nombre: 'Miel de abeja orgánica del Chaco',
  precio: 50,
  stock: 40,
  stock_minimo: 10,
  activo: true,
  categoria: 1,
  categorias: [1, 9],
  etiquetas: ['miel', 'organico', 'natural'],
  medidas: { alto: 15, ancho: 8, unidad: 'cm' },
  inventario: [
    { almacen: 'Sucre', cantidad: 20 },
    { almacen: 'Tarija', cantidad: 20 }
  ],
  registrado: new Date()
});

// B20. Insertá tres productos más en una sola instrucción.
db.productos.insertMany([
  {
    codigo: 'ALM-012',
    nombre: 'Sal artesanal del Salar de Uyuni 1 kg',
    precio: 35,
    stock: 110,
    stock_minimo: 20,
    activo: true,
    categoria: 1,
    categorias: [1],
    etiquetas: ['sal', 'uyuni', 'mineral'],
    medidas: { alto: 20, ancho: 12, unidad: 'cm' },
    inventario: [
      { almacen: 'Potosí', cantidad: 60 },
      { almacen: 'La Paz', cantidad: 50 }
    ],
    registrado: new Date()
  },
  {
    codigo: 'CER-008',
    nombre: 'Plato decorativo de cerámica de Moxos',
    precio: 210,
    stock: 14,
    stock_minimo: 4,
    activo: true,
    categoria: 5,
    categorias: [5, 8],
    etiquetas: ['ceramica', 'beni', 'arte'],
    medidas: { alto: 5, ancho: 30, unidad: 'cm' },
    inventario: [
      { almacen: 'Cochabamba', cantidad: 14 }
    ],
    registrado: new Date()
  },
  {
    codigo: 'TEX-013',
    nombre: 'Faja tradicional de aguayo',
    precio: 95,
    stock: 25,
    stock_minimo: 6,
    activo: true,
    categoria: 4,
    categorias: [4, 8],
    etiquetas: ['textil', 'tradicional', 'artesania'],
    medidas: { alto: 10, ancho: 120, unidad: 'cm' },
    inventario: [
      { almacen: 'Sucre', cantidad: 15 },
      { almacen: 'Potosí', cantidad: 10 }
    ],
    registrado: new Date()
  }
]);

// B21. Insertar un pedido con _id 7
db.pedidos.insertOne({
  _id: 7,
  cliente: 'Camila Rojas',
  ciudad: 'Sucre',
  total: 245,
  items: [
    { codigo: 'ART-015', cantidad: 1, precio_unitario: 150 },
    { codigo: 'TEX-013', cantidad: 1, precio_unitario: 95 }
  ],
  registrado: new Date()
});

// B22. Insertar un producto sin el campo precio y contarlos
db.productos.insertOne({
  codigo: 'OTR-999',
  nombre: 'Producto sin precio de prueba',
  stock: 10,
  activo: true,
  categoria: 1,
  registrado: new Date()
});
const sinPrecio = db.productos.countDocuments({ precio: { $exists: false } });
print("Productos sin precio:", sinPrecio);



// B23. Subir un 10% el precio de los productos de la categoría 4
db.productos.updateMany(
  { categoria: 4 },
  { $mul: { precio: 1.10 } }
);

// B24. Pasar a 'entregado' los pedidos 'enviado' y registrar fecha
db.pedidos.updateMany(
  { estado: 'enviado' },
  { 
    $set: { 
      estado: 'entregado', 
      fecha_entrega: new Date() 
    } 
  }
);

// B25. Agregar etiqueta 'liquidacion' a productos inactivos sin duplicar
db.productos.updateMany(
  { activo: false },
  { $addToSet: { etiquetas: "liquidacion" } }
);

// B26. Borrar stock_minimo como texto y verificar
db.productos.updateMany(
  { stock_minimo: { $type: "string" } },
  { $unset: { stock_minimo: "" } }
);

// B27. Agregar almacén 'Camiri' al café de los Yungas (ALM-011)
db.productos.updateOne(
  { codigo: 'ALM-011' },
  { $push: { inventario: { almacen: 'Camiri', cantidad: 5 } } }
);

// B28. Upsert para 'BEB-030'
db.productos.updateOne(
  { codigo: 'BEB-030' },
  { 
    $set: { 
      nombre: 'Refresco tradicional de Mocochachí', 
      precio: 40, 
      stock: 25 
    } 
  },
  { upsert: true }
);


// B29. Contar y borrar pedidos cancelados
const cancelados = db.pedidos.countDocuments({ estado: 'cancelado' });
print("Pedidos cancelados encontrados:", cancelados);
db.pedidos.deleteMany({ estado: 'cancelado' });

// B30. Contar y eliminar un solo producto con etiqueta 'textil'
const textiles = db.productos.countDocuments({ etiquetas: 'textil' });
print("Productos textiles encontrados:", textiles);
db.productos.deleteOne({ etiquetas: 'textil' });

// B31. Eliminar productos con stock menor a 5
db.productos.deleteMany({ stock: { $lt: 5 } });

// B32. Restaurar la base al punto de partida y verificar conteos finales
load("seed.js");

//Comprobación final pedida por la consigna
const totalProductos = db.productos.countDocuments();
const totalPedidos = db.pedidos.countDocuments();

print("Productos actuales (esperados 12):", totalProductos);
print("Pedidos actuales (esperados 6):", totalPedidos);

