//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region 3rd
import { get } from 'lodash';
import { fixBuffStr } from '../libs/buff2str';
// const { Op } = require('sequelize');
//#endregion 

//#region models
const configJson = require('../../config/config.json');
const firebirdJson = require('../../config/conexoes/firebird.json');
const FIREBIRD = require('node-firebird');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runOrigemProdutosFirebird = async (props: any) => {
    const { print } = toolbox;

    function dbQuery(
      db: any,
      sql: string
    ): Promise<any[]> {
      return new Promise((resolve, reject) => {
        if (db) {
          db.query(
            sql,
            (err, result) => {
              if (err) {
                throw err;
              }
              const RESULTADO = result.map((row) => ({
                loja_id: fixBuffStr(row.LOJA_ID),
                id: fixBuffStr(row.ID),
                barcode: fixBuffStr(row.BARCODE),
                preco: fixBuffStr(row.PRECO),
                departamento_id: fixBuffStr(row.DEPARTAMENTO_ID),
                departamento_nome: fixBuffStr(row.DEPARTAMENTO_NOME),
                departamento_ativo: fixBuffStr(row.DEPARTAMENTO_ATIVO),
                subdepartamento_id: fixBuffStr(row.SUBDEPARTAMENTO_ID),
                subdepartamento_nome: fixBuffStr(row.SUBDEPARTAMENTO_NOME),
                subdepartamento_ativo: fixBuffStr(row.SUBDEPARTAMENTO_ATIVO),
                nome: fixBuffStr(row.NOME),
                estoque_controlado: fixBuffStr(row.ESTOQUE_CONTROLADO),
                qtde_estoque_minimo: fixBuffStr(row.QTDE_ESTOQUE_MINIMO),
                qtde_estoque_atual: fixBuffStr(row.QTDE_ESTOQUE_ATUAL),
                atacado_status: fixBuffStr(row.ATACADO_STATUS),
                atacado_preco: fixBuffStr(row.ATACADO_PRECO),
                atacado_qtde: fixBuffStr(row.ATACADO_QTDE),
                tipo_unidade_fracao: fixBuffStr(row.TIPO_UNIDADE_FRACAO),
                ativo: fixBuffStr(row.ATIVO)
              }))
              resolve(RESULTADO);
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
    }

    try {
      
      if (FIREBIRD) {
        FIREBIRD.attach(
          firebirdJson,
          async (err, db) => {
            if (err) {
              print.error(err);
              throw err;
            } // if
            if (db) {
              const PRODUTOS_BARCODES: any[] =
                await dbQuery(
                  db,
                  `
                    SELECT
                      *
                    FROM
                      ${configJson.origens.produtos.nomeView}
                    WHERE
                      loja_id = ${LOJA.id}
                    AND
                      barcode != ''
                  `
                );
              const PRODUTOS_NBARCODES: any[] =
                await dbQuery(
                  db,
                  `
                    SELECT
				              *
                    FROM
			  	            ${configJson.origens.produtos.nomeView}
			              WHERE
				              loja_id = ${LOJA.id}
			              AND
				              barcode = ''
                  `
                )

              db.detach();

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
            }
          }
        )
      }
      
    } catch (error) {
      print.error(get(error, 'message'));
    }
  };
}
