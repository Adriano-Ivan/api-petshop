const roteador = require("express").Router();
const TabelaFornecedor = require("./TabelaFornecedor");
const Fornecedor = require("./Fornecedor");
const { SerializadorFornecedor } = require("./../../serializador/Serializador");
// const Serializador = require("./../../serializador/Serializador");

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
    res.getHeader("Content-Type"),
    ["empresa"]
  );

  res.send(serializador.serializar(resultados));
});

roteador.post("/", async (req, res, next) => {
  try {
    const dadosRecebidos = req.body;
    const fornecedor = new Fornecedor(dadosRecebidos);
    await fornecedor.criar();
    res.status(201);

    const serializador = new SerializadorFornecedor(
      res.getHeader("Content-Type"),
      ["empresa"]
    );

    res.send(serializador.serializar(fornecedor));
  } catch (erro) {
    next(erro);
  }
});

roteador.options("/:id", (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, PUT, DELETE");
  res.status(204);
  res.end();
});

roteador.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const fornecedor = new Fornecedor({ id: id });
    res.status(200);

    await fornecedor.carregar();

    const serializador = new SerializadorFornecedor(
      res.getHeader("Content-Type"),
      ["email", "empresa", "dataCriacao", "dataAtualizacao", "versao"]
    );

    res.send(serializador.serializar(fornecedor));
  } catch (erro) {
    next(erro);
  }
});

roteador.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const dadosRecebidos = req.body;
    const dados = Object.assign({}, dadosRecebidos, { id: id });
    const fornecedor = new Fornecedor(dados);

    await fornecedor.atualizar();
    res.status(204);
    res.end();
  } catch (erro) {
    next(erro);
  }
});

roteador.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const fornecedor = new Fornecedor({ id: id });
    await fornecedor.carregar();
    await fornecedor.remover();
    res.status(204);
    res.end();
  } catch (erro) {
    next(erro);
  }
});

const roteadorProdutos = require("./../produtos/index");

const verificarFornecedor = async (req, res, next) => {
  try {
    const id = req.params.idFornecedor;
    const fornecedor = new Fornecedor({ id: id });
    await fornecedor.carregar();
    req.fornecedor = fornecedor;
    next();
  } catch (erro) {
    next(erro);
  }
};

roteador.use("/:idFornecedor/produtos", verificarFornecedor, roteadorProdutos);

module.exports = roteador;
