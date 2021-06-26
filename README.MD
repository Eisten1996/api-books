### Crear un API REST con respuesta JSON
## Primeros pasos

- Crear una carpeta llamada "api-books"
- Abrirla con un editor de texto de su preferencia aca usaremos visual studio code
- Tener instalado nodeJS y npm

## Crearemos un proyecto nodeJS

Para inicializar el proyecto usaremos:

`npm init -y`

Creamos un archivo llamado server.js donde se colocara el codigo del servidor.
Usaremos el framework EXPRESS para la creacion de la api rest.
Para crear un proyecto en express se usa npm install express.

Para levantar el servidor primero debemos configurar el `server.js`


```javascript
const express = require("express");

const app = express();

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.set("port", process.env.PORT || 9000);

// Server running
app.listen(app.get("port"), () => {
  console.log("Server running on port", app.get("port"));
});
```

Para probar si esta bien lo configurado ponemos en consola

`node server.js`

Tambien en el navegador web para probar el primer endPoint

`http://localhost:9000/`

Instalamos nodemon para no tener que estar deteniendo el servidor cuando queramos ver cambios en el codigo y lo guardamos como dependencia de desarrollo

`npm install --save-dev nodemon`

Configuramos el `package.json` de la siguiente manera

```JSON
{
  "name": "api-books",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "start": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  }
}
```

Ahora solo tendriamos que poner en consola
`npm run start`

Instalaremos las dependencias de la base de datos con:

`npm i mysql express-myconnection`

Creamos la bd en mysql Server con el script

```sql
create database library;

use library;

CREATE TABLE books (
  id int NOT NULL AUTO_INCREMENT,
  titulo varchar(100) NOT NULL,
  autor varchar(100) NOT NULL,
  edicion int DEFAULT NULL,
  PRIMARY KEY (id)
)

INSERT INTO books VALUES (1,'El gato negro','Edgar Alan Poe',6),(2,'El quijote de la mancha','Miguel de Cervantes',3),(2,'Cien años de soledad','Gabriel García Márquez',10);
```

Luego en `server.js` agregamos la confuguracion de conexion a la bd

```javaScript
const express = require("express");
const mysql = require("mysql");
const myconn = require("express-myconnection");

const app = express();

// datos de conexion de db
const dbOptions = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "library",
};

// Middlewares
app.use(myconn(mysql, dbOptions, "single"));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.set("port", process.env.PORT || 9000);

// Server running
app.listen(app.get("port"), () => {
  console.log("Server running on port", app.get("port"));
});

```

Creamos un archivo para las rutas de la api llamado `route.js`

```javaScript
const express = require("express");
const routes = express.Router();

module.exports = routes;
```

Agregamos las rutas al `server.js`

```javaScript
const express = require("express");
const mysql = require("mysql");
const myconn = require("express-myconnection");

const routes = require("./routes");

const app = express();

const dbOptions = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "library",
};

// Middlewares
app.use(myconn(mysql, dbOptions, "single"));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.use("/api", routes);

app.set("port", process.env.PORT || 9000);

// Server running
app.listen(app.get("port"), () => {
  console.log("Server running on port", app.get("port"));
});
```

Creamos en `routes.js` el metodo get

```javascript
const express = require("express");
const routes = express.Router();

routes.get("/", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    } else {
      conn.query("SELECT * FROM BOOKS", (err, rows) => {
        if (err) {
          return res.send(err);
        } else {
          res.json(rows);
        }
      });
    }
  });
});

module.exports = routes;
```

Lo probamos en postaman llamando a la ruta :
`http://localhost:9000/api`

Creamos en `routes.js` el metodo post

```javascript
const express = require("express");
const routes = express.Router();

routes.get("/", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    } else {
      conn.query("SELECT * FROM BOOKS", (err, rows) => {
        if (err) {
          return res.send(err);
        } else {
          res.json(rows);
        }
      });
    }
  });
});

routes.post("/", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    } else {
      conn.query("INSERT INTO BOOKS SET ?", [req.body], (err, rows) => {
        if (err) {
          return res.send(err);
        } else {
          res.send("Book insert");
        }
      });
    }
  });
});

module.exports = routes;
```

Lo probamos en postman con la ruta
http://localhost:9000/api
y el body

```json
{
  "titulo": "El mundo es ancho y ajeno",
  "autor": "Ciro Alegria",
  "edicion": 5
}
```

Creamos en `routes.js` el metodo delete

```javascript
const express = require("express");
const routes = express.Router();

routes.get("/", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    } else {
      conn.query("SELECT * FROM BOOKS", (err, rows) => {
        if (err) {
          return res.send(err);
        } else {
          res.json(rows);
        }
      });
    }
  });
});

routes.post("/", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    } else {
      conn.query("INSERT INTO BOOKS SET ?", [req.body], (err, rows) => {
        if (err) {
          return res.send(err);
        } else {
          res.send("Book insert");
        }
      });
    }
  });
});

routes.delete("/:id", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    } else {
      conn.query(
        "DELETE FROM BOOKS WHERE ID = ?",
        [req.params.id],
        (err, rows) => {
          if (err) {
            return res.send(err);
          } else {
            res.send("Book deleted");
          }
        }
      );
    }
  });
});

module.exports = routes;
```

Para probarlo usaremos la ruta
`http://localhost:9000/api/1`

Creamos en routes.js el metodo put

```javascript
const express = require("express");
const routes = express.Router();

routes.get("/", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    } else {
      conn.query("SELECT * FROM BOOKS", (err, rows) => {
        if (err) {
          return res.send(err);
        } else {
          res.json(rows);
        }
      });
    }
  });
});

routes.post("/", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    } else {
      conn.query("INSERT INTO BOOKS SET ?", [req.body], (err, rows) => {
        if (err) {
          return res.send(err);
        } else {
          res.send("Book insert");
        }
      });
    }
  });
});

routes.delete("/:id", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    } else {
      conn.query(
        "DELETE FROM BOOKS WHERE ID = ?",
        [req.params.id],
        (err, rows) => {
          if (err) {
            return res.send(err);
          } else {
            res.send("Book deleted");
          }
        }
      );
    }
  });
});

routes.put("/:id", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    } else {
      conn.query(
        "Update books set ? where id = ?",
        [req.body, req.params.id],
        (err, rows) => {
          if (err) {
            return res.send(err);
          } else {
            res.send("Book updated!");
          }
        }
      );
    }
  });
});

module.exports = routes;
```

Para probarlo usaremos la ruta
http://localhost:9000/api/2
y el body

```json
{
  "edicion": 35
}
```