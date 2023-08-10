import { promises as fs } from 'fs';
import * as yargs from 'yargs';
const path = require('path');
import { get } from 'lodash';
const { Sequelize } = require('sequelize');
import mongoose from 'mongoose';
// const mongoCliente = require('mongodb').MongoClient;
import {
  chkBool,
  errorLog,
  log,
  produtosHasSome,
  toFloat
} from './inc/lib';
import {
  buscaProdutosDB,
  buscaProdutosFB,
  buscaProdutosMongoDB,
  processaProdutosLoja
} from './inc/produtos';
import {
  buscaEstoqueDB,
  buscaEstoqueFB,
  processaEstoqueLoja
} from './inc/estoque';
import {
  buscaProdutosPromocoesDB,
  buscaProdutosPromocoesFB,
} from './inc/produtos-promocoes';
import {
  buscaPromocoesDB,
  buscaPromocoesFB,
  processaPromocoesLoja
} from './inc/promocoes';
import {
  buscaFormasDB,
  buscaFormasFB,
  processaFormasLoja
} from './inc/formas-pgto';
import {
  API_URLS,
  // AUTO_DESTAQUES,
  ESTOQUE_REQ_FIELDS,
  FORMAS_REQ_FIELDS,
  PRODUTOS_REQ_FIELDS
} from './consts'; 

var Datastore = require('nedb');
var Firebird = require('node-firebird');

// config
import { CONFIG } from './config/config';
import { CONFIG_FORMAS } from './config/origens/config-formas-pgto';
import { CONFIG_MERCADEIRO } from './config/projetos/config-mercadeiro';
import { CONFIG_PRODUTOS } from './config/origens/config-produtos';
import { CONFIG_PROMOCOES } from './config/origens/config-promocoes';
import { CONFIG_PRODUTOS_PROMOCOES } from './config/origens/config-produtos-promocoes';
import { CONFIG_ESTOQUE } from './config/origens/config-estoque';

(async function main() {
  const ARGS: any[] = yargs.argv._;
  console.log(ARGS);
  const P1: string = ARGS.length > 0 ? (ARGS[0] || '').trim() : '';
  const P2: number = ARGS.length > 1 ? +(`${ARGS[1]}`.trim()) : 0;
  const REWHITE: any = {
    idLoja: P2,
    status: P1 && P1.toLowerCase() === 'rewhite',
  };
  try {
    if (!!get(REWHITE, 'status')) {
      log('Resetando whitelist.');
      if (P2 > 0) {
        const WHITELIST_FILE: string = `partials/${REWHITE.idLoja}/white.txt`;
        // let whitelist: boolean = true;
        let wlRows: string[] = [];
        console.log(WHITELIST_FILE);
        let white: string = '';
        try {
          white = await fs.readFile(WHITELIST_FILE, 'ascii');
        } catch (error) {
          throw new Error(`Whitelist loja ${REWHITE.idLoja} NÃO encontrada.`);
        } // try-catch

        if (white.trim()) {
          log('Whitelist, removendo linhas vazias ou comentadas.');
          // Separa linhas e remove vazias ou comentadas.
          wlRows = white
            .split("\n")
            .filter(r => r.trim()
              && r
              && r[0] !== '*'
            )
            .map(r => (r || '').trim());
          // whitelist = !!wlRows.length;
        } // if
        let hashRemovidos: any = {
          encontrados: 0,
          naoEncontrados: 0,
        };
        if (wlRows.length) {
          var NeDB_produtos = new Datastore(
            {
              filename: `lojas/${REWHITE.idLoja}/produtos.NeDB`,
              autoload: true
            }
          );
          log(`whitelist (${wlRows.length})`);
          for (const wlRow of wlRows) {
            // console.log(wlRow);
            NeDB_produtos.remove(
              { id: +wlRow },
              {},
              function (err, numRemoved) {
                log(`Removendo hash do produto ${wlRow} ${numRemoved ? 'encontrado' : 'NÃO ENCONTRADO'}.`);

                if (numRemoved) {
                  hashRemovidos.encontrados += numRemoved;
                } else {
                  hashRemovidos.naoEncontrados += 1;
                } // else
              });
          } // for
        } else {
          throw new Error('Whitelist vazia.');
        } // else
      } else {
        throw new Error('Nenhuma loja indicada.');
      } // else
    } else {
      let sequelize;
      let mongoDb;

      const PRODUTOS_PROMOCOES_MAP: Map<string, string[]> = new Map();

      // const ARGS: string[] = yargs.argv._;
      // const PATH: string = (ARGS[0] || '').trim();
      const SEARCH_REG_EXP = /"/g;

      // const PATH: string = path.dirname(require.main.filename);
      const PROJETOS = {
        mercadeiro: (get(CONFIG_MERCADEIRO, 'lojas') || []).length
      };

      let resultado = {
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
        formas: {
          total: 0,
          sincronizados: 0
        },
        produtosPromocoes: {
          total: 0,
          sincronizados: 0
        },
        promocoes: {
          total: 0,
          sincronizados: 0
        },
        estoque: {
          total: 0,
          sincronizados: 0
        },
      };

      log(`Verificando configurações de lojas em integrações: ${JSON.stringify(PROJETOS)}`);
      if (
        !PROJETOS.mercadeiro
        // && !PROJETOS.supermercadeiro
        // && !PROJETOS.bairristas
        // && !PROJETOS.pedeon
      ) {
        throw new Error('Nenhuma loja indicada em projetos: config/projetos/config-*.ts');
      } // if

      //#region checkCsv
      log('Verificando configurações de pasta csv.');
      const PASTA_CSV: string = get(CONFIG, 'csv.path') || '';
      if ( // Alguma integração com csv?
        CONFIG_PRODUTOS.tipo.toLowerCase() === 'csv'
        || CONFIG_ESTOQUE.tipo.toLowerCase() === 'csv'
        || CONFIG_PROMOCOES.tipo.toLowerCase() === 'csv'
        || CONFIG_PRODUTOS_PROMOCOES.tipo.toLowerCase() === 'csv'
        || CONFIG_FORMAS.tipo.toLowerCase() === 'csv'
      ) {
        if (PASTA_CSV) {
          log('Encontrado: ' + PASTA_CSV);
        } else {
          throw new Error('Nenhuma pasta csv indicada: config/config.ts: csv.path');
        } // else
      } else {
        log('Nenhuma integração csv encontrada');
      } // else
      //#endregion

      //#region checkDb
      log('Verificando configurações de conexão db.');
      if ( // Alguma conexão com db?
        CONFIG_PRODUTOS.tipo.toLowerCase() === 'db'
        || CONFIG_ESTOQUE.tipo.toLowerCase() === 'db'
        || CONFIG_PROMOCOES.tipo.toLowerCase() === 'db'
        || CONFIG_PRODUTOS_PROMOCOES.tipo.toLowerCase() === 'db'
        || CONFIG_FORMAS.tipo.toLowerCase() === 'db'
      ) {
        // Erros de conexão com DB?
        if (
          !CONFIG.db.conexao.tipo
          || !CONFIG.db.conexao.host
          || !CONFIG.db.conexao.tabela
          || !CONFIG.db.conexao.usuario
          || !CONFIG.db.conexao.senha
        ) {
          throw new Error('Configurações de conexão insuficientes em: config/config.ts: db.conexao');
        } else {
          // Sequelize
          sequelize = new Sequelize(
            CONFIG.db.conexao.tabela,
            CONFIG.db.conexao.usuario,
            CONFIG.db.conexao.senha,
            {
              host: CONFIG.db.conexao.host,
              dialect: CONFIG.db.conexao.tipo,
            }
          );

          try {
            await sequelize.authenticate();
            log('Conexão com banco de dados estabelecida com sucesso.');
          } catch (error) {
            throw new Error(`Falha de conexão com banco de dados: ${error.message}`);
          } // try-catch
        } // else
      } else {
        log('OBS: Nenhuma integração db indicada.');
      } // else
      //#endregion

      //#region checkFb
      log('Verificando configurações de conexão fb (Firebird).');
      if (
        CONFIG_PRODUTOS.tipo.toLowerCase() === 'fb'
        || CONFIG_ESTOQUE.tipo.toLowerCase() === 'fb'
        || CONFIG_PROMOCOES.tipo.toLowerCase() === 'fb'
        || CONFIG_PRODUTOS_PROMOCOES.tipo.toLowerCase() === 'fb'
        || CONFIG_FORMAS.tipo.toLowerCase() === 'fb'
      ) {
        // Erros de conexão com FB?
        if (
          !CONFIG.fb.conexao.host
          || !CONFIG.fb.conexao.port
          || !CONFIG.fb.conexao.database
          || !CONFIG.fb.conexao.user
          || !CONFIG.fb.conexao.password
        ) {
          throw new Error('Configurações de conexão insuficientes em: config/config.ts: fb.conexao');
        } else {
          try {
            // console.log(CONFIG.fb.conexao);
            Firebird.attach(
              CONFIG.fb.conexao,
              function (err, db) {
                if (err) throw err;
                // console.log(db);
                if (!db) {
                  throw new Error('Erro conectando com Firebird: config/config.ts: fb.conexao');
                } else {
                  db.detach();
                } // else
              });

            // await sequelize.authenticate();
            // log('Conexão com banco de dados estabelecida com sucesso.');
          } catch (error) {
            throw new Error(`Falha de conexão com Firebird: ${error.message}`);
          } // try-catch
        } // else
      } else {
        log('OBS: Nenhuma integração com Firebird indicada.');
      } // else
      //#endregion

      //#region checkMongoDb
      log('Verificando configurações de conexão mongodb.');
      if ( // Alguma conexão com mongodb?
        CONFIG_PRODUTOS.tipo.toLowerCase() === 'mongodb'
        || CONFIG_ESTOQUE.tipo.toLowerCase() === 'mongodb'
        || CONFIG_PROMOCOES.tipo.toLowerCase() === 'mongodb'
        || CONFIG_PRODUTOS_PROMOCOES.tipo.toLowerCase() === 'mongodb'
        || CONFIG_FORMAS.tipo.toLowerCase() === 'mongodb'
      ) {
        // Erros de conexão com MONGO_DB?
        if (
          !CONFIG.mongodb.conexao.tipo
          || !CONFIG.mongodb.conexao.host
          || !CONFIG.mongodb.conexao.database
        ) {
          throw new Error('Configurações de conexão insuficientes em: config/config.ts: mongodb.conexao');
        } else {
          const PATH_CONNECT: string = `${CONFIG.mongodb.conexao.host}/${CONFIG.mongodb.conexao.database}`;
          try {
            await mongoose.connect(PATH_CONNECT);
            log('Conexão com banco de dados estabelecida com sucesso.');
          } catch (error) {
            throw new Error(`Falha de conexão com banco de dados: ${error.message}`);
          } // try-catch
        } // else
      } else {
        log('OBS: Nenhuma integração db indicada.');
      } // else
      //#endregion

      //#region produtos
      const TIPO_PRODUTOS: string = (get(CONFIG_PRODUTOS, 'tipo') || '').toLowerCase();
      // console.log(TIPO_PRODUTOS);
      log('Verificando integração PRODUTOS.');
      if (TIPO_PRODUTOS) {
        const VIEW_PRODUTOS: string = get(CONFIG_PRODUTOS, 'nomeView') || '';

        // MERCADEIRO
        const API_URL: string = CONFIG.sandbox
          ? API_URLS.mercadeiro.sandbox
          : API_URLS.mercadeiro.producao;
        const LOJAS_MERCADEIRO: any[] = get(CONFIG_MERCADEIRO, 'lojas') || [];

        switch (TIPO_PRODUTOS) {
          case 'db':
            log('Encontrado: ' + VIEW_PRODUTOS);
            // console.log(CAMPOS_PRODUTOS);
            for (const LOJA of LOJAS_MERCADEIRO) {
              // console.log(LOJA);
              const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;
              const HAS_SOME: boolean = await produtosHasSome(
                LOJAS_MERCADEIRO,
                API_URL,
                ID_LOJA
              );
              log(`HAS_SOME ${HAS_SOME}`);

              try {
                const PRODUTOS: any = (await buscaProdutosDB(
                  sequelize,
                  ID_LOJA
                ))
                  .map(p => get(p, 'dataValues') || {});

                resultado = {
                  ...resultado,
                  ...await processaProdutosLoja(
                    API_URL,
                    ID_LOJA,
                    PRODUTOS,
                    HAS_SOME
                  )
                };
              } catch (error) {
                errorLog(`Loja ${ID_LOJA}: ${error.message}`);
              } // try-catch
            } // for
            break;

          case 'fb':
            log('Encontrado: ' + VIEW_PRODUTOS);
            // console.log(CAMPOS_PRODUTOS);
            for (const LOJA of LOJAS_MERCADEIRO) {
              // console.log(LOJA);
              const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;
              const HAS_SOME: boolean = await produtosHasSome(
                LOJAS_MERCADEIRO,
                API_URL,
                ID_LOJA
              );
              log(`HAS_SOME ${HAS_SOME}`);

              try {
                const PRODUTOS: any = (await buscaProdutosFB(ID_LOJA));
                // console.log(PRODUTOS);

                // Object.Keys.toLowercase() && Object.values.trim()
                let produtos: any[] = [];
                PRODUTOS.forEach(p => {
                  // let o: any = 
                  const obj: any = {};
                  Object.entries(p)
                    .forEach((e: any) => {
                      // console.log(e);
                      const [K, V] = e;
                      // console.log(K, V);
                      obj[K.toLowerCase()] = typeof V === 'string'
                        ? (V || '').trim()
                        : (typeof V === 'number' ? V : V || '');
                    });
                  produtos.push(obj);
                });
                // console.log(produtos);

                resultado = {
                  ...resultado,
                  ...await processaProdutosLoja(
                    API_URL,
                    ID_LOJA,
                    produtos,
                    HAS_SOME
                  )
                };
                // console.log(resultado);
              } catch (error) {
                errorLog(`Loja ${ID_LOJA}: ${error.message}`);
              } // try-catch
            } // for
            break;

          case 'mongodb':
            log('Encontrado: ' + VIEW_PRODUTOS);
            const customerSchema = new mongoose.Schema({});
            const Produto = mongoose.model('Produto', customerSchema);
            const docs = await Produto.find();
            console.log(docs);
            // console.log(CAMPOS_PRODUTOS);
            // for (const LOJA of LOJAS_MERCADEIRO) {
            //   // console.log(LOJA);
            //   const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;
            //   const HAS_SOME: boolean = await produtosHasSome(
            //     LOJAS_MERCADEIRO,
            //     API_URL,
            //     ID_LOJA
            //   );
            //   log(`HAS_SOME ${HAS_SOME}`);

            //   try {
            //     const PRODUTOS: any = (await buscaProdutosDB(
            //       sequelize,
            //       ID_LOJA
            //     ))
            //       .map(p => get(p, 'dataValues') || {});

            //     resultado = {
            //       ...resultado,
            //       ...await processaProdutosLoja(
            //         API_URL,
            //         ID_LOJA,
            //         PRODUTOS,
            //         HAS_SOME
            //       )
            //     };
            //   } catch (error) {
            //     errorLog(`Loja ${ID_LOJA}: ${error.message}`);
            //   } // try-catch
            // } // for
            break;

          case 'csv':
            // const SOURCE: string = `${PATH}\\assets\\${ORIGEM_PRODUTOS}.csv`;
            for (const LOJA of LOJAS_MERCADEIRO) {
              // console.log(LOJA);
              const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;
              const HAS_SOME: boolean = await produtosHasSome(
                LOJAS_MERCADEIRO,
                API_URL,
                ID_LOJA
              );
              log(`HAS_SOME ${HAS_SOME}`);

              const CSV_PATH: string = `${PASTA_CSV}\/produtos\/${ID_LOJA}.csv`;
              const EXTENSION: string = path.extname(CSV_PATH).toLowerCase();
              const FIELDPOS = {
                id_produto: -1,
                id_departamento: -1,
                id_subdepartamento: -1,
                atacado_status: -1,
                atacado_qtde: -1,
                atacado_preco: -1,
                ativo_departamento: -1,
                ativo_subdepartamento: -1,
                barcode_produto: -1,
                // descricao_produto: -1,
                estoque_controlado: -1,
                nome_departamento: -1,
                nome_produto: -1,
                nome_subdepartamento: -1,
                percentual_limite_venda: -1,
                // fracionado_fracao: -1,
                // fracionado_perc_desc_promo_auto: -1,
                // fracionado_status: -1,
                fracionado_tipo: -1,
                preco_venda: -1,
                ativo_produto: -1,
                qtde_estoque_atual: -1,
                qtde_estoque_minimo: -1,
                qtde_limite_venda_max: -1,
                qtde_limite_venda_min: -1,
                // qtde_limite_venda: -1,
                // destaque: -1,
                // online_departamento: -1,
                // online_produto: -1,
              };
              if (EXTENSION !== '.csv') {
                errorLog('Formato inválido. Apenas arquivos .csv são aceitos: config/config.ts: csv.path/produtos/{idLoja}.csv');
                break;
              } // if
              log(`Lendo ${CSV_PATH}`);
              try {
                const VALUE = await fs.readFile(CSV_PATH, 'utf8');
                // console.log(VALUE);
                if (VALUE.trim()) {
                  log('Removendo linhas vazias ou comentadas.');
                  // Separa linhas e remove vazias ou comentadas.
                  let rows: string[] = VALUE.split("\n");
                  rows = rows.filter(r => r.trim() && r && r[0] !== '*');
                  const LR: number = rows.length;
                  resultado.produtos.total = LR - 1; // Ignora cabeçalho.
                  log(`${resultado.produtos.total} produto(s) encontrado(s).`);
                  // qtde.total = LR - 1;

                  const HEADER: string[] = rows[0].split(';');
                  // console.log(HEADER);

                  log('Validando campos obrigatórios.');
                  // Verifica presença de campos requeridos e guarda suas posições.
                  let req: string[] = PRODUTOS_REQ_FIELDS;
                  const LH: number = HEADER.length;
                  for (let i = 0; i < LH; i++) {
                    const FIELD: string = HEADER[i].trim().replace(SEARCH_REG_EXP, '').toLocaleLowerCase();
                    // console.log(FIELD);
                    // i === 1 && console.log(v.trim().toLowerCase().replace(SEARCH_REG_EXP, ''), FIELD);
                    req = req.filter(v => {
                      return v.trim().toLowerCase().replace(SEARCH_REG_EXP, '') !== FIELD.toLowerCase();
                    });
                    if (FIELD) {
                      FIELDPOS[FIELD] = i; // Guarda posição da coluna.
                    } // if
                  } // for
                  // console.log(req);
                  console.log(FIELDPOS);

                  if (req.length) {
                    throw new Error(`Campos obrigatórios não indicados: ${req.join(', ')}`);
                  } // if

                  log('Verificando largura das linhas.');
                  // Verifica se todas linhas batem com header
                  const BADLINES: number[] = [];
                  // console.log(LH);
                  for (let i = 0; i < LR; i++) {
                    const ROW: string[] = rows[i].split(';');
                    // console.log(`${i} ${ROW.length}/${LH}`);
                    // console.log("\n");
                    // console.log(ROW);
                    if (ROW.length !== LH) {
                      BADLINES.push(i);
                    } else {
                      /* if (!(
                          ROW[FIELDPOS['seu_codigo']].trim().length
                          && ROW[FIELDPOS['barcode']].trim().length
                          && ROW[FIELDPOS['nome']].trim().length
                          && ROW[FIELDPOS['preco']].trim().length
                          && ROW[FIELDPOS['id_departamento']].trim().length
                      )) {
                          BADLINES.push(i);
                      } // if */
                    } // if
                  } // for
                  // console.log(BADLINES);

                  if (BADLINES.length) {
                    throw new Error(`Linhas inválidas encontradas: ${BADLINES.join(', ')}`);
                  } // if

                  log('Convertendo linhas texto para produtos.');
                  const PRODUTOS = [];
                  for (let i = 0; i < LR; i++) {
                    if (i) { // ignora header
                      const ROW: string[] = rows[i]
                        .replace(SEARCH_REG_EXP, '')
                        .replace("\r", '')
                        .split(';')
                        .map((r: string) => r.toLowerCase() === 'null' ? '' : r.trim());
                      // console.log(ROW);
                      const ID_SUBDEPARTAMENTO: string = `${ROW[FIELDPOS['id_subdepartamento']]}`.trim();

                      const PRODUTO: any = {
                        'id_produto': FIELDPOS['id_produto'] >= 0
                          ? `${ROW[FIELDPOS['id_produto']].trim()}`
                          : '',

                        'barcode_produto': FIELDPOS['barcode_produto'] >= 0
                          ? `${ROW[FIELDPOS['barcode_produto']].trim()}`
                          : '',

                        'nome_produto': FIELDPOS['nome_produto'] >= 0
                          ? `${ROW[FIELDPOS['nome_produto']].trim()}`
                          : '',

                        'preco_venda': FIELDPOS['preco_venda'] >= 0
                          ? toFloat(ROW[FIELDPOS['preco_venda']])
                          : 0,

                        'id_departamento': FIELDPOS['id_departamento'] >= 0
                          ? `${ROW[FIELDPOS['id_departamento']].trim()}`
                          : '',

                        'nome_departamento': FIELDPOS['nome_departamento'] >= 0
                          ? `${ROW[FIELDPOS['nome_departamento']].trim()}`
                          : '',

                        'ativo_departamento': FIELDPOS['ativo_departamento'] >= 0
                          ? chkBool(ROW[FIELDPOS['ativo_departamento']] || '')
                          : true,

                        'atacado_status': FIELDPOS['atacado_status'] >= 0
                          ? chkBool(ROW[FIELDPOS['atacado_status']] || '')
                          : false,

                        'atacado_qtde': FIELDPOS['atacado_qtde'] >= 0
                          ? toFloat(ROW[FIELDPOS['atacado_qtde']])
                          : 0,

                        'atacado_preco': FIELDPOS['atacado_preco'] >= 0
                          ? toFloat(ROW[FIELDPOS['atacado_preco']])
                          : 0,

                        'id_subdepartamento': FIELDPOS['id_subdepartamento'] >= 0
                          && (ID_SUBDEPARTAMENTO === '0' ? '' : ID_SUBDEPARTAMENTO)
                          || '',

                        'nome_subdepartamento': FIELDPOS['nome_subdepartamento'] >= 0
                          ? `${ROW[FIELDPOS['nome_subdepartamento']].trim()}`
                          : '',

                        'ativo_subdepartamento': FIELDPOS['ativo_subdepartamento'] >= 0
                          ? chkBool(ROW[FIELDPOS['ativo_subdepartamento']] || '')
                          : true,

                        'ativo_produto': FIELDPOS['ativo_produto'] >= 0
                          ? chkBool(ROW[FIELDPOS['ativo_produto']] || '')
                          : true,

                        'online_produto': FIELDPOS['online_produto'] >= 0
                          ? chkBool(ROW[FIELDPOS['online_produto']] || '')
                          : true,

                        // 'online_departamento': FIELDPOS['online_departamento'] >= 0
                        //   ? chkBool(ROW[FIELDPOS['online_departamento']] || '')
                        //   : true,

                        // 'fracionado_status': FIELDPOS['fracionado_status'] >= 0
                        //   ? chkBool(ROW[FIELDPOS['fracionado_status']] || '')
                        //   : false,

                        'percentual_limite_venda': FIELDPOS['percentual_limite_venda'] >= 0
                          ? toFloat(ROW[FIELDPOS['percentual_limite_venda']])
                          : 0,

                        // 'fracionado_fracao': FIELDPOS['fracionado_fracao'] >= 0
                        //   ? toFloat(ROW[FIELDPOS['fracionado_fracao']])
                        //   : 0,

                        // 'fracionado_perc_desc_promo_auto': FIELDPOS['fracionado_perc_desc_promo_auto'] >= 0
                        //   ? toFloat(ROW[FIELDPOS['fracionado_perc_desc_promo_auto']])
                        //   : 0,

                        'fracionado_tipo': FIELDPOS['fracionado_tipo'] >= 0
                          ? `${ROW[FIELDPOS['fracionado_tipo']].trim()}`
                          : '',

                        'descricao_produto': FIELDPOS['descricao_produto'] >= 0
                          ? `${ROW[FIELDPOS['descricao_produto']].trim()}`
                          : '',

                        // 'destaque': FIELDPOS['destaque'] >= 0
                        //   ? chkBool(ROW[FIELDPOS['destaque']] || '')
                        //   : null,

                        'qtde_estoque_minimo': FIELDPOS['qtde_estoque_minimo'] >= 0
                          ? toFloat(ROW[FIELDPOS['qtde_estoque_minimo']])
                          : 0,

                        'qtde_estoque_atual': FIELDPOS['qtde_estoque_atual'] >= 0
                          ? toFloat(ROW[FIELDPOS['qtde_estoque_atual']])
                          : 0,

                        'qtde_limite_venda_max': FIELDPOS['qtde_limite_venda_max'] >= 0
                          ? toFloat(ROW[FIELDPOS['qtde_limite_venda_max']])
                          : 0,

                        'qtde_limite_venda_min': FIELDPOS['qtde_limite_venda_min'] >= 0
                          ? toFloat(ROW[FIELDPOS['qtde_limite_venda_min']])
                          : 0,

                        'estoque_controlado': FIELDPOS['estoque_controlado'] >= 0
                          ? chkBool(ROW[FIELDPOS['estoque_controlado']] || '')
                          : false,
                      };

                      const INDEX_ONLINE_DEPARTAMENTO: number = FIELDPOS['online_departamento'];
                      if (INDEX_ONLINE_DEPARTAMENTO >= 0) {
                        PRODUTO.online_departamento = chkBool(ROW[INDEX_ONLINE_DEPARTAMENTO] || '');
                      } // if

                      PRODUTOS.push(PRODUTO);
                    } // if
                  } // for
                  // console.log(PRODUTOS);
                  resultado = {
                    ...resultado,
                    ...await processaProdutosLoja(
                      API_URL,
                      ID_LOJA,
                      PRODUTOS,
                      HAS_SOME
                    )
                  };
                } else {
                  log('OBS: Arquivo .csv vazio.');
                } // else
              } catch (error) {
                errorLog(error.message);
              } // try-catch
            } // for
            break;
          default:
            errorLog('Tipo de origem inválido: config/origens/config-produtos.ts: tipo');
            break;
        } // switch

        log(JSON.stringify({
          departamentos: resultado.departamentos,
          subdepartamentos: resultado.subdepartamentos,
          produtos: resultado.produtos,
        }));
      } // if
      //#endregion

      //#region estoque
      let tipoEstoque: string = (get(CONFIG_ESTOQUE, 'tipo') || '').toLowerCase();
      // console.log(tipoEstoque);

      if (TIPO_PRODUTOS) {
        log('INTEGRAÇÃO DE PRODUTOS ENCONTRADA. IGNORANDO INTEGRAÇÃO DE ESTOQUE: config/origens/config-estoque.ts: tipo');
        tipoEstoque = '';
      } // if

      log('Verificando integração ESTOQUE.');
      if (tipoEstoque) {
        const VIEW_ESTOQUE: string = get(CONFIG_ESTOQUE, 'nomeView') || '';

        // MERCADEIRO
        const API_URL: string = CONFIG.sandbox
          ? API_URLS.mercadeiro.sandbox
          : API_URLS.mercadeiro.producao;
        const LOJAS_MERCADEIRO: any[] = get(CONFIG_MERCADEIRO, 'lojas') || [];

        switch (tipoEstoque) {
          case 'db':
            log('Encontrado: ' + VIEW_ESTOQUE);
            // console.log(CAMPOS_ESTOQUE);

            for (const LOJA of LOJAS_MERCADEIRO) {
              // console.log(LOJA);
              const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

              try {
                const ESTOQUE = (await buscaEstoqueDB(
                  sequelize,
                  ID_LOJA
                ))
                  .map(p => get(p, 'dataValues') || {});

                resultado = {
                  ...resultado,
                  ...await processaEstoqueLoja(
                    API_URL,
                    ID_LOJA,
                    ESTOQUE
                  )
                };
              } catch (error) {
                errorLog(`Loja ${ID_LOJA}: ${error.message}`);
              } // try-catch
            } // for
            break;

          case 'fb':
            log('Encontrado: ' + VIEW_ESTOQUE);
            // console.log(CAMPOS_ESTOQUE);

            for (const LOJA of LOJAS_MERCADEIRO) {
              // console.log(LOJA);
              const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

              try {
                const ESTOQUE: any = (await buscaEstoqueFB(ID_LOJA));

                // Object.Keys.toLowercase() && Object.values.trim()
                let estoque: any[] = [];
                ESTOQUE.forEach(p => {
                  // let o: any = 
                  const obj: any = {};
                  Object.entries(p)
                    .forEach((e: any) => {
                      // console.log(e);
                      const [K, V] = e;
                      // console.log(K, V);
                      obj[K.toLowerCase()] = typeof V === 'string'
                        ? (V || '').trim()
                        : (typeof V === 'number' ? V : V || '');
                    });
                  estoque.push(obj);
                });
                // console.log(produtos);

                resultado = {
                  ...resultado,
                  ...await processaEstoqueLoja(
                    API_URL,
                    ID_LOJA,
                    estoque
                  )
                };
              } catch (error) {
                errorLog(`Loja ${ID_LOJA}: ${error.message}`);
              } // try-catch
            } // for
            break;

          case 'csv':
            // const SOURCE: string = `${PATH}\\assets\\${ORIGEM_PRODUTOS}.csv`;
            for (const LOJA of LOJAS_MERCADEIRO) {
              // console.log(LOJA);
              const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

              const CSV_PATH: string = `${PASTA_CSV}\\estoque\\${ID_LOJA}.csv`;
              const EXTENSION: string = path.extname(CSV_PATH).toLowerCase();
              const FIELDPOS = {
                id_produto: -1,
                barcode_produto: -1,
                nome_produto: -1,
                qtde_estoque_atual: -1,
                qtde_estoque_minimo: -1
              };
              if (EXTENSION !== '.csv') {
                errorLog('Formato inválido. Apenas arquivos .csv são aceitos: config/config.ts: csv.path/estoque/{idLoja}.csv');
                break;
              } // if
              log(`Lendo ${CSV_PATH}`);
              try {
                const VALUE = await fs.readFile(CSV_PATH, 'utf8');
                // console.log(VALUE);
                if (VALUE.trim()) {
                  log('Removendo linhas vazias ou comentadas.');
                  // Separa linhas e remove vazias ou comentadas.
                  let rows: string[] = VALUE.split("\n");
                  rows = rows.filter(r => r.trim() && r && r[0] !== '*');
                  const LR: number = rows.length;
                  resultado.estoque.total = LR - 1; // Ignora cabeçalho.
                  log(`${resultado.estoque.total} produto(s) estoque controlado encontrado(s).`);
                  // qtde.total = LR - 1;

                  const HEADER: string[] = rows[0].split(';');
                  // console.log(HEADER);

                  log('Validando campos obrigatórios.');
                  // Verifica presença de campos requeridos e guarda suas posições.
                  let req: string[] = ESTOQUE_REQ_FIELDS;
                  const LH: number = HEADER.length;
                  for (let i = 0; i < LH; i++) {
                    const FIELD: string = HEADER[i].trim().replace(SEARCH_REG_EXP, '');
                    // console.log(FIELD);
                    // i === 1 && console.log(v.trim().toLowerCase().replace(SEARCH_REG_EXP, ''), FIELD);
                    req = req.filter(v => {
                      return v.trim().toLowerCase().replace(SEARCH_REG_EXP, '') !== FIELD.toLowerCase();
                    });
                    if (FIELD) {
                      FIELDPOS[FIELD] = i; // Guarda posição da coluna.
                    } // if
                  } // for
                  // console.log(req);
                  // console.log(FIELDPOS);

                  if (req.length) {
                    throw new Error(`Campos obrigatórios não indicados: ${req.join(', ')}`);
                  } // if

                  log('Verificando largura das linhas.');
                  // Verifica se todas linhas batem com header
                  const BADLINES: number[] = [];
                  // console.log(LH);
                  for (let i = 0; i < LR; i++) {
                    const ROW: string[] = rows[i].split(';');
                    // console.log(`${i} ${ROW.length}/${LH}`);
                    // console.log("\n");
                    // console.log(ROW);
                    if (ROW.length !== LH) {
                      BADLINES.push(i);
                    } else {
                      /* if (!(
                          ROW[FIELDPOS['seu_codigo']].trim().length
                          && ROW[FIELDPOS['barcode']].trim().length
                          && ROW[FIELDPOS['nome']].trim().length
                          && ROW[FIELDPOS['preco']].trim().length
                          && ROW[FIELDPOS['id_departamento']].trim().length
                      )) {
                          BADLINES.push(i);
                      } // if */
                    } // if
                  } // for
                  // console.log(BADLINES);

                  if (BADLINES.length) {
                    throw new Error(`Linhas inválidas encontradas: ${BADLINES.join(', ')}`);
                  } // if

                  log('Convertendo linhas texto para produtos estoque controlado.');
                  const ESTOQUE = [];
                  for (let i = 0; i < LR; i++) {
                    if (i) { // ignora header
                      const ROW: string[] = rows[i]
                        .replace(SEARCH_REG_EXP, '')
                        .replace("\r", '')
                        .split(';')
                        .map((r: string) => r.toLowerCase() === 'null' ? '' : r.trim());
                      // console.log(ROW);
                      const PRODUTO = {
                        'id_produto': FIELDPOS['id_produto'] >= 0
                          && `${ROW[FIELDPOS['id_produto']].trim()}`,

                        'barcode_produto': FIELDPOS['barcode_produto'] >= 0
                          && `${ROW[FIELDPOS['barcode_produto']].trim()}`,

                        'nome_produto': FIELDPOS['nome_produto'] >= 0
                          && `${ROW[FIELDPOS['nome_produto']].trim()}`,

                        'qtde_estoque_minimo': FIELDPOS['qtde_estoque_minimo'] >= 0
                          && toFloat(ROW[FIELDPOS['qtde_estoque_minimo']]),

                        'qtde_estoque_atual': FIELDPOS['qtde_estoque_atual'] >= 0
                          && toFloat(ROW[FIELDPOS['qtde_estoque_atual']])
                      };
                      ESTOQUE.push(PRODUTO);
                    } // if
                  } // for
                  // console.log(ESTOQUE);
                  resultado = {
                    ...resultado,
                    ...await processaEstoqueLoja(
                      API_URL,
                      ID_LOJA,
                      ESTOQUE
                    )
                  };
                } else {
                  log('OBS: Arquivo .csv vazio.');
                } // else
              } catch (error) {
                errorLog(error.message);
              } // try-catch
            } // for
            break;

          default:
            errorLog('Tipo de origem inválido: config/origens/config-estoque.ts: tipo');
            break;
        } // switch

        log(JSON.stringify({
          estoque: resultado.estoque
        }));
      } // if
      //#endregion

      //#region produtosPromocoes
      let tipoProdutosPromocoes: string = (get(CONFIG_PRODUTOS_PROMOCOES, 'tipo') || '').toLowerCase();
      // console.log(tipoProdutosPromocoes);

      log('Verificando integração PRODUTOS_PROMOCOES.');
      if (tipoProdutosPromocoes) {
        const VIEW_PRODUTOS_PROMOCOES: string = get(CONFIG_PRODUTOS_PROMOCOES, 'nomeView') || '';

        // MERCADEIRO
        const API_URL: string = CONFIG.sandbox
          ? API_URLS.mercadeiro.sandbox
          : API_URLS.mercadeiro.producao;
        const LOJAS_MERCADEIRO: any[] = get(CONFIG_MERCADEIRO, 'lojas') || [];

        switch (tipoProdutosPromocoes) {
          case 'db':
            log('Encontrado: ' + VIEW_PRODUTOS_PROMOCOES);
            // console.log(CAMPOS_PRODUTOS_PROMOCOES);

            for (const LOJA of LOJAS_MERCADEIRO) {
              // console.log(LOJA);
              const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

              try {
                const PRODUTOS_PROMOCOES = (await buscaProdutosPromocoesDB(
                  sequelize,
                  ID_LOJA
                ))
                  .map(p => get(p, 'dataValues') || {});

                // console.log(PRODUTOS_PROMOCOES);

                PRODUTOS_PROMOCOES.forEach((e: any) => {
                  // PRODUTOS_PROMOCOES_MAP
                  // console.log(e);
                  let {
                    id_produto_promocao_promocao,
                    id_produto_promocao_produto,
                    id_loja
                  } = e;

                  const ID_PROMOCAO: string = `${id_loja}_${id_produto_promocao_promocao}`;
                  const ID_PRODUTO: string = `${id_produto_promocao_produto}`;
                  // console.log('ID_PROMOCAO', ID_PROMOCAO);
                  // console.log('ID_PRODUTO', ID_PRODUTO);
                  const IDS: string[] = (PRODUTOS_PROMOCOES_MAP.get(ID_PROMOCAO) || []);
                  IDS.push(ID_PRODUTO)
                  // console.log(IDS);
                  PRODUTOS_PROMOCOES_MAP.set(ID_PROMOCAO, IDS);
                });

                for (let entry of PRODUTOS_PROMOCOES_MAP.entries()) {
                  // console.log(entry[0]);
                  // console.log(entry[1]);
                  const [KEY, VAL] = entry;
                  PRODUTOS_PROMOCOES_MAP.set(
                    KEY,
                    (VAL && VAL.sort()) || []
                  );
                } // for
                console.log(PRODUTOS_PROMOCOES_MAP);
              } catch (error) {
                errorLog(`Loja ${ID_LOJA}: ${error.message}`);
              } // try-catch
            } // for
            break;

          case 'fb':
            log('Encontrado: ' + VIEW_PRODUTOS_PROMOCOES);
            // console.log(CAMPOS_PRODUTOS_PROMOCOES);

            for (const LOJA of LOJAS_MERCADEIRO) {
              // console.log(LOJA);
              const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

              try {
                const ESTOQUE: any = (await buscaEstoqueFB(ID_LOJA));

                // Object.Keys.toLowercase() && Object.values.trim()
                let estoque: any[] = [];
                ESTOQUE.forEach(p => {
                  // let o: any = 
                  const obj: any = {};
                  Object.entries(p)
                    .forEach((e: any) => {
                      // console.log(e);
                      const [K, V] = e;
                      // console.log(K, V);
                      obj[K.toLowerCase()] = typeof V === 'string'
                        ? (V || '').trim()
                        : (typeof V === 'number' ? V : V || '');
                    });
                  estoque.push(obj);
                });
                // console.log(produtos);

                resultado = {
                  ...resultado,
                  ...await processaEstoqueLoja(
                    API_URL,
                    ID_LOJA,
                    estoque
                  )
                };
              } catch (error) {
                errorLog(`Loja ${ID_LOJA}: ${error.message}`);
              } // try-catch
            } // for
            break;

          case 'csv':
            // const SOURCE: string = `${PATH}\\assets\\${ORIGEM_PRODUTOS}.csv`;
            for (const LOJA of LOJAS_MERCADEIRO) {
              // console.log(LOJA);
              const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

              const CSV_PATH: string = `${PASTA_CSV}\\estoque\\${ID_LOJA}.csv`;
              const EXTENSION: string = path.extname(CSV_PATH).toLowerCase();
              const FIELDPOS = {
                id_produto: -1,
                barcode_produto: -1,
                nome_produto: -1,
                qtde_estoque_atual: -1,
                qtde_estoque_minimo: -1
              };
              if (EXTENSION !== '.csv') {
                errorLog('Formato inválido. Apenas arquivos .csv são aceitos: config/config.ts: csv.path/estoque/{idLoja}.csv');
                break;
              } // if
              log(`Lendo ${CSV_PATH}`);
              try {
                const VALUE = await fs.readFile(CSV_PATH, 'utf8');
                // console.log(VALUE);
                if (VALUE.trim()) {
                  log('Removendo linhas vazias ou comentadas.');
                  // Separa linhas e remove vazias ou comentadas.
                  let rows: string[] = VALUE.split("\n");
                  rows = rows.filter(r => r.trim() && r && r[0] !== '*');
                  const LR: number = rows.length;
                  resultado.estoque.total = LR - 1; // Ignora cabeçalho.
                  log(`${resultado.estoque.total} produto(s) estoque controlado encontrado(s).`);
                  // qtde.total = LR - 1;

                  const HEADER: string[] = rows[0].split(';');
                  // console.log(HEADER);

                  log('Validando campos obrigatórios.');
                  // Verifica presença de campos requeridos e guarda suas posições.
                  let req: string[] = ESTOQUE_REQ_FIELDS;
                  const LH: number = HEADER.length;
                  for (let i = 0; i < LH; i++) {
                    const FIELD: string = HEADER[i].trim().replace(SEARCH_REG_EXP, '');
                    // console.log(FIELD);
                    // i === 1 && console.log(v.trim().toLowerCase().replace(SEARCH_REG_EXP, ''), FIELD);
                    req = req.filter(v => {
                      return v.trim().toLowerCase().replace(SEARCH_REG_EXP, '') !== FIELD.toLowerCase();
                    });
                    if (FIELD) {
                      FIELDPOS[FIELD] = i; // Guarda posição da coluna.
                    } // if
                  } // for
                  // console.log(req);
                  // console.log(FIELDPOS);

                  if (req.length) {
                    throw new Error(`Campos obrigatórios não indicados: ${req.join(', ')}`);
                  } // if

                  log('Verificando largura das linhas.');
                  // Verifica se todas linhas batem com header
                  const BADLINES: number[] = [];
                  // console.log(LH);
                  for (let i = 0; i < LR; i++) {
                    const ROW: string[] = rows[i].split(';');
                    // console.log(`${i} ${ROW.length}/${LH}`);
                    // console.log("\n");
                    // console.log(ROW);
                    if (ROW.length !== LH) {
                      BADLINES.push(i);
                    } else {
                      /* if (!(
                          ROW[FIELDPOS['seu_codigo']].trim().length
                          && ROW[FIELDPOS['barcode']].trim().length
                          && ROW[FIELDPOS['nome']].trim().length
                          && ROW[FIELDPOS['preco']].trim().length
                          && ROW[FIELDPOS['id_departamento']].trim().length
                      )) {
                          BADLINES.push(i);
                      } // if */
                    } // if
                  } // for
                  // console.log(BADLINES);

                  if (BADLINES.length) {
                    throw new Error(`Linhas inválidas encontradas: ${BADLINES.join(', ')}`);
                  } // if

                  log('Convertendo linhas texto para produtos estoque controlado.');
                  const ESTOQUE = [];
                  for (let i = 0; i < LR; i++) {
                    if (i) { // ignora header
                      const ROW: string[] = rows[i]
                        .replace(SEARCH_REG_EXP, '')
                        .replace("\r", '')
                        .split(';')
                        .map((r: string) => r.toLowerCase() === 'null' ? '' : r.trim());
                      // console.log(ROW);
                      const PRODUTO = {
                        'id_produto': FIELDPOS['id_produto'] >= 0
                          && `${ROW[FIELDPOS['id_produto']].trim()}`,

                        'barcode_produto': FIELDPOS['barcode_produto'] >= 0
                          && `${ROW[FIELDPOS['barcode_produto']].trim()}`,

                        'nome_produto': FIELDPOS['nome_produto'] >= 0
                          && `${ROW[FIELDPOS['nome_produto']].trim()}`,

                        'qtde_estoque_minimo': FIELDPOS['qtde_estoque_minimo'] >= 0
                          && toFloat(ROW[FIELDPOS['qtde_estoque_minimo']]),

                        'qtde_estoque_atual': FIELDPOS['qtde_estoque_atual'] >= 0
                          && toFloat(ROW[FIELDPOS['qtde_estoque_atual']])
                      };
                      ESTOQUE.push(PRODUTO);
                    } // if
                  } // for
                  // console.log(ESTOQUE);
                  resultado = {
                    ...resultado,
                    ...await processaEstoqueLoja(
                      API_URL,
                      ID_LOJA,
                      ESTOQUE
                    )
                  };
                } else {
                  log('OBS: Arquivo .csv vazio.');
                } // else
              } catch (error) {
                errorLog(error.message);
              } // try-catch
            } // for
            break;

          default:
            errorLog('Tipo de origem inválido: config/origens/config-estoque.ts: tipo');
            break;
        } // switch

        log(JSON.stringify({
          estoque: resultado.estoque
        }));
      } // if
      //#endregion

      //#region promocoes
      let TIPO_PROMOCOES: string = (get(CONFIG_PROMOCOES, 'tipo') || '').toLowerCase();
      // console.log(tipoEstoque);

      log('Verificando integração PROMOÇÕES.');
      if (TIPO_PROMOCOES) {
        const VIEW_PROMOCOES: string = get(CONFIG_PROMOCOES, 'nomeView') || '';

        // MERCADEIRO
        const API_URL: string = CONFIG.sandbox
          ? API_URLS.mercadeiro.sandbox
          : API_URLS.mercadeiro.producao;
        const LOJAS_MERCADEIRO: any[] = get(CONFIG_MERCADEIRO, 'lojas') || [];

        switch (TIPO_PROMOCOES) {
          case 'db':
            log('Encontrado: ' + VIEW_PROMOCOES);
            // console.log(CAMPOS_ESTOQUE);

            for (const LOJA of LOJAS_MERCADEIRO) {
              // console.log(LOJA);
              const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

              try {
                const PROMOCOES = (await buscaPromocoesDB(
                  sequelize,
                  ID_LOJA
                ))
                  .map(p => get(p, 'dataValues') || {});

                // console.log(PROMOCOES);
                // console.log(PRODUTOS_PROMOCOES_MAP);              

                resultado = {
                  ...resultado,
                  ...await processaPromocoesLoja(
                    API_URL,
                    ID_LOJA,
                    PROMOCOES,
                    PRODUTOS_PROMOCOES_MAP
                  )
                };
              } catch (error) {
                errorLog(`Loja ${ID_LOJA}: ${error.message}`);
              } // try-catch
            } // for
            break;

          case 'fb':
            log('Encontrado: ' + VIEW_PROMOCOES);
            // console.log(CAMPOS_ESTOQUE);

            for (const LOJA of LOJAS_MERCADEIRO) {
              // console.log(LOJA);
              const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

              try {
                const ESTOQUE: any = (await buscaEstoqueFB(ID_LOJA));

                // Object.Keys.toLowercase() && Object.values.trim()
                let estoque: any[] = [];
                ESTOQUE.forEach(p => {
                  // let o: any = 
                  const obj: any = {};
                  Object.entries(p)
                    .forEach((e: any) => {
                      // console.log(e);
                      const [K, V] = e;
                      // console.log(K, V);
                      obj[K.toLowerCase()] = typeof V === 'string'
                        ? (V || '').trim()
                        : (typeof V === 'number' ? V : V || '');
                    });
                  estoque.push(obj);
                });
                // console.log(produtos);

                resultado = {
                  ...resultado,
                  ...await processaEstoqueLoja(
                    API_URL,
                    ID_LOJA,
                    estoque
                  )
                };
              } catch (error) {
                errorLog(`Loja ${ID_LOJA}: ${error.message}`);
              } // try-catch
            } // for
            break;

          case 'csv':
            // const SOURCE: string = `${PATH}\\assets\\${ORIGEM_PRODUTOS}.csv`;
            for (const LOJA of LOJAS_MERCADEIRO) {
              // console.log(LOJA);
              const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

              const CSV_PATH: string = `${PASTA_CSV}\\estoque\\${ID_LOJA}.csv`;
              const EXTENSION: string = path.extname(CSV_PATH).toLowerCase();
              const FIELDPOS = {
                id_produto: -1,
                barcode_produto: -1,
                nome_produto: -1,
                qtde_estoque_atual: -1,
                qtde_estoque_minimo: -1
              };
              if (EXTENSION !== '.csv') {
                errorLog('Formato inválido. Apenas arquivos .csv são aceitos: config/config.ts: csv.path/estoque/{idLoja}.csv');
                break;
              } // if
              log(`Lendo ${CSV_PATH}`);
              try {
                const VALUE = await fs.readFile(CSV_PATH, 'utf8');
                // console.log(VALUE);
                if (VALUE.trim()) {
                  log('Removendo linhas vazias ou comentadas.');
                  // Separa linhas e remove vazias ou comentadas.
                  let rows: string[] = VALUE.split("\n");
                  rows = rows.filter(r => r.trim() && r && r[0] !== '*');
                  const LR: number = rows.length;
                  resultado.estoque.total = LR - 1; // Ignora cabeçalho.
                  log(`${resultado.estoque.total} produto(s) estoque controlado encontrado(s).`);
                  // qtde.total = LR - 1;

                  const HEADER: string[] = rows[0].split(';');
                  // console.log(HEADER);

                  log('Validando campos obrigatórios.');
                  // Verifica presença de campos requeridos e guarda suas posições.
                  let req: string[] = ESTOQUE_REQ_FIELDS;
                  const LH: number = HEADER.length;
                  for (let i = 0; i < LH; i++) {
                    const FIELD: string = HEADER[i].trim().replace(SEARCH_REG_EXP, '');
                    // console.log(FIELD);
                    // i === 1 && console.log(v.trim().toLowerCase().replace(SEARCH_REG_EXP, ''), FIELD);
                    req = req.filter(v => {
                      return v.trim().toLowerCase().replace(SEARCH_REG_EXP, '') !== FIELD.toLowerCase();
                    });
                    if (FIELD) {
                      FIELDPOS[FIELD] = i; // Guarda posição da coluna.
                    } // if
                  } // for
                  // console.log(req);
                  // console.log(FIELDPOS);

                  if (req.length) {
                    throw new Error(`Campos obrigatórios não indicados: ${req.join(', ')}`);
                  } // if

                  log('Verificando largura das linhas.');
                  // Verifica se todas linhas batem com header
                  const BADLINES: number[] = [];
                  // console.log(LH);
                  for (let i = 0; i < LR; i++) {
                    const ROW: string[] = rows[i].split(';');
                    // console.log(`${i} ${ROW.length}/${LH}`);
                    // console.log("\n");
                    // console.log(ROW);
                    if (ROW.length !== LH) {
                      BADLINES.push(i);
                    } else {
                      /* if (!(
                          ROW[FIELDPOS['seu_codigo']].trim().length
                          && ROW[FIELDPOS['barcode']].trim().length
                          && ROW[FIELDPOS['nome']].trim().length
                          && ROW[FIELDPOS['preco']].trim().length
                          && ROW[FIELDPOS['id_departamento']].trim().length
                      )) {
                          BADLINES.push(i);
                      } // if */
                    } // if
                  } // for
                  // console.log(BADLINES);

                  if (BADLINES.length) {
                    throw new Error(`Linhas inválidas encontradas: ${BADLINES.join(', ')}`);
                  } // if

                  log('Convertendo linhas texto para produtos estoque controlado.');
                  const ESTOQUE = [];
                  for (let i = 0; i < LR; i++) {
                    if (i) { // ignora header
                      const ROW: string[] = rows[i]
                        .replace(SEARCH_REG_EXP, '')
                        .replace("\r", '')
                        .split(';')
                        .map((r: string) => r.toLowerCase() === 'null' ? '' : r.trim());
                      // console.log(ROW);
                      const PRODUTO = {
                        'id_produto': FIELDPOS['id_produto'] >= 0
                          && `${ROW[FIELDPOS['id_produto']].trim()}`,

                        'barcode_produto': FIELDPOS['barcode_produto'] >= 0
                          && `${ROW[FIELDPOS['barcode_produto']].trim()}`,

                        'nome_produto': FIELDPOS['nome_produto'] >= 0
                          && `${ROW[FIELDPOS['nome_produto']].trim()}`,

                        'qtde_estoque_minimo': FIELDPOS['qtde_estoque_minimo'] >= 0
                          && toFloat(ROW[FIELDPOS['qtde_estoque_minimo']]),

                        'qtde_estoque_atual': FIELDPOS['qtde_estoque_atual'] >= 0
                          && toFloat(ROW[FIELDPOS['qtde_estoque_atual']])
                      };
                      ESTOQUE.push(PRODUTO);
                    } // if
                  } // for
                  // console.log(ESTOQUE);
                  resultado = {
                    ...resultado,
                    ...await processaEstoqueLoja(
                      API_URL,
                      ID_LOJA,
                      ESTOQUE
                    )
                  };
                } else {
                  log('OBS: Arquivo .csv vazio.');
                } // else
              } catch (error) {
                errorLog(error.message);
              } // try-catch
            } // for
            break;

          default:
            errorLog('Tipo de origem inválido: config/origens/config-estoque.ts: tipo');
            break;
        } // switch

        log(JSON.stringify({
          estoque: resultado.estoque
        }));
      } // if
      //#endregion

      //#region formasPgto
      const TIPO_FORMAS: string = (get(CONFIG_FORMAS, 'tipo') || '').toLowerCase();
      log('Verificando integração FORMAS PGTO.');
      if (TIPO_FORMAS) {
        const VIEW_FORMAS: string = get(CONFIG_FORMAS, 'nomeView') || '';

        // MERCADEIRO
        const API_URL: string = CONFIG.sandbox
          ? API_URLS.mercadeiro.sandbox
          : API_URLS.mercadeiro.producao;
        const LOJAS_MERCADEIRO: any[] = get(CONFIG_MERCADEIRO, 'lojas') || [];

        // console.log(TIPO_FORMAS);
        switch (TIPO_FORMAS) {
          case 'db':
            log('Encontrado: ' + VIEW_FORMAS);

            for (const LOJA of LOJAS_MERCADEIRO) {
              // console.log(LOJA);
              const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

              try {
                const FORMAS = (await buscaFormasDB(
                  sequelize,
                  ID_LOJA
                ))
                  .map(p => get(p, 'dataValues') || {});

                resultado = {
                  ...resultado,
                  ...await processaFormasLoja(
                    API_URL,
                    ID_LOJA,
                    FORMAS
                  )
                };
              } catch (error) {
                errorLog(`Loja ${ID_LOJA}: ${error.message}`);
              } // try-catch
            } // for
            break;

          case 'fb':
            log('Encontrado: ' + VIEW_FORMAS);
            for (const LOJA of LOJAS_MERCADEIRO) {
              // console.log(LOJA);
              const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

              try {
                const FORMAS: any = (await buscaFormasFB(ID_LOJA));

                // Object.Keys.toLowercase() && Object.values.trim()
                let formas: any[] = [];
                FORMAS.forEach(f => {
                  // let o: any = 
                  const obj: any = {};
                  Object.entries(f)
                    .forEach((e: any) => {
                      // console.log(e);
                      const [K, V] = e;
                      // console.log(K, V);
                      obj[K.toLowerCase()] = typeof V === 'string'
                        ? (V || '').trim()
                        : (typeof V === 'number' ? V : V || '');
                    });
                  formas.push(obj);
                });
                // console.log(formas);

                resultado = {
                  ...resultado,
                  ...await processaFormasLoja(
                    API_URL,
                    ID_LOJA,
                    formas
                  )
                };
              } catch (error) {
                errorLog(`Loja ${ID_LOJA}: ${error.message}`);
              } // try-catch
            } // for
            break;

          case 'csv':
            // const SOURCE: string = `${PATH}\\assets\\${ORIGEM_PRODUTOS}.csv`;
            for (const LOJA of LOJAS_MERCADEIRO) {
              // console.log(LOJA);
              const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

              const CSV_PATH: string = `${PASTA_CSV}\/formas-pgto\/${ID_LOJA}.csv`;
              const EXTENSION: string = path.extname(CSV_PATH).toLowerCase();
              const FIELDPOS = {
                id_interno: -1,
                forma_ativa: -1,
                // nome_forma: -1,
                id_externo: -1
              };
              if (EXTENSION !== '.csv') {
                errorLog('Formato inválido. Apenas arquivos .csv são aceitos: config/config.ts: csv.path/formas-pgto/{idLoja}.csv');
                break;
              } // if
              log(`Lendo ${CSV_PATH}`);
              try {
                const VALUE = await fs.readFile(CSV_PATH, 'utf8');
                // console.log(VALUE);
                if (VALUE.trim()) {
                  log('Removendo linhas vazias ou comentadas.');
                  // Separa linhas e remove vazias ou comentadas.
                  let rows: string[] = VALUE.split("\n");
                  rows = rows.filter(r => r.trim() && r && r[0] !== '*');
                  const LR: number = rows.length;
                  resultado.formas.total = LR - 1; // Ignora cabeçalho.
                  log(`${resultado.formas.total} forma(s) pgto encontrada(s).`);
                  // qtde.total = LR - 1;

                  const HEADER: string[] = rows[0].split(';');
                  // console.log(HEADER);

                  log('Validando campos obrigatórios.');
                  // Verifica presença de campos requeridos e guarda suas posições.
                  let req: string[] = FORMAS_REQ_FIELDS;
                  const LH: number = HEADER.length;
                  for (let i = 0; i < LH; i++) {
                    const FIELD: string = HEADER[i].trim().replace(SEARCH_REG_EXP, '');
                    // console.log(FIELD);
                    // i === 1 && console.log(v.trim().toLowerCase().replace(SEARCH_REG_EXP, ''), FIELD);
                    req = req.filter(v => {
                      return v.trim().toLowerCase().replace(SEARCH_REG_EXP, '') !== FIELD.toLowerCase();
                    });
                    if (FIELD) {
                      FIELDPOS[FIELD] = i; // Guarda posição da coluna.
                    } // if
                  } // for
                  // console.log('req', req);
                  // console.log('FIELDPOS', FIELDPOS);

                  if (req.length) {
                    throw new Error(`Campos obrigatórios não indicados: ${req.join(', ')}`);
                  } // if

                  log('Verificando largura das linhas.');
                  // Verifica se todas linhas batem com header
                  const BADLINES: number[] = [];
                  // console.log(LH);
                  for (let i = 0; i < LR; i++) {
                    const ROW: string[] = rows[i].split(';');
                    // console.log(`${i} ${ROW.length}/${LH}`);
                    // console.log("\n");
                    // console.log(ROW);
                    if (ROW.length !== LH) {
                      BADLINES.push(i);
                    } else {
                      /* if (!(
                          ROW[FIELDPOS['seu_codigo']].trim().length
                          && ROW[FIELDPOS['barcode']].trim().length
                          && ROW[FIELDPOS['nome']].trim().length
                          && ROW[FIELDPOS['preco']].trim().length
                          && ROW[FIELDPOS['id_departamento']].trim().length
                      )) {
                          BADLINES.push(i);
                      } // if */
                    } // if
                  } // for
                  // console.log(BADLINES);

                  if (BADLINES.length) {
                    throw new Error(`Linhas inválidas encontradas: ${BADLINES.join(', ')}`);
                  } // if

                  log('Convertendo linhas texto para formas pgto.');
                  const FORMAS = [];
                  for (let i = 0; i < LR; i++) {
                    if (i) { // ignora header
                      const ROW: string[] = rows[i]
                        .replace(SEARCH_REG_EXP, '')
                        .replace("\r", '')
                        .split(';')
                        .map((r: string) => r.toLowerCase() === 'null' ? '' : r.trim());
                      // console.log(ROW);
                      const FORMA = {
                        'id_interno': FIELDPOS['id_interno'] >= 0
                          ? `${ROW[FIELDPOS['id_interno']].trim()}`
                          : '',

                        'forma_ativa': FIELDPOS['forma_ativa'] >= 0
                          ? chkBool(ROW[FIELDPOS['forma_ativa']] || '')
                          : true,

                        'nome_forma': FIELDPOS['nome_forma'] >= 0
                          ? `${ROW[FIELDPOS['nome_forma']].trim()}`
                          : '',

                        'id_externo': FIELDPOS['id_externo'] >= 0
                          ? `${ROW[FIELDPOS['id_externo']].trim()}`
                          : '',
                      };
                      FORMAS.push(FORMA);
                    } // if
                  } // for
                  // console.log(FORMAS);
                  resultado = {
                    ...resultado,
                    ...await processaFormasLoja(
                      API_URL,
                      ID_LOJA,
                      FORMAS
                    )
                  };
                } else {
                  log('OBS: Arquivo .csv vazio.');
                } // else
              } catch (error) {
                errorLog(error.message);
              } // try-catch
            } // for
            break;

          default:
            errorLog('Tipo de origem inválido: config/origens/config-formas-pgto.ts: tipo');
            break;
        } // switch

        log(JSON.stringify({
          formas: resultado.formas
        }));
      } // if
      //#endregion

      log(JSON.stringify(resultado));
      // log(JSON.stringify(AUTO_DESTAQUES));
    }// else
  } catch (error) {
    errorLog(error.message);
  } // try-catch    
})();
