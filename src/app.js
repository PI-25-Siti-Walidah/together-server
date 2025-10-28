const express = require("express");
const path = require("path");
const allRoutes = require("./routes");

const app = express();
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to ToGetHer API" });
});

app.use(allRoutes);

module.exports = app;
