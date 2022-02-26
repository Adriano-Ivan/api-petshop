const Modelo = require("./../../modelos/Produtos.model");
const NaoEncontrado = require("./../../erros/NaoEncontrado");
const { atualizar } = require("../fornecedores/TabelaFornecedor");
module.exports = {
  listar(id) {
    return Modelo.findAll({
      where: {
        fornecedor: id,
      },
      raw: true,
    });
  },
  inserir(dados) {
    return Modelo.create(dados);
  },
  remover(idProduto, idFornecedor) {
    return Modelo.destroy({
      where: {
        id: idProduto,
        fornecedor: idFornecedor,
      },
    });
  },
  async pegarPorId(idProduto, idFornecedor) {
    const encontrado = await Modelo.findOne({
      where: {
        id: idProduto,
        fornecedor: idFornecedor,
      },
      raw: true,
    });

    if (!encontrado) {
      throw new NaoEncontrado("O produto não foi encontrado");
    }

    return encontrado;
  },

  atualizar(dadosDoProduto, dadosParaAtualizar) {
    return Modelo.update(dadosParaAtualizar, {
      where: dadosDoProduto,
    });
  },
};
