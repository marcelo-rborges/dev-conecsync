import { promises as fs } from 'fs';
import * as rp from 'request-promise';
import {
  chkBool,
  errorLog,
  errorLogApi,
  fixBuffStr,
  log,
  toFloat
} from './lib';
import {
  // API_URL,
  AUTO_DESTAQUES,
  CAMPOS_PRODUTOS
} from '../consts';
import { CONFIG_PRODUTOS } from '../config/origens/config-produtos';
import { CONFIG } from '../config/config';
import {
  get,
  uniqBy,
  set
} from 'lodash';
import { CONFIG_MERCADEIRO } from '../config/projetos/config-mercadeiro';
import { syncDepartamentos } from './departamentos';
import { syncSubdepartamentos } from './subdepartamentos';
var hash = require('object-hash');
var Datastore = require('nedb');
var Firebird = require('node-firebird');

export async function processaProdutosLoja(
  apiUrl: string,
  idLoja: string,
  produtos: any[],
  hasSome: boolean
) {
  const RESULTADO = {
    produtos: {
      total: 0,
      sincronizados: 0
    },
    departamentos: {
      total: 0,
      sincronizados: 0
    },
    subdepartamentos: {
      total: 0,
      sincronizados: 0
    },
  };

  try {
    console.log(produtos.length);
    // produtos = produtos.slice(0, 200);
    // console.log(produtos.length);

    const {
      departamentos: DEPARTAMENTOS,
      subdepartamentos: SUBDEPARTAMENTOS
    } = buscaDepartamentosSubdepartamentos(produtos);
    // console.log(DEPARTAMENTOS);

    log(`${DEPARTAMENTOS.length} departamento(s) encontrado(s).`);
    RESULTADO.departamentos.total = DEPARTAMENTOS.length || 0;
    RESULTADO.departamentos.sincronizados = await syncDepartamentos(
      apiUrl,
      idLoja,
      DEPARTAMENTOS,
      hasSome
    );

    // console.log(SUBDEPARTAMENTOS);
    log(`${SUBDEPARTAMENTOS.length} subdepartamento(s) encontrado(s).`);
    RESULTADO.subdepartamentos.total = SUBDEPARTAMENTOS.length || 0;
    RESULTADO.subdepartamentos.sincronizados = await syncSubdepartamentos(
      apiUrl,
      idLoja,
      SUBDEPARTAMENTOS,
      hasSome
    );

    RESULTADO.produtos.total = produtos.length;
    log(`${RESULTADO.produtos.total} produto(s) encontrado(s).`);
    // console.log(produtos);
    RESULTADO.produtos.sincronizados = await syncProdutos(
      apiUrl,
      idLoja,
      produtos,
      hasSome
    );

    return RESULTADO;
  } catch (error) {
    return Promise.reject(error);
  } // try-catch
}

export async function buscaProdutosDB(
  sequelize,
  idLoja: string
) {
  if (sequelize) {
    try {
      log('Buscando produtos do DB.');
      await sequelize.sync();

      const Produto = sequelize.define('Produto',
        CAMPOS_PRODUTOS,
        {
          timestamps: false,
          sequelize,
          modelName: 'Produto',
          tableName: get(CONFIG_PRODUTOS, 'nomeView') || ''
        }
      );

      // console.log('findall');
      return Produto.findAll(
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

export async function buscaProdutosMongoDB(
  mongoDb,
  idLoja: string
) {
  if (mongoDb) {
    try {
      log('Buscando produtos do mongoDB.');
      // await mongoDb.sync();

      // const Produto = mongoDb.define('Produto',
      //   CAMPOS_PRODUTOS,
      //   {
      //     timestamps: false,
      //     mongoDb,
      //     modelName: 'Produto',
      //     tableName: get(CONFIG_PRODUTOS, 'nomeView') || ''
      //   }
      // );

      // // console.log('findall');
      // return Produto.findAll(
      //   {
      //     where: {
      //       id_loja: +idLoja
      //     }
      //   }
      // );
    } catch (error) {
      errorLog(error.message);
      return [];
    } // try-catch
  } else {
    return [];
  } // else
}

export async function buscaProdutosFB(idLoja: string) {
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
                  ${CONFIG_PRODUTOS.nomeView} 
                WHERE
                  id_loja = ${idLoja}
                `;
              // console.log(SQL);
              db.query(SQL,
                function (err, result) {
                  // IMPORTANT: close the connection
                  // console.log(result);
                  result.forEach((row) => {
                    row.ID_LOJA = fixBuffStr(row.ID_LOJA);
                    row.ID_PRODUTO = fixBuffStr(row.ID_PRODUTO);
                    row.NOME_PRODUTO = fixBuffStr(row.NOME_PRODUTO);
                    row.ATIVO_PRODUTO = fixBuffStr(row.ATIVO_PRODUTO);
                    row.BARCODE_PRODUTO = fixBuffStr(row.BARCODE_PRODUTO);
                    row.DESCRICAO_PRODUTO = fixBuffStr(row.DESCRICAO_PRODUTO);
                    row.ID_DEPARTAMENTO = fixBuffStr(row.ID_DEPARTAMENTO);
                    row.NOME_DEPARTAMENTO = fixBuffStr(row.NOME_DEPARTAMENTO);
                    row.ATIVO_DEPARTAMENTO = fixBuffStr(row.ATIVO_DEPARTAMENTO);
                    row.ID_SUBDEPARTAMENTO = fixBuffStr(row.ID_SUBDEPARTAMENTO);
                    row.NOME_SUBDEPARTAMENTO = fixBuffStr(row.NOME_SUBDEPARTAMENTO);
                    row.ATIVO_SUBDEPARTAMENTO = fixBuffStr(row.ATIVO_SUBDEPARTAMENTO);
                    row.ESTOQUE_CONTROLADO = fixBuffStr(row.ESTOQUE_CONTROLADO);
                    row.FRACIONADO_TIPO = fixBuffStr(row.FRACIONADO_TIPO);
                    // row.DESTAQUE = fixBuffStr(row.DESTAQUE);
                    // row.ONLINE_PRODUTO = fixBuffStr(row.ONLINE_PRODUTO);
                    // row.INDUSTRIALIZADO = fixBuffStr(row.INDUSTRIALIZADO);
                    // row.FRACIONADO_STATUS = fixBuffStr(row.FRACIONADO_STATUS);
                    // row.ONLINE_DEPARTAMENTO = fixBuffStr(row.ONLINE_DEPARTAMENTO);
                  });
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

export function buscaDepartamentosSubdepartamentos(produtos: any[]): {
  departamentos: any[];
  subdepartamentos: any[];
} {
  log('Buscando departamentos e subdepartamentos.');
  const RETORNO = {
    departamentos: [],
    subdepartamentos: []
  };

  for (let i = 0; i < produtos.length; i++) {
    // console.log("\n");
    // console.log(produtos[i].dataValues);

    // Gera lista de departamentos dos produtos.
    let idDepartamento: any = get(produtos[i], 'id_departamento') || null;
    if (idDepartamento === '0') idDepartamento = null;
    if (idDepartamento) {
      const BODY_DEPARTAMENTO: any = {
        id: `${idDepartamento}`,
        ativo: chkBool(get(produtos[i], 'ativo_departamento')),
        nome: get(produtos[i], 'nome_departamento') || ''
      };
      // const ONLINE_DEPARTAMENTO: any = get(produtos[i], 'online_departamento');
      // if (ONLINE_DEPARTAMENTO !== null) {
      //   BODY_DEPARTAMENTO.online = chkBool(ONLINE_DEPARTAMENTO);
      // } // if
      RETORNO.departamentos.push(BODY_DEPARTAMENTO);

      // Gera lista de subdepartamentos dos produtos.
      // console.log('idSubdepartamento', get(produtos[i], 'idSubdepartamento') || '');
      let idSubdepartamento: any = get(produtos[i], 'id_subdepartamento') || null;
      if (idSubdepartamento === '0') idSubdepartamento = null;
      if (idSubdepartamento) {
        RETORNO.subdepartamentos.push({
          id: `${idSubdepartamento}`,
          idDepartamento: `${idDepartamento}`,
          ativo: chkBool(get(produtos[i], 'ativo_subdepartamento')),
          nome: get(produtos[i], 'nome_subdepartamento') || ''
        });
      } // if
    } // if
  } // for

  RETORNO.departamentos = uniqBy(RETORNO.departamentos, 'id');
  // console.log(RETORNO.departamentos);
  RETORNO.subdepartamentos = uniqBy(RETORNO.subdepartamentos, 'id');
  // console.log(RETORNO.subdepartamentos);

  return RETORNO;
}

export async function syncProdutos(
  apiUrl,
  idLoja: string,
  produtos: any[],
  hasSome: boolean
): Promise<number> {
  let count: number = 0;
  // let blacklist: boolean = false;
  let whitelist: boolean = false;
  let wlRows: string[] = [];
  let blRows: string[] = [];

  if (
    idLoja
    && produtos.length
  ) {
    // NeDB
    var NeDB_produtos = new Datastore(
      {
        filename: `lojas/${idLoja}/produtos.NeDB`,
        autoload: true
      }
    );

    if (!hasSome) {
      const WHITELIST_FILE: string = `partials/${idLoja}/white.txt`;
      const BLACKLIST_FILE: string = `partials/${idLoja}/black.txt`;

      try {
        const BLACK = await fs.readFile(BLACKLIST_FILE, 'ascii');
        // console.log(WHITE);
        if (BLACK.trim()) {
          log('Blacklist, removendo linhas vazias ou comentadas.');
          // Separa linhas e remove vazias ou comentadas.
          blRows = BLACK
            .split("\n")
            .filter(r => r.trim() && r && r[0] !== '*')
            .map(r => (r || '').trim());
          // console.log(blRows);
          blRows = [...new Set(blRows)];
          // console.log(blRows);
          // blacklist = !!blRows.length;
        } else {
          // blacklist = false;
        } // else
        log(`blacklist (${blRows.length})`);
      } catch (error) {
        log('Blacklist NÃO encontrada.');
        blRows = [];
        console.error(error);
      }  // try-catch

      try {
        const WHITE = await fs.readFile(WHITELIST_FILE, 'ascii');
        if (WHITE.trim()) {
          log('Whitelist, removendo linhas vazias ou comentadas.');
          // Separa linhas e remove vazias ou comentadas.
          wlRows = WHITE
            .split("\n")
            .filter(r => r.trim()
              && r
              && r[0] !== '*'
              && !blRows.includes(r.trim())
            )
            .map(r => (r || '').trim());
          whitelist = !!wlRows.length;
        } else {
          whitelist = false;
        } // else
        log(`whitelist (${wlRows.length}) ${whitelist}`);
      } catch (error) {
        log('Whitelist NÃO encontrada.');
        whitelist = false;
        console.error(error);
      } // try-catch
      // console.log(wlRows);
    } // if

    // console.log(whitelist, wlRows);

    log('Sincronizando produtos.');
    for (let i = 0; i < produtos.length; i++) {
      // console.log("\n");
      // console.log(produtos[i].dataValues);

      const PRODUTO = produtos[i] || {};
      // console.log(PRODUTO);
      const ID_PRODUTO: string = get(PRODUTO, 'id_produto') || '';

      // console.log(ID_PRODUTO, wlRows.includes(`${ID_PRODUTO}`.trim()));
      // log(ID_PRODUTO);
      try {
        count += await findOne(
          NeDB_produtos,
          apiUrl,
          idLoja,
          PRODUTO,
          hasSome,
          whitelist
            ? wlRows.includes(`${ID_PRODUTO}`.trim())
            : undefined
        );
      } catch (error) {
        errorLog(`Produto ${ID_PRODUTO}: ${error.message}`);
      } // try-catch
    } // for
  } // if

  return count;
}

async function apiUpdateProduto(
  idProduto: string,
  body: any,
  apiUrl: string,
  idLoja: string
): Promise<any> {
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

  if (apiUrl && token && idProduto) {
    const URL: string = `${apiUrl}/produtos/${idProduto}`;
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
  produto: any,
  hasSome: boolean,
  forceOnline: any,
): Promise<number> {
  return new Promise((resolve, reject) => {
    // console.log(produto);
    const ID_PRODUTO: string = get(produto, 'id_produto') || '';
    // console.log(ID_PRODUTO);
    const ESTOQUE = {
      controlado: chkBool(get(produto, 'estoque_controlado')),
      min: toFloat(get(produto, 'qtde_estoque_minimo')),
      atual: toFloat(get(produto, 'qtde_estoque_atual'))
    };
    // const LIMITE_VENDA = {
    //   percentual: toFloat(get(produto, 'percentual_limite_venda')),
    //   qtde: toFloat(get(produto, 'qtde_limite_venda')),
    //   menorValor: 0
    // };
    // const VAL_PERCENTUAL: number = ESTOQUE.atual * (LIMITE_VENDA.percentual / 100);
    // LIMITE_VENDA.menorValor = LIMITE_VENDA.qtde > 0
    //   ? (
    //     VAL_PERCENTUAL > 0
    //       ? (
    //         VAL_PERCENTUAL < LIMITE_VENDA.qtde
    //           ? VAL_PERCENTUAL
    //           : LIMITE_VENDA.qtde
    //       )
    //       : LIMITE_VENDA.qtde
    //   )
    //   : VAL_PERCENTUAL;
    // console.log(produto);
    let idDepartamento: any = get(produto, 'id_departamento') || null;
    if (idDepartamento === '0') idDepartamento = null;
    let idSubdepartamento: any = get(produto, 'id_subdepartamento') || null;
    if (idSubdepartamento === '0') idSubdepartamento = null;

    let barcodeProduto: string = get(produto, 'barcode_produto') || '';
    if (barcodeProduto === ID_PRODUTO) {
      barcodeProduto = '';
    } // if

    const BODY_PRODUTO: any = {
      "ativo": chkBool(get(produto, 'ativo_produto', true)),
      "barcode": barcodeProduto,
      // "descricao": get(produto, 'descricao_produto') || '',
      "estoqueMinimo": ESTOQUE.controlado
        && (ESTOQUE.min > 0)
        && (ESTOQUE.atual >= 0)
        ? ESTOQUE.atual <= ESTOQUE.min
        : false,
      "idDepartamento": idDepartamento === null ? '' : `${idDepartamento}`,
      "nome": get(produto, 'nome_produto') || '',
      "preco": toFloat(get(produto, 'preco_venda'))
    };

    const ATACADO_STATUS: any = get(produto, 'atacado_status');
    ATACADO_STATUS !== null && set(
      BODY_PRODUTO,
      'atacado',
      {
        status: chkBool(ATACADO_STATUS),
        qtde: toFloat(get(produto, 'atacado_qtde')),
        valor: toFloat(get(produto, 'atacado_valor')),
      }
    );

    // const DESTAQUE: any = get(produto, 'destaque');
    // DESTAQUE !== null && set(
    //   BODY_PRODUTO,
    //   'destaque',
    //   chkBool(DESTAQUE)
    // );

    // const FRACIONADO_STATUS: any = chkBool(get(produto, 'fracionado_status', 'F'));
    // const FRACIONADO_FRACAO: any = get(produto, 'fracionado_fracao', 0);
    // const FRACIONADO_PERC_DESC_PROMO_AUTO: any = get(produto, 'fracionado_perc_desc_promo_auto', 0);
    const FRACIONADO_TIPO: any = get(produto, 'fracionado_tipo', '');
    FRACIONADO_TIPO !== null && set(
      BODY_PRODUTO,
      'fracionado.unidade.tipo',
      FRACIONADO_TIPO || ''
    );

    // if (FRACIONADO_STATUS !== null) {
    // set(
    //   BODY_PRODUTO,
    //   'fracionado.status',
    //   chkBool(FRACIONADO_STATUS)
    // );

    // FRACIONADO_FRACAO !== null && set(
    //   BODY_PRODUTO,
    //   'fracionado.unidade.fracao',
    //   toFloat(FRACIONADO_FRACAO)
    // );

    // FRACIONADO_PERC_DESC_PROMO_AUTO !== null && set(
    //   BODY_PRODUTO,
    //   'fracionado.percDescPromocaoAutomatica',
    //   toFloat(FRACIONADO_PERC_DESC_PROMO_AUTO)
    // );


    // FRACIONADO_STATUS
    //   && (+FRACIONADO_FRACAO <= 0 || !FRACIONADO_TIPO)
    //   && set(
    //     BODY_PRODUTO,
    //     'ativo',
    //     false
    //   );
    // } // if
    // console.log('BODY_PRODUTO', BODY_PRODUTO);

    const LIMITE_VENDA_MAX: any = get(produto, 'qtde_limite_venda_max');
    LIMITE_VENDA_MAX !== null && set(
      BODY_PRODUTO,
      'limiteVenda.max',
      toFloat(LIMITE_VENDA_MAX)
    );

    const LIMITE_VENDA_MIN: any = get(produto, 'qtde_limite_venda_min');
    LIMITE_VENDA_MIN !== null && set(
      BODY_PRODUTO,
      'limiteVenda.min',
      toFloat(LIMITE_VENDA_MIN)
    );

    // console.log('forceOnline', forceOnline);
    if (forceOnline !== undefined) {
      set(
        BODY_PRODUTO,
        'online',
        forceOnline
      );
    } else {
      // const ONLINE_PRODUTO: any = get(produto, 'online_produto');
      // ONLINE_PRODUTO !== null && set(
      //   BODY_PRODUTO,
      //   'online',
      //   chkBool(ONLINE_PRODUTO)
      // );
    } // else

    idSubdepartamento !== null && set(
      BODY_PRODUTO,
      'idSubdepartamento',
      `${idSubdepartamento}`
    );

    // console.log(BODY_PRODUTO);
    const HASH_PRODUTO: string = hash(BODY_PRODUTO);
    // console.log(HASH_PRODUTO);

    const DOC = {
      id: ID_PRODUTO,
      hash: HASH_PRODUTO,
      // estoqueMinimo: false
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
                    const KEY: string = idSubdepartamento
                      ? `${idLoja}_${idDepartamento}_${idSubdepartamento}`
                      : `${idLoja}_${idDepartamento}`;
                    const COUNT: number = AUTO_DESTAQUES[KEY] || 0;
                    if (!hasSome) {
                      console.log(
                        KEY,
                        COUNT,
                        forceOnline !== false,
                        !!BODY_PRODUTO.ativo
                      );

                      if (
                        COUNT
                        && !!BODY_PRODUTO.ativo
                        && forceOnline !== false
                        // && !!BODY_PRODUTO.online
                      ) {
                        AUTO_DESTAQUES[KEY] = COUNT - 1;
                        BODY_PRODUTO.destaque = true;
                        // console.log(
                        //   KEY,
                        //   AUTO_DESTAQUES[KEY]
                        // );
                      } // if                      
                    } // if

                    await apiUpdateProduto(
                      ID_PRODUTO,
                      BODY_PRODUTO,
                      apiUrl,
                      idLoja
                    );

                    !hasSome && COUNT && (await new Promise(r => setTimeout(r, 2000)));

                    console.log("\nOK", BODY_PRODUTO);
                    return resolve(1);
                  } catch (error) {
                    errorLogApi(
                      'produtos',
                      [ID_PRODUTO],
                      get(error, 'statusCode'),
                      get(error, 'response.body.errors')
                    );
                    return resolve(0);
                  }
                } // else
              }
            );
          } else {
            // console.log(doc);
            if (doc.hash !== HASH_PRODUTO) {
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
                            await apiUpdateProduto(
                              ID_PRODUTO,
                              BODY_PRODUTO,
                              apiUrl,
                              idLoja
                            );
                            console.log("\nOK", BODY_PRODUTO);
                            return resolve(1);
                          } catch (error) {
                            errorLogApi(
                              'produtos',
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