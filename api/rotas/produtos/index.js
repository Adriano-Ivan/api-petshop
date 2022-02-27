const express = require("express");
const roteador = express.Router({ mergeParams: true });
const Tabela = require("./TabelaProduto");
const Produto = require("./Produto");
const { SerializadorProduto } = require("./../../serializador/Serializador");
const Serializador = require("./../../serializador/Serializador");

roteador.options("/", (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.status(204);
  res.end();
});

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

    res.set("ETag", produto.versao);
    const timestamp = new Date(produto.dataAtualizacao).getTime();
    res.set("Last-Modified", timestamp);
    res.set(
      "Location",
      `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`
    );
    res.status(201);
    res.send(serializador.serializar(produto));
  } catch (erro) {
    next(erro);
  }
});

roteador.options("/:id", (req, res) => {
  res.set("Access-Control-Allow-Methods", "DELETE, GET, HEAD, PUT");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.status(204);
  res.end();
});
roteador.delete("/:id", async (req, res, next) => {
  try {
    const dados = {
      id: req.params.id,
      fornecedor: req.fornecedor.id,
    };

    const produto = new Produto(dados);
    await produto.apagar();
    res.status(204);
    res.end();
  } catch (erro) {
    next(erro);
  }
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
    res.set("ETag", produto.versao);
    const timestamp = new Date(produto.dataAtualizacao).getTime();
    res.set("Last-Modified", timestamp);

    res.send(serializador.serializar(produto));
  } catch (erro) {
    next(erro);
  }
});

roteador.head("/:id", async (req, res, next) => {
  try {
    const dados = {
      id: req.params.id,
      fornecedor: req.fornecedor.id,
    };

    const produto = new Produto(dados);
    await produto.carregar();

    res.set("ETag", produto.versao);
    const timestamp = new Date(produto.dataAtualizacao).getTime();
    res.set("Last-Modified", timestamp);
    res.status(200);
    res.end();
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
    await produto.carregar();
    res.set("ETag", produto.versao);
    const timestamp = new Date(produto.dataAtualizacao).getTime();
    res.set("Last-Modified", timestamp);

    res.status(204);
    res.end();
  } catch (erro) {
    next(erro);
  }
});

roteador.options("/:id/diminuir-estoque", (req, res) => {
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.status(204);
  res.end();
});

roteador.post("/:id/diminuir-estoque", async (req, res, next) => {
  try {
    const produto = new Produto({
      id: req.params.id,
      fornecedor: req.fornecedor.id,
    });

    await produto.carregar();
    produto.estoque = produto.estoque - req.body.quantidade;
    await produto.diminuirEstoque();
    await produto.carregar();
    res.set("ETag", produto.versao);
    const timestamp = new Date(produto.dataAtualizacao).getTime();
    res.set("Last-Modified", timestamp);

    res.status(204);
    res.end();
  } catch (erro) {
    next(erro);
  }
});
module.exports = roteador;
