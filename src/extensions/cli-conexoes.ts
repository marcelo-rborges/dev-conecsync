import { GluegunToolbox } from 'gluegun';

import { get } from 'lodash';
const firebird = require('../../config/conexoes/firebird.json');
// const mariadb = require('../../config/conexoes/mariadb.json');
// const mongodb = require('../../config/conexoes/mongodb.json');
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

    const CONFIG: any[] = [];
    const NCONFIG: any[] = [];

    // firebird
    if (
      get(firebird, 'host')
      && get(firebird, 'database')
      && get(firebird, 'user')
      && get(firebird, 'password')
    ) {
      CONFIG.push(['Firebird', JSON.stringify(firebird)]);
    } else {
      NCONFIG.push(['Firebird', JSON.stringify(firebird)]);
    } // else

    // mssql
    if (
      get(mssql, 'host')
      && get(mssql, 'tabela')
      && get(mssql, 'usuario')
      && get(mssql, 'senha')
    ) {
      CONFIG.push(['MsSQL', JSON.stringify(mssql)]);
    } else {
      NCONFIG.push(['MsSQL', JSON.stringify(mssql)]);
    } // else

    // mysql
    if (
      get(mysql, 'host')
      && get(mysql, 'tabela')
      && get(mysql, 'usuario')
      && get(mysql, 'senha')
    ) {
      CONFIG.push(['MySQL', JSON.stringify(mysql)]);
    } else {
      NCONFIG.push(['MySQL', JSON.stringify(mysql)]);
    } // else

    // postgresql
    if (
      get(postgresql, 'host')
      && get(postgresql, 'tabela')
      && get(postgresql, 'usuario')
      && get(postgresql, 'senha')
    ) {
      CONFIG.push(['PostgreSQL', JSON.stringify(postgresql)]);
    } else {
      NCONFIG.push(['PostgreSQL', JSON.stringify(postgresql)]);
    } // else

    const CONFIG_LEN: number = CONFIG.length;
    const NCONFIG_LEN: number = NCONFIG.length;

    print.highlight(`Conexões CONFIGURADAS (${CONFIG_LEN})`);
    print.divider();
    !CONFIG_LEN && print.info('Nenhuma conexão encontrada.');
    print.table(CONFIG);

    print.divider();
    print.highlight(`Conexões NÃO CONFIGURADAS (${NCONFIG_LEN})`);
    print.divider();
    !NCONFIG_LEN && print.info('Nenhuma conexão encontrada.');
    print.table(NCONFIG);


    // print.table(
    //   [
    //     ['Firebird', JSON.stringify(firebird)],
    //     ['MariaDB', JSON.stringify(mariadb)],
    //     ['MongoDB', JSON.stringify(mongodb)],
    //     ['MariaDB', JSON.stringify(mariadb)],
    //     ['MsSQL', JSON.stringify(mssql)],
    //     ['MySQL', JSON.stringify(mysql)],
    //     ['PostgreSQL', JSON.stringify(postgresql)],
    //     ['CSV', `Consulte "Verifique e configure as configurações gerais.".`]
    //   ]
    // );
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
