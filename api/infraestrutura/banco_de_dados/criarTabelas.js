const modelos = [
  require("../../modelos/Fornecedores.model"),
  require("../../modelos/Produtos.model"),
];

async function criarTabelas() {
  for (let contador = 0; contador < modelos.length; contador++) {
    const modelo = modelos[contador];
    await modelo.sync();
  }
}

criarTabelas();
