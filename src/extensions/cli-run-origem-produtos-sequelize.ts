//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region 3rd
import { get } from 'lodash';
const { Op } = require('sequelize');
//#endregion 

//#region models
const sequelizeConn = require('../libs/sequelize-conn');
import { CAMPOS_PRODUTOS } from '../models/consts';
// const configJson = require('../../config/config.json');
const produtosJson = require('../../config/origens/produtos.json');
const mariadbJson = require('../../config/conexoes/mariadb.json');
const mysqlJson = require('../../config/conexoes/mysql.json');
const mssqlJson = require('../../config/conexoes/mssql.json');
const postgresqlJson = require('../../config/conexoes/postgresql.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runOrigemProdutosSequelize = async (props: any) => {
    const { print } = toolbox;

    // const LOGS: any[] = [];

    // props
    const {
      // projeto: PROJETO,
      apiUrl: API_URL,
      loja: LOJA,
      conexao: TIPO_CONEXAO
    } = props;

    print.success(JSON.stringify(props));
    // print.success(TIPO_CONEXAO);

    // Verifica configuração da conexão selecionada
    const CONEXOES = {
      mariadb: mariadbJson,
      mysql: mysqlJson,
      mssql: mssqlJson,
      postgresql: postgresqlJson,
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
      const SEQUELIZE = await sequelizeConn(TIPO_CONEXAO);

      const Produtos = SEQUELIZE.define(
        'Produto',
        CAMPOS_PRODUTOS,
        {
          timestamps: false,
          SEQUELIZE,
          modelName: 'Produto',
          tableName: get(produtosJson, 'nomeView') || ''
        }
      );
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

      // print.success(PRODUTOS_BARCODES.length);
      // print.success(PRODUTOS_NBARCODES.length);
      toolbox.runSyncProdutos(
        {
          tokenLoja: get(LOJA, 'token'),
          apiUrl: API_URL,
          produtos: {
            barcodes: PRODUTOS_BARCODES,
            nbarcodes: PRODUTOS_NBARCODES
          }
        }
      );

    } catch (error) {
      print.error(get(error, 'message'));
    } // try-catch
  };
}
