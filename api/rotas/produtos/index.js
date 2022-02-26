const express = require("express");
const roteador = express.Router({ mergeParams: true });
const Tabela = require("./TabelaProduto");
const Produto = require("./Produto");
const { SerializadorProduto } = require("./../../serializador/Serializador");
const Serializador = require("./../../serializador/Serializador");

roteador.get("/", async (req, res) => {
  const produtos = await Tabela.listar(req.fornecedor.id);
  const serializador = new SerializadorProduto(res.getHeader("Content-Type"));

  res.send(serializador.serializar(produtos));
});

roteador.post("/", async (req, res, next) => {
  try {
    const idFornecedor = req.fornecedor.id;
    const corpo = req.body;
    const dados = Object.assign({}, corpo, { fornecedor: idFornecedor });
    const produto = new Produto(dados);
    await produto.criar();

    const serializador = new SerializadorProduto(res.getHeader("Content-Type"));

    res.status(201);
    res.send(serializador.serializar(produto));
  } catch (erro) {
    next(erro);
  }
});

roteador.delete("/:id", async (req, res) => {
  const dados = {
    id: req.params.id,
    fornecedor: req.fornecedor.id,
  };

  const produto = new Produto(dados);
  await produto.apagar();
  res.status(204);
  res.end();
});

roteador.get("/:id", async (req, res, next) => {
  try {
    const dados = {
      id: req.params.id,
      fornecedor: req.fornecedor.id,
    };

    const produto = new Produto(dados);
    await produto.carregar();

    const serializador = new SerializadorProduto(
      res.getHeader("Content-Type"),
      [
        "preco",
        "estoque",
        "dataCriacao",
        "dataAtualizacao",
        "versao",
        "fornecedor",
      ]
    );

    res.send(serializador.serializar(produto));
  } catch (erro) {
    next(erro);
  }
});

roteador.put("/:id", async (req, res, next) => {
  try {
    const dados = Object.assign({}, req.body, {
      id: req.params.id,
      fornecedor: req.fornecedor.id,
    });

    const produto = new Produto(dados);

    await produto.atualizar();
    res.status(204);
    res.end();
  } catch (erro) {
    next(erro);
  }
});

module.exports = roteador;
