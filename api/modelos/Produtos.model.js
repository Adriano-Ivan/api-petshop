const Sequelize = require("sequelize");
const instancia = require("./../infraestrutura/banco_de_dados");

const colunas = {
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preco: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  estoque: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  fornecedor: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: require("./Fornecedores.model"),
      key: "id",
    },
  },
};

const opcoes = {
  freezeTableName: true,
  tableName: "produtos",
  timestamps: true,
  createdAt: "dataCriacao",
  updatedAt: "dataAtualizacao",
  version: "versão",
};

module.exports = instancia.define("produto", colunas, opcoes);
