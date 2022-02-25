const Modelo = require("./../../modelos/Fornecedores.model");

module.exports = {
  listar() {
    return Modelo.findAll();
  },
};
