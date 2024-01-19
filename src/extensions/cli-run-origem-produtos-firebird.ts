//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region 3rd
import { get } from 'lodash';
import { fixBuffStr } from '../libs/buff2str';
// const { Op } = require('sequelize');
//#endregion 

//#region models
// const configJson = require('../../config/config.json');
const firebirdJson = require('../../config/conexoes/firebird.json');
const produtosJson = require('../../config/origens/produtos.json');
const FIREBIRD = require('node-firebird');
import { DEBUG } from '../models/consts';
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runOrigemProdutosFirebird = async (props: any) => {
    const { print } = toolbox;

    // function jsonC(jsonC) {
    //   var i = 0;

    //   return function (key, value) {
    //     if (i !== 0 && typeof (jsonC) === 'object' && typeof (value) == 'object' && jsonC == value)
    //       return '[Circular]';

    //     if (i >= 29) // seems to be a harded maximum of 30 serialized objects?
    //       return '[Unknown]';

    //     ++i; // so we know we aren't using the original object anymore

    //     return value;
    //   }
    // }

    const dbQuery = (
      db: any,
      sql: string
    ): Promise<any[]> => {
      return new Promise((resolve, reject) => {
        if (db) {
          db.query(
            sql,
            (err, result) => {
              // !!DEBUG && print.debug(`sql:${sql}, err:${err}, result:${result}`);
              if (err) { throw err; }

              // PERCENTUAL_LIMITE_VENDA, QTDE_LIMITE_VENDA, FRACIONADO_STATUS, FRACIONADO_FRACAO, FRACIONADO_PERC_DESC_PROMO_AUTO, DESCRICAO_PRODUTO, DESTAQUE

              if (!!result) {
                const RESULTADO = (result || []).map(
                  (row: any) => {
                    return {
                      idLoja: fixBuffStr(get(row, 'ID_LOJA')) || '',
                      idProduto: fixBuffStr(get(row, 'ID_PRODUTO')) || '',
                      barcodeProduto: fixBuffStr(get(row, 'BARCODE_PRODUTO')) || '',
                      precoVenda: fixBuffStr(get(row, 'PRECO_VENDA')) || '',
                      idDepartamento1: fixBuffStr(get(row, 'ID_DEPARTAMENTO1')) || '',
                      nomeDepartamento1: fixBuffStr(get(row, 'NOME_DEPARTAMENTO1')) || '',
                      ativoDepartamento1: fixBuffStr(get(row, 'ATIVO_DEPARTAMENTO1')) || '',
                      idDepartamento2: fixBuffStr(get(row, 'ID_DEPARTAMENTO2')) || '',
                      nomeDepartamento2: fixBuffStr(get(row, 'NOME_DEPARTAMENTO2')) || '',
                      ativoDepartamento2: fixBuffStr(get(row, 'ATIVO_DEPARTAMENTO2')) || '',
                      idDepartamento3: fixBuffStr(get(row, 'ID_DEPARTAMENTO3')) || '',
                      nomeDepartamento3: fixBuffStr(get(row, 'NOME_DEPARTAMENTO3')) || '',
                      ativoDepartamento3: fixBuffStr(get(row, 'ATIVO_DEPARTAMENTO3')) || '',
                      ncmProduto: (fixBuffStr((get(row, 'NCM_PRODUTO'))) || '').replace(/\D/g, ''),
                      nomeProduto: fixBuffStr(get(row, 'NOME_PRODUTO')) || '',
                      estoqueControlado: fixBuffStr(get(row, 'ESTOQUE_CONTROLADO')) || '',
                      qtdeEstoqueMinimo: fixBuffStr(get(row, 'QTDE_ESTOQUE_MINIMO')) || '',
                      qtdeEstoqueAtual: fixBuffStr(get(row, 'QTDE_ESTOQUE_ATUAL')) || '',
                      atacadoStatus: fixBuffStr(!!get(row, 'ATACADO_STATUS')),
                      atacadoPreco: fixBuffStr(get(row, 'ATACADO_PRECO')) || '',
                      atacadoQtde: fixBuffStr(get(row, 'ATACADO_QTDE')) || '',
                      fracionadoTipo: fixBuffStr(get(row, 'FRACIONADO_TIPO')) || '',
                      ativoProduto: fixBuffStr(get(row, 'ATIVO_PRODUTO')) || ''
                    }
                  }
                );
                // !!DEBUG && print.debug(`RESULTADO:${JSON.stringify(RESULTADO)}`);
                resolve(RESULTADO);
              } else {
                resolve([]);
              } // else 
            }
          );
        } else {
          reject('Nenhum DB indicado.');
        } // else
      });
    }

    // const LOGS: any[] = [];

    // props
    const {
      dryRun: DRY_RUN,
      projeto: PROJETO,
      apiUrl: API_URL,
      loja: LOJA,
      conexao: TIPO_CONEXAO
    } = props;

    // Verifica configuração da conexão selecionada
    const CONEXOES = {
      firebird: firebirdJson
    };

    const {
      host: HOST,
      database: DATABASE,
      user: USER,
      password: PASSWORD
    } = CONEXOES[TIPO_CONEXAO];

    if (
      !HOST
      || !DATABASE
      || !USER
      || !PASSWORD
    ) {
      print.error(`ERRO: Propriedade(s) da conexão ${TIPO_CONEXAO} não indicada(s).`);
      print.success(`SOLUÇÃO: Indique todas propriedades de conexão em "/config/conexoes/${TIPO_CONEXAO}.json".`);
      // print.info('conecsync config (exibe arquivo de configuração.');
      print.divider();
      toolbox.conexoes();
      return;
    } // if

    //   Firebird.attach(options, function(err, db) {

    //     if (err)
    //         throw err;

    //     // db = DATABASE
    //     db.query('SELECT * FROM TABLE', function(err, result) {
    //         // IMPORTANT: close the connection
    //         db.detach();
    //     });

    // });

    try {
      if (!!FIREBIRD) {
        FIREBIRD.attach(
          firebirdJson,
          async (err, db) => {
            // !!DEBUG && print.debug(`err:${err}, db:${JSON.stringify(db, jsonC(db))}`);
            if (err) {
              print.error(err);
              throw err;
            } // if
            if (db) {
              /*
              SELECT
              const SQL_BARCODES: string = `
                  *
                FROM
                  ${produtosJson?.nomeView}
                WHERE
                  id_loja = ${LOJA.id}
                AND
                  barcode_produto != ''
              `;
              !!DEBUG && print.debug(`SQL_BARCODES:${SQL_BARCODES}`);
              const PRODUTOS_BARCODES: any[] =
                await dbQuery(
                  db,
                  SQL_BARCODES
                );
              const SQL_NBARCODES: string = `
                  SELECT
                    *
                  FROM
                    ${produtosJson?.nomeView}
                  WHERE
                    id_loja = ${LOJA.id}
                  AND
                    barcode_produto = ''
                    `;
              // ${configJson.origens.produtos.nomeView}
              !!DEBUG && print.debug(`SQL_NBARCODES:${SQL_NBARCODES}`);
              const PRODUTOS_NBARCODES: any[] =
                await dbQuery(
                  db,
                  SQL_NBARCODES
                );
              */

              const SQL: string = `
                SELECT
                  *
                FROM
                  ${produtosJson?.nomeView}
                WHERE
                  id_loja = ${LOJA.id}
              `;
              !!DEBUG && print.debug(`SQL:${SQL}`);
              const PRODUTOS: any[] =
                await dbQuery(
                  db,
                  SQL
                );

              db.detach();

              toolbox.runSyncProdutos(
                {
                  dryRun: DRY_RUN,
                  projeto: PROJETO,
                  loja: LOJA,
                  apiUrl: API_URL,
                  produtos: PRODUTOS // {
                  // barcodes: PRODUTOS_BARCODES,
                  // nbarcodes: PRODUTOS_NBARCODES
                  // }
                }
              );
            } // if
          }
        );
      } // if
    } catch (error) {
      print.error(get(error, 'message'));
    }
  };
}
