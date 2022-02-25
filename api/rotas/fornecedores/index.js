const roteador = require("express").Router();
const TabelaFornecedor = require("./TabelaFornecedor");

roteador.get("/", async (req, res) => {
  const resultados = await TabelaFornecedor.listar();
  res.json({
    resultados,
  });
});

module.exports = roteador;
