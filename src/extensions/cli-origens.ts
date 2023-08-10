//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region models
const estoque = require('../../config/origens/estoque.json');
const formasPgto = require('../../config/origens/formas-pgto.json');
const produtosPromocoes = require('../../config/origens/produtos-promocoes.json');
const produtos = require('../../config/origens/produtos.json');
const promocoes = require('../../config/origens/promocoes.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.origens = () => {
    const { print } = toolbox;

    print.table(
      [
        ['/config/origens/*.json', 'Conteúdo'],
        ['Estoque', JSON.stringify(estoque)],
        ['Formas Pgto', JSON.stringify(formasPgto)],
        ['Produtos Promoções', JSON.stringify(produtosPromocoes)],
        ['Produtos', JSON.stringify(produtos)],
        ['Promoções', JSON.stringify(promocoes)]
      ],
      { format: 'lean' }
    );
    print.divider();

    print.warning('Propriedades:');
    print.divider();

    print.table(
      [
        ['tipoConexao', 'Formato a ser utilizado na coleta de dados dessa origem.']
      ]
    );
    print.highlight("  Opções disponíveis: '' | 'csv' | 'mongodb' | 'firebird'* | 'mariadb'* | 'mssql'* | 'mysql'* | 'postgres'*");
    print.warning(
      "- * exigem também a indicação de 'nomeView' (ou essa origem será ignorada)."
    );
    print.warning(
      "- '' inibe uso dessa origem."
    );

    print.divider();
    print.table(
      [
        ['nomeView', 'Nome da view criada no db sql para leitura dessa origem.']
      ]
    );
    print.highlight('  Ex: "view_conecsync_produtos", "view_conecsync_promocoes", ...');
    print.warning(
      "- Utilizada apenas em bancos de dados relacionais (SQL) (ignorada nos demais)."
    );
    print.warning(
      '- Consulte modelo de views para cada db compatível na pasta "/db/views/*.sql".'
    );
  }
}
