const express = require("express");
const path = require("path");
const cors = require("cors");
const allRoutes = require("./routes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://together-client.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use("/files", require("./routes/privateFile.route"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to ToGetHer API" });
});

app.use(allRoutes);

module.exports = app;
