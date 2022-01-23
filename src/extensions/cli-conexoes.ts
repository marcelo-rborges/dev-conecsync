import { GluegunToolbox } from 'gluegun';
const firebird = require('../../config/conexoes/firebird.json');
const mariadb = require('../../config/conexoes/mariadb.json');
const mongodb = require('../../config/conexoes/mongodb.json');
const mssql = require('../../config/conexoes/mssql.json');
const mysql = require('../../config/conexoes/mysql.json');
const postgresql = require('../../config/conexoes/postgresql.json');

// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: GluegunToolbox) => {
  toolbox.conexoes = () => {
    // toolbox.print.info('called foo extension');
    const {
      print,
      meta
    } = toolbox;

    print.success(`\n${meta.packageJSON().name} v${meta.version()} > config > conexoes > *.json`);
    print.divider();
    print.table(
      [
        ['Firebird', JSON.stringify(firebird)],
        ['MariaDB', JSON.stringify(mariadb)],
        ['MongoDB', JSON.stringify(mongodb)],
        ['MariaDB', JSON.stringify(mariadb)],
        ['MsSQL', JSON.stringify(mssql)],
        ['MySQL', JSON.stringify(mysql)],
        ['PostgreSQL', JSON.stringify(postgresql)],
        ['CSV', `Consulte "Verifique e configure as configurações gerais.".`]
      ]
    );
    print.divider();
    print.warning(`
      Edite as informações de conexão com os bancos de dados que deseja utilizar na pasta "config > conexoes > *.json".
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
