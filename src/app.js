const express = require("express");
const app = express();
const allRoutes = require("./routes");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to ToGetHer API" });
});

app.use(allRoutes);

module.exports = app;
