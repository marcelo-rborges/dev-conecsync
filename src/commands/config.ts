import { GluegunCommand } from 'gluegun';

const config = require('../../config/config.json');

const command: GluegunCommand = {
  name: 'config',
  description: 'Configurações diversas.',
  run: async (toolbox) => {
    const {
      print,
      meta
    } = toolbox;

    print.success(`\n${meta.packageJSON().name} v${meta.version()} > Config`);
    print.divider();
    print.table(
      [
        ['Config', JSON.stringify(config)],
      ]
    );
    print.divider();
    print.table(
      [
        ['db', "Tipo de conexão com banco de dados."],
        ['csvs', 'Pasta com arquivos csv.'],
        ['sandbox', 'TRUE = teste de desenvolvimento, FALSE = Uso real.'],
      ]
    );
    print.divider();

    print.highlight(
      "-  dbs compatíveis: '' | 'firebird' | 'mariadb' | 'mongodb' | 'mssql' | 'postgressql'"
    );
    print.highlight(
      '-  A flag sandbox deve corresponder ao tipo de token de loja indicado (desenvolvimento/produção) em "/config/destinos/*.json" ou todas chamadas à api serão recusadas.'
    );


    print.warning(`
      Edite as configurações no arquivo "/config > config.json".
    `);
  },
}

module.exports = command;
