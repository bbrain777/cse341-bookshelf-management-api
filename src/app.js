const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const { swaggerSetup } = require("./swagger/swagger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/", routes);

swaggerSetup(app);

app.use(errorHandler);

module.exports = app;
