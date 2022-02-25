const express = require("express");
const app = express();
const roteadorFornecedores = require("./../api/rotas/fornecedores/index");

app.use("/api/fornecedores", roteadorFornecedores);
app.use(express.json());

module.exports = app;
