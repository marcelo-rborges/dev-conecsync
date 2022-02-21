//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region 3rd
import { get } from 'lodash';
const { Op } = require('sequelize');
//#endregion 

//#region models
import { connect } from '../libs'
import { CAMPOS_PRODUTOS } from '../models/consts';
// const configJson = require('../../config/config.json');
const produtosJson = require('../../config/origens/produtos.json');
const mariadb = require('../../config/conexoes/mariadb.json');
const mysql = require('../../config/conexoes/mysql.json');
const mssql = require('../../config/conexoes/mssql.json');
const postgres = require('../../config/conexoes/postgres.json');

// const SEQUELIZE: any = {
//   mssql,
//   mysql,
//   mariadb,
//   postgres
// };
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runOrigemProdutosSequelize = async (props: any) => {
    const { print } = toolbox;

    // const LOGS: any[] = [];

    // props
    const {
      dryRun: DRY_RUN,
      projeto: PROJETO,
      apiUrl: API_URL,
      loja: LOJA,
      conexao: TIPO_CONEXAO
    } = props;

    let sequelize: any;

    // print.success(JSON.stringify(props));
    // print.success(TIPO_CONEXAO);

    // Verifica configuração da conexão selecionada
    const CONEXOES = {
      mariadb: mariadb,
      mysql: mysql,
      mssql: mssql,
      postgres: postgres,
    };

    const {
      host: HOST,
      tabela: TABELA,
      usuario: USUARIO,
      senha: SENHA
    } = CONEXOES[TIPO_CONEXAO];

    // print.warning(CONEXOES[TIPO_CONEXAO]);

    if (
      !HOST
      || !TABELA
      || !USUARIO
      || !SENHA
    ) {
      print.error(`ERRO: Propriedade(s) da conexão ${TIPO_CONEXAO} não indicada(s).`);
      print.success(`SOLUÇÃO: Indique todas propriedades de conexão em "/config/conexoes/${TIPO_CONEXAO}.json".`);
      // print.info('conecsync config (exibe arquivo de configuração.');
      print.divider();
      toolbox.conexoes();
      return;
    }

    try {

      sequelize = await connect(TIPO_CONEXAO);

      const Produtos = sequelize.define(
        'Produto',
        CAMPOS_PRODUTOS,
        {
          timestamps: false,
          sequelize,
          modelName: 'Produto',
          tableName: get(produtosJson, 'nomeView') || ''
        }
      );
      print.highlight(Produtos.tableName);
      
      const PRODUTOS_BARCODES = (await Produtos.findAll(
        {
          where: {
            loja_id: Number(get(LOJA, 'id')),
            barcode: {
              [Op.ne]: ""
            }
          }
        }
      ) || [])
        .map((p: any) => get(p, 'dataValues'));      

      const PRODUTOS_NBARCODES = (await Produtos.findAll(
        {
          where: {
            loja_id: Number(get(LOJA, 'id')),
            barcode: ""
          }
        }
      ) || [])
        .map((p: any) => get(p, 'dataValues'));

      // TODO: verificar barcodes com barcodeFixed() e transferir os recusados.

      print.success(PRODUTOS_BARCODES.length);
      print.success(PRODUTOS_NBARCODES.length);
      toolbox.runSyncProdutos(
        {
          dryRun: DRY_RUN,
          projeto: PROJETO,
          loja: LOJA,
          apiUrl: API_URL,
          produtos: {
            barcodes: PRODUTOS_BARCODES,
            nbarcodes: PRODUTOS_NBARCODES
          }
        }
      );

    } catch (error) {
      print.error(get(error, 'message'));
    } finally {
      if (sequelize) {
        await sequelize.close();
      };
    } // try-catch
  };

  // function connect(db): Promise<any> {
  //   return new Promise(
  //     async (resolve, reject) => {
  //       let sequelize = new Sequelize(
  //         SEQUELIZE[db].tabela,
  //         SEQUELIZE[db].usuario,
  //         SEQUELIZE[db].senha,
  //         {
  //           host: SEQUELIZE[db].host,
  //           dialect: 'postgres',
  //         }
  //       );
  
  //       try {
  //         await sequelize.authenticate();
  //         // await sequelize.authenticate();
  //         resolve(sequelize);
  //       } catch (error) {
  //         const ERR: string = `${db.toUpperCase()} falha de conexão: ${error.message}`;
  //         print.error(ERR);
  //         reject(ERR);
  //       } // try-catch
  //     });
  // }
}
