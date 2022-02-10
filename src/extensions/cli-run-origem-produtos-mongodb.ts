//#region gluegun
import { GluegunToolbox } from 'gluegun';
// import { createConnection } from 'typeorm';
//#endregion

//#region 3rd
// import { get } from 'lodash';
// import { fixBuffStr } from '../libs/buff2str';
const { MongoClient } = require('mongodb')
// const { Op } = require('sequelize');
//#endregion 

//#region models
// const configJson = require('../../config/config.json');
const mongodbJson = require('../../config/conexoes/mongodb.json');
// const MONGOOSE = require('mongoose');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runOrigemProdutosMongoDB = async (props: any) => {
    const { print } = toolbox;

    async function main() {
      const uri = 'mongodb+srv://teste:teste@clusterteste.zjgem.mongodb.net/Cluster0';

      const client = new MongoClient(uri);
      // print.info(client)

      try {
        await client.connect();

        await listDatabases(client);

        const db = await client.db();
        // const users = await db.collection('users').findAll();
        print.info(db)
        // const institutions = await dbo.collection('institutionse');
        // await dbo.collection('users').findAll((err, result) => {
        //   if (err) throw err;
        //   print.info(result.name);
        // })


      } catch (err) {

      } finally {
        await client.close();
      }


    }

    async function listDatabases(client) {
      const databasesList = await client.db().admin().listDatabases();

      print.info("Databases: ");
      databasesList.databases.forEach(db => print.info(` - ${db.name}`))
    }

    // const LOGS: any[] = [];

    // props
    const {
      // dryRun: DRY_RUN,
      // projeto: PROJETO,
      // apiUrl: API_URL,
      // loja: LOJA,
      conexao: TIPO_CONEXAO
    } = props;

    // Verifica configuração da conexão selecionada
    const CONEXOES = {
      mongodb: mongodbJson
    };

    const {
      host: HOST,
      database: DATABASE,
      port: PORT,
      type: TYPE
    } = CONEXOES[TIPO_CONEXAO];

    if (
      !HOST
      || !DATABASE
      || !PORT
      || !TYPE
    ) {
      print.error(`ERRO: Propriedade(s) da conexão ${TIPO_CONEXAO} não indicada(s).`);
      print.success(`SOLUÇÃO: Indique todas propriedades de conexão em "/config/conexoes/${TIPO_CONEXAO}.json".`);
      // print.info('conecsync config (exibe arquivo de configuração.');
      print.divider();
      toolbox.conexoes();
      return;
    }

    try {

      await main()



    } catch (error) {
      // print.error(get(error, 'message'));
    }
  };
}
