import * as rp from 'request-promise';
import {
  chkBool,
  errorLog,
  errorLogApi,
  log,
  toFloat
} from './lib';
import {
  // API_URL,
  CAMPOS_PROMOCOES
} from '../consts';
import { CONFIG } from '../config/config';
import { CONFIG_PROMOCOES } from '../config/origens/config-promocoes';
import { CONFIG_MERCADEIRO } from '../config/projetos/config-mercadeiro';
import { get } from 'lodash';
var hash = require('object-hash');
var Datastore = require('nedb');
var Firebird = require('node-firebird');

export async function processaPromocoesLoja(
  apiUrl: string,
  idLoja: string,
  promocoes: any[],
  produtosPromocoes: Map<string, string[]>
) {
  const RESULTADO = {
    promocoes: {
      total: 0,
      sincronizados: 0
    }
  };

  try {
    RESULTADO.promocoes.total = promocoes.length;
    log(`${RESULTADO.promocoes.total} promoções encontrada(s).`);
    // console.log(promocoes);
    RESULTADO.promocoes.sincronizados = await syncPromocoes(
      apiUrl,
      idLoja,
      promocoes,
      produtosPromocoes
    );

    return RESULTADO;
  } catch (error) {
    return Promise.reject(error);
  } // try-catch
}

export async function buscaPromocoesDB(
  sequelize,
  idLoja: string
) {
  if (sequelize) {
    try {
      log('Buscando promoções do DB.');
      await sequelize.sync();

      const Promocoes = sequelize.define('Promocoes',
        CAMPOS_PROMOCOES,
        {
          timestamps: false,
          sequelize,
          modelName: 'Promocao',
          tableName: get(CONFIG_PROMOCOES, 'nomeView') || ''
        }
      );

      // console.log('findall');
      return Promocoes.findAll(
        {
          where: {
            id_loja: +idLoja
          }
        }
      );
    } catch (error) {
      errorLog(error.message);
      return [];
    } // try-catch
  } else {
    return [];
  } // else
}

export async function buscaPromocoesFB(idLoja: string) {
  return new Promise((resolve, reject) => {
    if (Firebird) {
      try {
        Firebird.attach(
          CONFIG.fb.conexao,
          function (err, db) {
            if (err) throw err;
            // console.log(db);
            if (db) {
              const SQL: string = `
                SELECT 
                  * 
                FROM 
                  ${CONFIG_PROMOCOES.nomeView} 
                WHERE
                  id_loja = ${idLoja}
                `;
              // console.log(SQL);
              db.query(SQL,
                function (err, result) {
                  // IMPORTANT: close the connection
                  // console.log(result);
                  db.detach();
                  resolve(result);
                  return;
                }
              );
            } // if
          });
      } catch (error) {
        errorLog(error.message);
        reject(error);
        return;
      } // try-catch
    } else {
      resolve([]);
      return;
    } // else
  });
}

export async function syncPromocoes(
  apiUrl: string,
  idLoja: string,
  promocoes: any[],
  produtosPromocoes: Map<string, string[]>
): Promise<number> {
  let count: number = 0;

  if (
    idLoja
    && promocoes.length
  ) {
    // NeDB
    var NeDB_promocoes = new Datastore(
      {
        filename: `lojas/${idLoja}/promocoes.NeDB`,
        autoload: true
      }
    );

    log('Sincronizando promoções.');
    for (let i = 0; i < promocoes.length; i++) {
      // console.log("\n");
      // console.log(promocoes[i].dataValues);

      const PROMOCAO = promocoes[i] || {};
      // console.log(PROMOCAO);
      const ID_PROMOCAO: string = get(PROMOCAO, 'id_promocao') || '';

      try {
        count += await findOne(
          NeDB_promocoes,
          apiUrl,
          idLoja,
          PROMOCAO,
          produtosPromocoes
        );
      } catch (error) {
        errorLog(`Promoções ${ID_PROMOCAO}: ${error.message}`);
      } // try-catch
    } // for
  } // if

  return count;
}

async function apiUpdatePromocao(
  idPromocao: string,
  body: any,
  apiUrl: string,
  idLoja: string
) {
  /* MERCADEIRO */
  // const URL_API: string = CONFIG.sandbox
  //   ? API_URL.mercadeiro.sandbox
  //   : API_URL.mercadeiro.producao;

  let token: string = '';
  const L: any = CONFIG_MERCADEIRO.lojas
    .find((l: any) => l.id.toString() === idLoja);
  if (L) {
    token = get(L, 'token') || '';
  } // if

  if (token) {
    const URL: string = `${apiUrl}/promocoes/${idPromocao}`;
    // console.log(URL);
    // console.log(body);
    return rp.post(URL, {
      json: true,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body
    });
  } // if

  // await outputFile(OUTPUT.apiOk, OUTPUT_PATH, rows[i]);
  return Promise.reject(`Token da loja ${idLoja} não encontrado.`);
}

function findOne(
  neDB: any,
  apiUrl: string,
  idLoja: string,
  promocao: any,
  produtosPromocoes: Map<string, string[]>
): Promise<number> {
  return new Promise((resolve, reject) => {
    const ID_PROMOCAO: string = get(promocao, 'id_promocao') || '';
    const ID_PROMOCAO_MAP: string = `${idLoja}_${ID_PROMOCAO}`;
    // console.log(ID_PROMOCAO);
    const BODY = {
      ativo: chkBool(get(promocao, 'promocao_ativa', true)),
      descricao: get(promocao, 'descricao') || '',
      tipo: get(promocao, 'tipo') || '',
      idsProdutos: produtosPromocoes.get(ID_PROMOCAO_MAP) || [],
      tipoAPD: {
        qtde: toFloat(get(promocao, 'qtde_apd')),
        desconto: {
          limite: toFloat(get(promocao, 'lim_desc_apd')),
          percentual: toFloat(get(promocao, 'perc_desc_apd')),
        }
      },
      tipoLP: {
        qtde: {
          leve: toFloat(get(promocao, 'qtde_leve_lp')),
          pague: toFloat(get(promocao, 'qtde_pague_lp')),
        }
      }
    };
    // console.log(BODY);
    const HASH_PROMOCAO: string = hash(BODY);

    const DOC = {
      id: ID_PROMOCAO,
      hash: HASH_PROMOCAO,
    };

    neDB.findOne(
      { id: ID_PROMOCAO },
      async function (err, doc) {
        try {
          if (!doc) {
            // console.log('Criando produto ' + ID_PROMOCAO);
            neDB.insert(
              DOC,
              async function (err, newDoc) {
                // console.log('newDoc', newDoc);
                if (err) {
                  return reject(err);
                } else {
                  try {
                    await apiUpdatePromocao(
                      ID_PROMOCAO,
                      BODY,
                      apiUrl,
                      idLoja
                    );
                    console.log("\nOK", BODY);
                    return resolve(1);
                  } catch (error) {
                    errorLogApi(
                      'promocoes',
                      [ID_PROMOCAO],
                      get(error, 'statusCode'),
                      get(error, 'response.body.errors')
                    );
                    return resolve(0);
                  } // try-catch
                } // else
              }
            );
          } else {
            // console.log(doc);
            if (doc.hash !== HASH_PROMOCAO) {
              // console.log('Atualizando produto ' + ID_PROMOCAO);
              neDB.remove(
                { id: ID_PROMOCAO },
                { multi: true },
                function (err, numRemoved) {
                  // console.log('newDoc', newDoc);
                  if (err) {
                    return reject(err);
                  } else {
                    neDB.insert(
                      DOC,
                      async function (err, newDoc) {
                        // console.log('newDoc', newDoc);
                        if (err) {
                          return reject(err);
                        } else {
                          try {
                            await apiUpdatePromocao(
                              ID_PROMOCAO,
                              BODY,
                              apiUrl,
                              idLoja
                            );
                            console.log("\nOK", BODY);
                            return resolve(1);
                          } catch (error) {
                            errorLogApi(
                              'promocoes',
                              [ID_PROMOCAO],
                              get(error, 'statusCode'),
                              get(error, 'response.body.errors')
                            );
                            return resolve(0);
                          } // try-catch
                        } // else
                      }
                    );
                  } // else
                });
            } else {
              return resolve(0);
            } // else
          } // else
        } catch (error) {
          return reject(error);
        } // try-catch
      } // function
    );
  });
}