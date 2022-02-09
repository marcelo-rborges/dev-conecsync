//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region 3rd
import { get } from 'lodash';
import { fixBuffStr } from '../libs/buff2str';
// const { Op } = require('sequelize');
//#endregion 

//#region models
// const sequelizeConn = require('../libs/sequelize-conn');
// import { CAMPOS_PRODUTOS } from '../models/consts';
// const configJson = require('../../config/config.json');
// import { origens } from '../../config/config';
// const produtosJson = require('../../config/origens/produtos.json');
const configJson = require('../../config/config.json');
const firebirdJson = require('../../config/conexoes/firebird.json');
const FIREBIRD = require('node-firebird');
// const mariadbJson = require('../../config/conexoes/mariadb.json');
// const mysqlJson = require('../../config/conexoes/mysql.json');
// const mssqlJson = require('../../config/conexoes/mssql.json');
// const postgresqlJson = require('../../config/conexoes/postgresql.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runOrigemProdutosFirebird = async (props: any) => {
    const { print } = toolbox;

    // const LOGS: any[] = [];

    // props
    const {
      // dryRun: DRY_RUN,
      // projeto: PROJETO,
      // apiUrl: API_URL,
      loja: LOJA,
      conexao: TIPO_CONEXAO
    } = props;

    // let sequelize: any;

    // print.success(JSON.stringify(props));
    // print.success(TIPO_CONEXAO);

    // Verifica configuração da conexão selecionada
    const CONEXOES = {
      firebird: firebirdJson
      // mariadb: mariadbJson,
      // mysql: mysqlJson,
      // mssql: mssqlJson,
      // postgresql: postgresqlJson,
    };

    const {
      host: HOST,
      port: PORT,
      database: DATABASE,
      user: USER,
      password: PASSWORD,
      lowercase_keys: LOWERCASE_KEYS,
      role: ROLE,
      pageSize: PAGE_SIZE
    } = CONEXOES[TIPO_CONEXAO];

    // print.warning(CONEXOES[TIPO_CONEXAO]);

    if (
      !HOST
      || !PORT
      || !DATABASE
      || !USER
      || !PASSWORD
      || !LOWERCASE_KEYS
      || !ROLE
      || !PAGE_SIZE
    ) {
      print.error(`ERRO: Propriedade(s) da conexão ${TIPO_CONEXAO} não indicada(s).`);
      print.success(`SOLUÇÃO: Indique todas propriedades de conexão em "/config/conexoes/${TIPO_CONEXAO}.json".`);
      // print.info('conecsync config (exibe arquivo de configuração.');
      print.divider();
      toolbox.conexoes();
      return;
    }

    try {

      if (FIREBIRD) {
        await FIREBIRD.attach(
          TIPO_CONEXAO,
          (err, db) => {
            if (err) throw err;
            if (db) {
              const SQL: string = `
              SELECT
              *
              FROM
              ${configJson.origens.produtos.nomeView}
              WHERE
              id_loja = ${LOJA.id}
              `;
              // console.log(SQL);
              db.query(
                SQL,
                (err, result) => {
                  // console.log(result);
                  result.forEach((row) => {
                    row.LOJA.id = fixBuffStr(row.LOJA.id);
                    row.id = fixBuffStr(row.id);
                    row.barcode = fixBuffStr(row.barcode);
                    row.preco = fixBuffStr(row.preco);
                    row.departamento_id = fixBuffStr(row.departamento_id);
                    row.departamento_nome = fixBuffStr(row.departamento_nome);
                    row.departamento_ativo = fixBuffStr(row.departamento_ativo);
                    row.subdepartamento_id = fixBuffStr(row.subdepartamento_id);
                    row.subdepartamento_nome = fixBuffStr(row.subdepartamento_nome);
                    row.subdepartamento_ativo = fixBuffStr(row.subdepartamento_ativo);
                    row.nome = fixBuffStr(row.nome);
                    row.estoque_controlado = fixBuffStr(row.estoque_controlado);
                    row.qtde_estoque_minimo = fixBuffStr(row.qtde_estoque_minimo);
                    row.qtde_estoque_atual = fixBuffStr(row.qtde_estoque_atual);
                    row.atacado_status = fixBuffStr(row.atacado_status);
                    row.atacado_preco = fixBuffStr(row.atacado_preco);
                    row.atacado_qtde = fixBuffStr(row.atacado_qtde);
                    row.tipo_unidade_fracao = fixBuffStr(row.tipo_unidade_fracao);
                    row.ativo = fixBuffStr(row.ativo);
                  });
                  db.detach();
                  return result;
                }
              );
            }
          }
        )
      }
      // sequelize = await sequelizeConn(TIPO_CONEXAO);

      // const Produtos = sequelize.define(
      //   'Produto',
      //   CAMPOS_PRODUTOS,
      //   {
      //     timestamps: false,
      //     sequelize,
      //     modelName: 'Produto',
      //     tableName: get(produtosJson, 'nomeView') || ''
      //   }
      // );
      // const PRODUTOS_BARCODES = (await Produtos.findAll(
      //   {
      //     where: {
      //       loja_id: Number(get(LOJA, 'id')),
      //       barcode: {
      //         [Op.ne]: ""
      //       }
      //     }
      //   }
      // ) || [])
      //   .map((p: any) => get(p, 'dataValues'));

      // const PRODUTOS_NBARCODES = (await Produtos.findAll(
      //   {
      //     where: {
      //       loja_id: Number(get(LOJA, 'id')),
      //       barcode: ""
      //     }
      //   }
      // ) || [])
      //   .map((p: any) => get(p, 'dataValues'));

      // // TODO: verificar barcodes com barcodeFixed() e transferir os recusados.

      // // print.success(PRODUTOS_BARCODES.length);
      // // print.success(PRODUTOS_NBARCODES.length);
      // toolbox.runSyncProdutos(
      //   {
      //     dryRun: DRY_RUN,
      //     projeto: PROJETO,
      //     loja: LOJA,
      //     apiUrl: API_URL,
      //     produtos: {
      //       barcodes: PRODUTOS_BARCODES,
      //       nbarcodes: PRODUTOS_NBARCODES
      //     }
      //   }
      // );

    } catch (error) {
      print.error(get(error, 'message'));
    } finally {
      if (FIREBIRD) {
        await FIREBIRD.detach();
      };
    } // try-catch
  };
}
