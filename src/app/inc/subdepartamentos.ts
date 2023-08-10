import * as rp from 'request-promise';
import { errorLog, errorLogApi, log } from './lib';
import { get } from 'lodash';
import { CONFIG } from '../config/config';
import { CONFIG_MERCADEIRO } from '../config/projetos/config-mercadeiro';
import {
  // API_URL,
  AUTO_DESTAQUES
} from '../consts';
import { CONFIG_PRODUTOS } from '../config/origens/config-produtos';
var hash = require('object-hash');
var Datastore = require('nedb');

export async function syncSubdepartamentos(
  apiUrl: string,
  idLoja: string,
  subdepartamentos: any[],
  hasSome: boolean
) {
  let count: number = 0;

  if (
    idLoja
    && subdepartamentos.length
  ) {
    // NeDB
    var NeDB_subdepartamentos = new Datastore(
      {
        filename: `lojas/${idLoja}/subdepartamentos.NeDB`,
        autoload: true
      }
    );

    log('Sincronizando subdepartamentos.');
    for (let i = 0; i < subdepartamentos.length; i++) {
      const BODY_SUBDEPARTAMENTO = subdepartamentos[i] || {};
      const ID_SUBDEPARTAMENTO: string = get(BODY_SUBDEPARTAMENTO, 'id');

      try {
        count += await findOne(
          NeDB_subdepartamentos,
          apiUrl,
          idLoja,
          BODY_SUBDEPARTAMENTO,
          hasSome
        );
      } catch (error) {
        errorLog(`Subdepartamento ${ID_SUBDEPARTAMENTO}: ${error.message}`);
      } // try-catch
    } // for
  } // if

  return count;
}

function apiUpdateSubdepartamento(
  idDepartamento: string,
  idSubdepartamento: string,
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

  if (token && idSubdepartamento) {
    const URL: string = `${apiUrl}/departamentos/${idDepartamento}/subdepartamentos/${idSubdepartamento}`;
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
  body: any,
  hasSome: boolean
): Promise<number> {
  return new Promise((resolve, reject) => {
    const ID_SUBDEPARTAMENTO: string = get(body, 'id') || '';
    const ID_DEPARTAMENTO: string = get(body, 'idDepartamento') || '';
    delete body.id;
    const HASH_SUBDEPARTAMENTO: string = hash(body) || '';
    // console.log(BODY_SUBDEPARTAMENTO);

    const DOC = {
      id: ID_SUBDEPARTAMENTO,
      hash: HASH_SUBDEPARTAMENTO
    };
    // console.log(DOC);

    neDB.findOne(
      { id: ID_SUBDEPARTAMENTO },
      async function (err, doc) {
        try {
          if (!doc) {
            // console.log('Criando subdepartamento ' + ID_SUBDEPARTAMENTO);
            neDB.insert(
              DOC,
              async function (err, newDoc) {
                // console.log('newDoc', newDoc);
                if (err) {
                  return reject(err);
                } else {
                  try {
                    /* const NEW: boolean = !!get(
                      (await apiUpdateSubdepartamento(
                        ID_DEPARTAMENTO,
                        ID_SUBDEPARTAMENTO,
                        body,
                        apiUrl,
                        idLoja
                      )),
                      'new'
                    );

                    // console.log('NEW', NEW, ID_SUBDEPARTAMENTO);
                    if (NEW) {
                      const KEY: string = `${idLoja}_${ID_DEPARTAMENTO}_${ID_SUBDEPARTAMENTO}`;
                      AUTO_DESTAQUES[KEY] = +get(CONFIG_PRODUTOS, 'autoDestaque', 0) || 0;
                      // console.log('KEY', KEY);
                    } // if */

                    if (!hasSome) {
                      const KEY: string = `${idLoja}_${ID_DEPARTAMENTO}_${ID_SUBDEPARTAMENTO}`;
                      AUTO_DESTAQUES[KEY] = +get(CONFIG_PRODUTOS, 'autoDestaque', 0) || 0;
                      // console.log('KEY', KEY);
                    } // if

                    await apiUpdateSubdepartamento(
                      ID_DEPARTAMENTO,
                      ID_SUBDEPARTAMENTO,
                      body,
                      apiUrl,
                      idLoja
                    );

                    console.log("\nOK", body);
                    return resolve(1);
                  } catch (error) {
                    errorLogApi(
                      'subdepartamentos',
                      [ID_DEPARTAMENTO, ID_SUBDEPARTAMENTO],
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
            if (doc.hash !== HASH_SUBDEPARTAMENTO) {
              // console.log('Atualizando subdepartamento ' + ID_SUBDEPARTAMENTO);
              neDB.remove(
                { id: ID_SUBDEPARTAMENTO },
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
                            await apiUpdateSubdepartamento(
                              ID_DEPARTAMENTO,
                              ID_SUBDEPARTAMENTO,
                              body,
                              apiUrl,
                              idLoja
                            );

                            console.log("\nOK", body);
                            return resolve(1);
                          } catch (error) {
                            errorLogApi(
                              'subdepartamentos',
                              [ID_DEPARTAMENTO, ID_SUBDEPARTAMENTO],
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