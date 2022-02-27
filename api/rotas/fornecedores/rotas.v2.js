const roteador = require("express").Router();
const TabelaFornecedor = require("./TabelaFornecedor");
const { SerializadorFornecedor } = require("./../../serializador/Serializador");

roteador.options("/", (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.status(204);
  res.end();
});
roteador.get("/", async (req, res) => {
  const resultados = await TabelaFornecedor.listar();
  res.status(200);
  const serializador = new SerializadorFornecedor(
    res.getHeader("Content-Type")
  );

  res.send(serializador.serializar(resultados));
});

module.exports = roteador;
