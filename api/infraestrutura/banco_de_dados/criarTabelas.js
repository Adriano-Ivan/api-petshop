const ModeloTabela = require("../../modelos/Fornecedores.model");

ModeloTabela.sync()
  .then(() => console.log("Tabela criada com sucesso"))
  .catch(console.log);
