# Tarea 1 - CRUD de Candidatos con Node.js, Express y TypeORM

Aplicación web de práctica con Express + EJS + TypeORM que realiza operaciones CRUD
(Crear, Leer, Actualizar, Eliminar) sobre las tablas `candidatos`, `cargos` y `lugar`.

---

## 1. ¿Qué es TypeORM?

TypeORM es un **ORM (Object Relational Mapper)** para Node.js. Un ORM permite trabajar
con bases de datos relacionales (MySQL, PostgreSQL, etc.) usando **objetos y métodos de
JavaScript** en lugar de escribir SQL a mano.

En lugar de escribir:

```sql
INSERT INTO candidatos (ci, nombres, apellido1, apellido2, cargo_id, lugar_id)
VALUES ('1234567', 'Juan', 'Perez', 'Lopez', 1, 2);
```

Escribimos:

```js
await candidatoRepo.save({ ci: '1234567', nombres: 'Juan', ... });
```

TypeORM se encarga de traducir esas llamadas a las consultas SQL correctas.

### Beneficios

- No escribir SQL manual (menos errores de sintaxis).
- El código es independiente del motor de base de datos (puedes cambiar de MySQL a
  PostgreSQL cambiando una línea en `db.js`).
- Prevención de **inyección SQL** (las consultas se construyen de forma segura).
- `synchronize: true` puede crear y actualizar las tablas automáticamente según las
  entidades definidas.

---

## 2. Conceptos principales de TypeORM

| Concepto | ¿Qué es? |
|---|---|
| **Entity (Entidad)** | Clase u objeto que representa una tabla de la base de datos. Cada propiedad es una columna. |
| **Columnas** | Cada campo de la entidad. Se definen con su tipo (`varchar`, `int`, ...) y longitud. |
| **Relaciones** | Cómo se conectan las tablas entre sí: `ManyToOne`, `OneToMany`, `ManyToMany`, `OneToOne`. |
| **DataSource** | El objeto que gestiona la conexión a la base de datos y conoce todas las entidades. |
| **Repository** | Objeto que da acceso a las operaciones CRUD de una entidad específica (find, save, delete...). |
| **EntitySchema** | Forma de definir entidades en JavaScript plano (sin TypeScript y sin decoradores). |

---

## 3. Cómo está organizado nuestro proyecto

```
Tarea 1/
├── .env               → Configuración (puerto, credenciales de la BD)
├── package.json       → Dependencias y scripts
├── app.js             → Servidor Express (configura y conecta los routers)
├── db.js              → Configuración del DataSource (la conexión)
├── repos.js           → Repositorios compartidos (candidato, cargo, lugar)
├── database.sql       → Script SQL opcional para importar en phpMyAdmin
├── entities/
│   ├── Cargo.js       → Entidad de la tabla `cargos`
│   ├── Lugar.js       → Entidad de la tabla `lugar`
│   └── Candidato.js   → Entidad de la tabla `candidatos` (con relaciones)
├── routes/
│   ├── candidatos.js  → CRUD de candidatos (rutas con prefijo /candidatos)
│   ├── cargos.js      → CRUD de cargos (rutas con prefijo /cargos)
│   └── lugares.js     → CRUD de lugares (rutas con prefijo /lugares)
└── views/             → Plantillas EJS (listas y formularios)
```

---

## 4. El flujo completo de una petición

Tomemos como ejemplo: **crear un candidato** desde el formulario.

```
Usuario llena el formulario (views/form.ejs)
          │  POST /candidatos
          ▼
app.js  →  app.post('/candidatos', ...)   ← Express recibe los datos (req.body)
          │
          ▼
candidatoRepo.create({ ... })             ← Crea el objeto en memoria
          │
          ▼
candidatoRepo.save(candidato)             ← TypeORM genera el INSERT y lo ejecuta
          │
          ▼
MySQL (tabla candidatos)                  ← Datos guardados en la base
          │
          ▼
res.redirect('/')                         ← Volvemos a la lista
```

Y para **listar**:

```
GET /
  ▼
candidatoRepo.find({ relations: ['cargo', 'lugar'] })
  ▼  TypeORM traduce a:  SELECT * FROM candidatos
                        JOIN cargos ON candidatos.cargo_id = cargos.id
                        JOIN lugar  ON candidatos.lugar_id  = lugar.id
  ▼
res.render('index', { candidatos })  →  EJS recorre los datos con forEach y dibuja la tabla
```

---

## 5. Archivo por archivo

### 5.1 `.env` — Configuración

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=candidatos
```

Son variables de entorno leídas con el paquete `dotenv`. Nunca se escriben credenciales
directamente en el código: se leen desde aquí, lo que facilita cambiar de base de datos.

### 5.2 `db.js` — El DataSource (la conexión)

```js
const AppDataSource = new DataSource({
  type: 'mysql',                      // Motor de la base
  host: process.env.DB_HOST,          // Desde el .env
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,                  // Crea/actualiza las tablas automáticamente
  entities: [Cargo, Lugar, Candidato], // Entidades que TypeORM debe conocer
});
```

- `type: 'mysql'` → TypeORM usa el driver `mysql2` (por eso está como dependencia).
- `synchronize: true` → al conectar, TypeORM compara las entidades con las tablas
  existentes y crea las que falten. Es cómodo en desarrollo; en producción se usan
  migraciones en su lugar.
- `entities` → sin esto TypeORM no sabría qué tablas existen.

### 5.3 `entities/Cargo.js` — Una entidad simple

```js
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Cargo',                    // Nombre con el que TypeORM la identifica
  tableName: 'cargos',              // Nombre real de la tabla en MySQL
  columns: {
    id: { type: 'int', primary: true, generated: true },  // AUTO_INCREMENT
    nombre: { type: 'varchar', length: 50 },
  },
});
```

- `name` es el identificador interno; se usa en `getRepository('Cargo')` y en las
  relaciones (`target: 'Cargo'`).
- `tableName` es el nombre físico de la tabla.
- `generated: true` equivale a `AUTO_INCREMENT` en MySQL.

### 5.4 `entities/Candidato.js` — Entidad con relaciones

```js
relations: {
  cargo: {
    type: 'many-to-one',              // Muchos candidatos → un cargo
    target: 'Cargo',                  // Entidad relacionada (por su `name`)
    joinColumn: { name: 'cargo_id' }, // Columna FK que se crea en la tabla
    onDelete: 'RESTRICT',             // No deja borrar un cargo usado
    nullable: false,                  // La columna NO puede ser NULL
  },
  lugar: { ... }                      // Igual con la tabla lugar
}
```

Qué hace TypeORM aquí:

- Crea automáticamente la columna `cargo_id INT NOT NULL` en `candidatos`.
- Crea la clave foránea hacia `cargos.id` (con `ON DELETE RESTRICT`).
- Al hacer `find({ relations: [...] })` rellena `candidato.cargo` con el objeto cargo
  completo, en lugar de dejar solo el número `cargo_id`.

Por eso en las vistas usamos `candidato.cargo.nombre` en lugar de manejar el `cargo_id` a mano.

### 5.5 `routes/` — Los routers (rutas separadas por recurso)

Cada archivo de `routes/` es un **Router** de Express: un conjunto de rutas relacionadas
con un mismo recurso. Cada uno tiene su propio archivo para que las búsquedas sean fáciles:

| Archivo | Rutas que contiene |
|---|---|
| `routes/candidatos.js` | `GET /` · `GET /nuevo` · `POST /` · `GET /editar/:ci` · `POST /editar/:ci` · `GET /eliminar/:ci` |
| `routes/cargos.js` | `GET /` · `POST /` · `GET /editar/:id` · `POST /editar/:id` · `GET /eliminar/:id` |
| `routes/lugares.js` | `GET /` · `POST /` · `GET /editar/:id` · `POST /editar/:id` · `GET /eliminar/:id` |

Por ejemplo, `routes/candidatos.js`:

```js
const express = require('express');
const router = express.Router();          // Crea un router independiente
const { repos } = require('../repos');    // Usa los repositorios compartidos

router.get('/', async (req, res) => {     // Rutas "relativas": solo el trozo que falta
  const candidatos = await repos.candidato.find({ relations: ['cargo', 'lugar'] });
  res.render('index', { candidatos });
});

module.exports = router;                  // Se exporta para conectarlo en app.js
```

Dentro del archivo las rutas se escriben **relativas** (sin el prefijo `/candidatos`),
porque el prefijo se le pone al conectarlo en `app.js` (ver más abajo).

### 5.6 `repos.js` — Repositorios compartidos

Como hay tres archivos de rutas, los repositorios viven en un único lugar (`repos.js`)
para no repetir `getRepository` en cada router:

```js
const repos = { candidato: null, cargo: null, lugar: null };

function iniciarRepos() {
  repos.candidato = AppDataSource.getRepository('Candidato');   // ← se llama una sola vez
  repos.cargo     = AppDataSource.getRepository('Cargo');
  repos.lugar     = AppDataSource.getRepository('Lugar');
}
```

Los routers hacen `const { repos } = require('../repos')` y usan `repos.candidato`,
`repos.cargo` o `repos.lugar` según el recurso.

Un **Repository** es la puerta de entrada a una tabla. Métodos principales usados:

| Método | Función | Equivalente SQL |
|---|---|---|
| `repo.find()` | Obtener todos los registros | `SELECT * FROM ...` |
| `repo.find({ relations: [...] })` | Traer registros incluyendo sus relaciones | `SELECT ... JOIN ...` |
| `repo.findOneBy({ col: valor })` | Buscar un registro por columna | `SELECT * WHERE col = valor` |
| `repo.findOne({ where, relations })` | Igual que el anterior pero permite relaciones | `SELECT ... JOIN ... WHERE` |
| `repo.create({ ... })` | Crear el objeto en memoria (sin insertar) | — (solo prepara el objeto) |
| `repo.save(obj)` | Insertar si es nuevo, actualizar si ya existe | `INSERT` / `UPDATE` |
| `repo.delete({ col: valor })` | Eliminar por columna | `DELETE WHERE col = valor` |

Ejemplo de lectura (ruta `GET /` en `routes/candidatos.js`):

```js
const candidatos = await repos.candidato.find({ relations: ['cargo', 'lugar'] });
res.render('index', { candidatos });
```

Ejemplo de escritura (ruta `POST /` en `routes/candidatos.js`):

```js
const candidato = repos.candidato.create({
  ci: req.body.ci,                       // Datos del formulario
  ...
  cargo: await cargoRepo.findOneBy({ id: parseInt(req.body.cargo_id) }),
  lugar: await repos.lugar.findOneBy({ id: parseInt(req.body.lugar_id) }),
});
await repos.candidato.save(candidato);    // Aquí TypeORM ejecuta el INSERT
```

Note cómo asignamos la relación: en vez de un número suelto, buscamos el objeto cargo y
se lo asignamos. TypeORM extrae su `id` para guardarlo en `cargo_id`.

### 5.7 `app.js` — El servidor que conecta todo

`app.js` quedó pequeño: solo configura Express, llama a `inicio()` (que conecta la base
de datos y prepara los repositorios) y **conecta los routers**:

```js
app.use('/', candidatosRouter);    // Las rutas de candidatos.js se sirven en /
app.use('/cargos', cargosRouter);  // Las rutas de cargos.js     se sirven en /cargos
app.use('/lugares', lugaresRouter);// Las rutas de lugares.js   se sirven en /lugares
```

El `app.use('/cargos', router)` hace el "pegado" de las rutas relativas: una ruta
`GET /editar/:id` definida dentro de `cargos.js` queda accesible en la URL
`GET /cargos/editar/:id`. Gracias a esto las vistas no tuvieron que cambiar y los
enlaces siguen siendo los mismos.

---

## 6. Preguntas frecuentes

**¿Por qué `synchronize: true` y también un `database.sql`?**
`synchronize` crea las tablas solo si no existen. El SQL es opcional (sirve si prefieres
crear la base "a mano" con phpMyAdmin). Con cualquiera de los dos vas a obtener el mismo
resultado.

**¿Qué pasa si instalo TypeScript?**
No lo necesitas. Aquí usamos JavaScript y la alternativa de TypeORM sin decoradores es
`EntitySchema`, que es exactamente lo que hay en la carpeta `entities/`.

**¿Cómo cambio de MySQL a otra base de datos?**
Cambiar `type: 'mysql'` por `'postgres'` o `'mariadb'` en `db.js` (e instalar el driver
correspondiente). Las entidades y rutas no cambian.

**¿Qué hace `onDelete: 'RESTRICT'`?**
Evita que puedas borrar un cargo o lugar que esté siendo usado por algún candidato;
MySQL rechaza la eliminación con un error de clave foránea (protege la integridad).

**¿Qué hace `parseInt` en las rutas?**
Los datos de un formulario llegan como texto (`"3"`). `parseInt` los convierte a número
para que coincidan con el tipo `int` de la base.

**¿Cómo encuentro una ruta rápida?**
Piensa en el recurso: cualquier URL con `/candidatos` está en `routes/candidatos.js` y
así sucesivamente. Si necesitas cambiar el servidor (puerto, motor de vistas), ve a
`app.js`; si es cuestión de la conexión, a `db.js`; si son las tablas, a `entities/`.

---

## 7. Cómo ejecutar el proyecto

```bash
npm install        # Instala las dependencias (una sola vez)
npm run dev        # Inicia con nodemon (reinicia solo al guardar)
# o
npm run serve      # Inicia con node normal
```

Luego abre `http://localhost:3000` (o el puerto indicado en tu `.env`).

---

## 8. Dependencias del proyecto

| Paquete | Para qué sirve |
|---|---|
| `express` | Servidor web y rutas |
| `ejs` | Motor de plantillas (las vistas `.ejs`) |
| `typeorm` | El ORM (conexión, entidades, repositorios) |
| `mysql2` | Driver que TypeORM usa para hablar con MySQL |
| `dotenv` | Lee las variables del archivo `.env` |
| `nodemon` | (solo desarrollo) Reinicia el servidor al guardar cambios |