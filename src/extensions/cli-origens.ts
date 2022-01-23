import { GluegunToolbox } from 'gluegun';
const estoque = require('../../config/origens/estoque.json');
const formasPgto = require('../../config/origens/formas-pgto.json');
const produtosPromocoes = require('../../config/origens/produtos-promocoes.json');
const produtos = require('../../config/origens/produtos.json');
const promocoes = require('../../config/origens/promocoes.json');

// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: GluegunToolbox) => {
  toolbox.origens = () => {
    const {
      print,
      meta
    } = toolbox;

    print.success(`\n${meta.packageJSON().name} v${meta.version()} > config > origens > *.json`);
    print.divider();
    print.table(
      [
        ['Estoque', JSON.stringify(estoque)],
        ['Formas Pgto', JSON.stringify(formasPgto)],
        ['Produtos Promoções', JSON.stringify(produtosPromocoes)],
        ['Produtos', JSON.stringify(produtos)],
        ['Promoções', JSON.stringify(promocoes)]
      ]
    );
    print.divider();
    print.table(
      [
        ['tipoConexao', `'', 'csv', 'firebird', 'mariadb', 'mongodb', 'mssql', 'postgressql'`],
        ['nomeView', `Ex: 'view_mercadeiro_promocoes'`]
      ]
    );
    print.highlight(
      '  NOTA: Qualquer das duas propriedades deixadas em branco inibe essa origem.'
    );
    print.divider();
    print.warning(`
      Edite as configurações das origens de dados que deseja utilizar na pasta "config > origens > *.json".
    `);
  };

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "conecsync" property),
  // conecsync.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig("conecsync", process.cwd())
  // }
}
