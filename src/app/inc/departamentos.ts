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

export async function syncDepartamentos(
  apiUrl: string,
  idLoja: string,
  departamentos: any[],
  hasSome: boolean
): Promise<number> {
  let count: number = 0;
  // console.log('DEPARTAMENTOS:', departamentos);

  if (
    idLoja
    && departamentos.length
  ) {
    // NeDB
    var NeDB_departamentos = new Datastore(
      {
        filename: `lojas/${idLoja}/departamentos.NeDB`,
        autoload: true
      }
    );

    log('Sincronizando departamentos.');
    for (let i = 0; i < departamentos.length; i++) {
      const BODY_DEPARTAMENTO = departamentos[i];
      const ID_DEPARTAMENTO: string = get(BODY_DEPARTAMENTO, 'id');
      // console.log('BODY_DEPARTAMENTO: ', BODY_DEPARTAMENTO);
      try {
        count += await findOne(
          NeDB_departamentos,
          apiUrl,
          idLoja,
          BODY_DEPARTAMENTO,
          hasSome
        );
      } catch (error) {
        errorLog(`Departamento ${ID_DEPARTAMENTO}: ${error.message}`);
      } // try-catch
    } // for
  } // if

  return count;
}

function apiUpdateDepartamento(
  idDepartamento: string,
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
    const URL: string = `${apiUrl}/departamentos/${idDepartamento}`;
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
    const ID_DEPARTAMENTO: string = get(body, 'id');
    delete body.id;
    const HASH_DEPARTAMENTO: string = hash(body);
    // console.log(body);

    const DOC = {
      id: ID_DEPARTAMENTO,
      hash: HASH_DEPARTAMENTO
    };
    // console.log(DOC);

    neDB.findOne(
      { id: ID_DEPARTAMENTO },
      async function (err, doc) {
        // console.log(doc);
        try {
          if (!doc) {
            // log('Criando departamento ' + ID_DEPARTAMENTO);
            neDB.insert(DOC, async (err, newDoc) => {
              // console.log('newDoc', newDoc);
              if (err) {
                return reject(err);
              } else {
                try {
                  /* const NEW: boolean = !!get(
                    (await apiUpdateDepartamento(
                      ID_DEPARTAMENTO,
                      body,
                      apiUrl,
                      idLoja
                    )),
                    'new'
                  );

                  if (NEW) {
                    const KEY: string = `${idLoja}_${ID_DEPARTAMENTO}`;
                    AUTO_DESTAQUES[KEY] = +get(CONFIG_PRODUTOS, 'autoDestaque', 0) || 0;
                  } // if */

                  if (!hasSome) {
                    const KEY: string = `${idLoja}_${ID_DEPARTAMENTO}`;
                    AUTO_DESTAQUES[KEY] = +get(CONFIG_PRODUTOS, 'autoDestaque', 0) || 0;
                  } // if
                  // console.log(hasSome, JSON.stringify(AUTO_DESTAQUES));

                  await apiUpdateDepartamento(
                    ID_DEPARTAMENTO,
                    body,
                    apiUrl,
                    idLoja
                  );

                  console.log("\nOK", body);
                  return resolve(1);
                } catch (error) {
                  errorLogApi(
                    'departamentos',
                    [ID_DEPARTAMENTO],
                    get(error, 'statusCode'),
                    get(error, 'response.body.errors')
                  );
                  return resolve(0);
                } // try-catch
              } // else
            });
          } else {
            // console.log(doc);
            // console.log(get(doc, 'hash') || '', '!==', HASH_DEPARTAMENTO);
            if ((get(doc, 'hash') || '') !== HASH_DEPARTAMENTO) {
              // log('Atualizando departamento ' + ID_DEPARTAMENTO);
              neDB.remove(
                { id: ID_DEPARTAMENTO },
                { multi: true },
                function (err, numRemoved) {
                  // console.log('numRemoved', numRemoved);
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
                            await apiUpdateDepartamento(
                              ID_DEPARTAMENTO,
                              body,
                              apiUrl,
                              idLoja
                            );

                            console.log("\nOK", body);
                            return resolve(1);
                          } catch (error) {
                            errorLogApi(
                              'departamentos',
                              [ID_DEPARTAMENTO],
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