//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region 3rd
import { get } from 'lodash';
//#endregion

//#region models
const config = require('../../config/config.json');
const firebird = require('../../config/conexoes/firebird.json');
const mariadb = require('../../config/conexoes/mariadb.json');
// const mongodb = require('../../config/conexoes/mongodb.json');
const mssql = require('../../config/conexoes/mssql.json');
const mysql = require('../../config/conexoes/mysql.json');
const postgres = require('../../config/conexoes/postgres.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.conexoes = () => {
    // toolbox.print.info('called foo extension');
    const {
      print,
      meta
    } = toolbox;

    print.success(`\n${meta.packageJSON().name} v${meta.version()} > config > conexoes > *.json`);
    print.divider();

    const CONFIG: any[] = [
      ['Tipo', 'Config']
    ];
    const NCONFIG: any[] = [
      ['Tipo', 'Config']
    ];

    // firebird
    if (
      get(firebird, 'host')
      && get(firebird, 'database')
      && get(firebird, 'user')
      && get(firebird, 'password')
    ) {
      CONFIG.push(['firebird', JSON.stringify(firebird)]);
    } else {
      NCONFIG.push(['firebird', JSON.stringify(firebird)]);
    } // else

    // mssql
    if (
      get(mssql, 'host')
      && get(mssql, 'tabela')
      && get(mssql, 'usuario')
      && get(mssql, 'senha')
    ) {
      CONFIG.push(['mssql', JSON.stringify(mssql)]);
    } else {
      NCONFIG.push(['mssql', JSON.stringify(mssql)]);
    } // else

    // mariadb
    if (
      get(mariadb, 'host')
      && get(mariadb, 'tabela')
      && get(mariadb, 'usuario')
      && get(mariadb, 'senha')
    ) {
      CONFIG.push(['mariadb', JSON.stringify(mariadb)]);
    } else {
      NCONFIG.push(['mariadb', JSON.stringify(mariadb)]);
    } // else

    // mysql
    if (
      get(mysql, 'host')
      && get(mysql, 'tabela')
      && get(mysql, 'usuario')
      && get(mysql, 'senha')
    ) {
      CONFIG.push(['mysql', JSON.stringify(mysql)]);
    } else {
      NCONFIG.push(['mysql', JSON.stringify(mysql)]);
    } // else

    // postgres
    if (
      get(postgres, 'host')
      && get(postgres, 'tabela')
      && get(postgres, 'usuario')
      && get(postgres, 'senha')
    ) {
      CONFIG.push(['postgres', JSON.stringify(postgres)]);
    } else {
      NCONFIG.push(['postgres', JSON.stringify(postgres)]);
    } // else

    const CONFIG_LEN: number = CONFIG.length;
    const NCONFIG_LEN: number = NCONFIG.length;

    print.highlight(`Conexões CONFIGURADAS (${CONFIG_LEN})`);
    print.divider();
    !CONFIG_LEN && print.info('Nenhuma conexão encontrada.');
    print.table([...CONFIG]);
    print.warning(`- Conexão em "/config/config.json": ${config.db ? config.db : 'Nenhuma'}.`);

    print.divider();
    print.highlight(`Conexões NÃO CONFIGURADAS (${NCONFIG_LEN})`);
    print.divider();
    !NCONFIG_LEN && print.info('Nenhuma conexão encontrada.');
    print.table([...NCONFIG]);

    // print.table(
    //   [
    //     ['Firebird', JSON.stringify(firebird)],
    //     ['MariaDB', JSON.stringify(mariadb)],
    //     ['MongoDB', JSON.stringify(mongodb)],
    //     ['MariaDB', JSON.stringify(mariadb)],
    //     ['MsSQL', JSON.stringify(mssql)],
    //     ['MySQL', JSON.stringify(mysql)],
    //     ['Postgres', JSON.stringify(postgres)],
    //     ['CSV', `Consulte "Verifique e configure as configurações gerais.".`]
    //   ]
    // );
    print.divider();
    print.table(
      [
        ['Arquivos de configuração', '/config > conexoes > *.json']
      ],
    );
    print.divider();
  };

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "conecsync" property),
  // conecsync.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig("conecsync", process.cwd())
  // }
}
