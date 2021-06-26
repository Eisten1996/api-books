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
