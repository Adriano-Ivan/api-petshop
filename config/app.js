const express = require("express");
const app = express();
const roteadorFornecedores = require("./../api/rotas/fornecedores/index");
const NaoEncontrado = require("./../api/erros/NaoEncontrado");
const CampoInvalido = require("./../api/erros/CampoInvalido");
const DadosNaoFornecidos = require("../api/erros/DadosNaoFornecidos");
const ValorNaoSuportado = require("./../api/erros/ValorNaoSuportado");
const { formatosAceitos } = require("./../api/serializador/Serializador");
const { SerializadorErro } = require("./../api/serializador/Serializador");

app.use(express.json());
app.use((req, res, next) => {
  const formatoRequisitado = req.header("Accept");

  if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
    res.status(406);
    res.end();
  }

  res.setHeader("Content-Type", formatoRequisitado);
  next();
});

app.use("/api/fornecedores", roteadorFornecedores);
app.use((erro, req, res, proximo) => {
  let status = 500;
  if (erro instanceof NaoEncontrado) {
    status = 404;
  } else if (
    erro instanceof CampoInvalido ||
    erro instanceof DadosNaoFornecidos
  ) {
    status = 400;
  } else if (erro instanceof ValorNaoSuportado) {
    status = 406;
  }

  const serializador = new SerializadorErro(res.getHeader("Content-Type"));
  res.status(status);
  res.send(
    serializador.serializar({
      mensagem: erro.message,
      id: erro.idErro,
    })
  );
});

module.exports = app;
