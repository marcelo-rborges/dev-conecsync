//#region gluegun
import { GluegunToolbox } from 'gluegun';
import { createConnection, Connection } from 'typeorm';
//#endregion

//#region 3rd
// import { get } from 'lodash';
// import { fixBuffStr } from '../libs/buff2str';
// const { MongoClient } = require('mongodb')
// const { Op } = require('sequelize');
//#endregion 

//#region models
// const configJson = require('../../config/config.json');
// const mongodbJson = require('../../config/conexoes/mongodb.json');
// const MONGOOSE = require('mongoose');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runOrigemProdutosMongoDB = async (props: any) => {
    const { print } = toolbox;

    async function main() {


      // const isConnected: boolean = connection.isConnected;
      // const { host, port, database, username , table, password } = mongodbJson;
      // const uri = `mongodb://${host}:${port}/${database}?authSource=${table} --username ${username} --password ${password}`;
      // const uri = `mongodb://localhost:12220/DigisatServer`;

      // const client = new MongoClient(uri);

      try {
        const connection: Connection = await createConnection({
          type: "mongodb",
          host: "localhost",
          port: 12220,
          // username: "revenda",
          // password: "r3v3nd%40",
          database: "DigisatServer"
        });
        print.info(connection)

        // await client

        // await client.connect();

        // await listDatabases(client);

        // const db = await client.db();
        // const users = await db.collection('users').findAll();
        // print.info(db)
        // const institutions = await dbo.collection('institutions');
        // await dbo.collection('users').findAll((err, result) => {
        //   if (err) throw err;
        //   print.info(result.name);
        // })


      } catch (err) {
        print.error(err);
      } finally {
        // await client.close();
      }


    }

    // async function listDatabases(client) {
    //   const databasesList = await client.db().admin().listDatabases();

    //   print.info("Databases: ");
    //   databasesList.databases.forEach(db => print.info(` - ${db.name}`))
    // }

    // const LOGS: any[] = [];

    // props
    const {
      // dryRun: DRY_RUN,
      // projeto: PROJETO,
      // apiUrl: API_URL,
      // loja: LOJA,
      // conexao: TIPO_CONEXAO
    } = props;

    // Verifica configuração da conexão selecionada
    // const CONEXOES = {
    //   mongodb: mongodbJson
    // };

    // const {
    //   host: HOST,
    //   database: DATABASE,
    //   port: PORT,
    //   type: TYPE
    // } = CONEXOES[TIPO_CONEXAO];

    // if (
    //   !HOST
    //   || !DATABASE
    //   || !PORT
    //   || !TYPE
    // ) {
    //   print.error(`ERRO: Propriedade(s) da conexão ${TIPO_CONEXAO} não indicada(s).`);
    //   print.success(`SOLUÇÃO: Indique todas propriedades de conexão em "/config/conexoes/${TIPO_CONEXAO}.json".`);
    //   // print.info('conecsync config (exibe arquivo de configuração.');
    //   print.divider();
    //   toolbox.conexoes();
    //   return;
    // }

    try {

      await main()



    } catch (error) {
      // print.error(get(error, 'message'));
    }
  };
}
