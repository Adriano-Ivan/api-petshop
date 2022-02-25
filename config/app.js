const express = require("express");
const app = express();
const roteadorFornecedores = require("./../api/rotas/fornecedores/index");

app.use(express.json());

app.use("/api/fornecedores", roteadorFornecedores);

module.exports = app;
