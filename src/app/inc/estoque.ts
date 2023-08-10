import * as rp from 'request-promise';
import {
  errorLog,
  errorLogApi,
  log,
  toFloat
} from './lib';
import {
  // API_URL,
  CAMPOS_ESTOQUE
} from '../consts';
import { CONFIG } from '../config/config';
import { CONFIG_ESTOQUE } from '../config/origens/config-estoque';
import { CONFIG_MERCADEIRO } from '../config/projetos/config-mercadeiro';
import { get } from 'lodash';
var Datastore = require('nedb');
var Firebird = require('node-firebird');

export async function processaEstoqueLoja(
  apiUrl: string,
  idLoja: string,
  estoque: any[]
) {
  const RESULTADO = {
    estoque: {
      total: 0,
      sincronizados: 0
    }
  };

  try {
    RESULTADO.estoque.total = estoque.length;
    log(`${RESULTADO.estoque.total} produto(s) estoque controlado encontrado(s).`);
    // console.log(estoque);
    RESULTADO.estoque.sincronizados = await syncEstoque(
      apiUrl,
      idLoja,
      estoque
    );

    return RESULTADO;
  } catch (error) {
    return Promise.reject(error);
  } // try-catch
}

export async function buscaEstoqueDB(
  sequelize,
  idLoja: string
) {
  if (sequelize) {
    try {
      log('Buscando estoques do DB.');
      await sequelize.sync();

      const Estoque = sequelize.define('Estoque',
        CAMPOS_ESTOQUE,
        {
          timestamps: false,
          sequelize,
          modelName: 'Estoque',
          tableName: get(CONFIG_ESTOQUE, 'nomeView') || ''
        }
      );

      // console.log('findall');
      return Estoque.findAll(
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

export async function buscaEstoqueFB(idLoja: string) {
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
                  ${CONFIG_ESTOQUE.nomeView} 
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

export async function syncEstoque(
  apiUrl: string,
  idLoja: string,
  estoque: any[]
): Promise<number> {
  let count: number = 0;

  if (
    idLoja
    && estoque.length
  ) {
    // NeDB
    var NeDB_estoque = new Datastore(
      {
        filename: `lojas/${idLoja}/estoque.NeDB`,
        autoload: true
      }
    );

    log('Sincronizando estoque.');
    for (let i = 0; i < estoque.length; i++) {
      // console.log("\n");
      // console.log(estoque[i].dataValues);

      const PRODUTO = estoque[i] || {};
      // console.log(PRODUTO);
      const ID_PRODUTO: string = get(PRODUTO, 'id_produto') || '';

      try {
        count += await findOne(
          NeDB_estoque,
          apiUrl,
          idLoja,
          PRODUTO
        );
      } catch (error) {
        errorLog(`Produto estoque controlado ${ID_PRODUTO}: ${error.message}`);
      } // try-catch
    } // for
  } // if

  return count;
}

async function apiUpdateEstoque(
  idProduto: string,
  body: any,
  apiUrl: string,
  idLoja: string
) {
  // /* MERCADEIRO */
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
    const URL: string = `${apiUrl}/produtos/estoque/${idProduto}`;
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
  produto: any
): Promise<number> {
  return new Promise((resolve, reject) => {
    const ID_PRODUTO: string = get(produto, 'id_produto') || '';
    // console.log(ID_PRODUTO);
    const ESTOQUE = {
      min: toFloat(get(produto, 'qtde_estoque_minimo')),
      atual: toFloat(get(produto, 'qtde_estoque_atual'))
    };
    const BODY = {
      "estoqueMinimo": ESTOQUE.min
        ? ESTOQUE.atual <= ESTOQUE.min
        : false
    };
    // console.log(BODY);

    const DOC = {
      id: ID_PRODUTO,
      estoqueMinimo: BODY.estoqueMinimo
    };

    neDB.findOne(
      { id: ID_PRODUTO },
      async function (err, doc) {
        try {
          if (!doc) {
            // console.log('Criando produto ' + ID_PRODUTO);
            neDB.insert(
              DOC,
              async function (err, newDoc) {
                // console.log('newDoc', newDoc);
                if (err) {
                  return reject(err);
                } else {
                  try {
                    await apiUpdateEstoque(
                      ID_PRODUTO,
                      BODY,
                      apiUrl,
                      idLoja
                    );
                    console.log("\nOK", BODY);
                    return resolve(1);
                  } catch (error) {
                    errorLogApi(
                      'estoque',
                      [ID_PRODUTO],
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
            if (doc.estoqueMinimo !== BODY.estoqueMinimo) {
              // console.log('Atualizando produto ' + ID_PRODUTO);
              neDB.remove(
                { id: ID_PRODUTO },
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
                            await apiUpdateEstoque(
                              ID_PRODUTO,
                              BODY,
                              apiUrl,
                              idLoja
                            );
                            console.log("\nOK", BODY);
                            return resolve(1);
                          } catch (error) {
                            errorLogApi(
                              'estoque',
                              [ID_PRODUTO],
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