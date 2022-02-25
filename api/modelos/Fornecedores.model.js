const Sequelize = require("sequelize");
const instancia = require("./../infraestrutura/banco_de_dados");

const colunas = {
  empresa: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  categoria: {
    type: Sequelize.ENUM("ração", "brinquedos"),
    allowNull: false,
  },
};

const opcoes = {
  freezeTableName: true,
  tableName: "fornecedores",
  timestamps: true,
  createdAt: "dataCriacao",
  updatedAt: "dataAtualizacao",
  version: "versão",
};
module.exports = instancia.define("fornecedor", colunas, opcoes);
