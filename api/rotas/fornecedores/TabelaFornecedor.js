const Modelo = require("./../../modelos/Fornecedores.model");
const NaoEncontrado = require("./../../erros/NaoEncontrado");

module.exports = {
  listar() {
    return Modelo.findAll({ raw: true });
  },
  inserir(fornecedor) {
    return Modelo.create(fornecedor);
  },
  async pegarPorId(id) {
    const encontrado = await Modelo.findOne({
      where: {
        id: id,
      },
    });

    if (!encontrado) {
      throw new NaoEncontrado("Fornecedor não foi encontrado");
    }

    return encontrado;
  },
  atualizar(id, dadosParaAtualizar) {
    return Modelo.update(dadosParaAtualizar, {
      where: { id: id },
    });
  },
  remover(id) {
    return Modelo.destroy({
      where: { id: id },
    });
  },
};
