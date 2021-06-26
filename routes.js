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
