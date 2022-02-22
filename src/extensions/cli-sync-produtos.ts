//#region gluegun
import { GluegunToolbox } from 'gluegun';
const { http } = require('gluegun');
//#endregion

//#region 3rd
const fs = require('fs');
import {
  get,
  uniqBy
} from 'lodash';
const HASH = require('object-hash');
const JSONdb = require('simple-json-db');
//#endregion 

//#region libs
import {
  chkBool,
  buscaDeptosSubs
} from '../libs';
//#endregion

//#region models
const configJson = require('../../config/config.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runSyncProdutos = async (props: any) => {
    const { print } = toolbox;
    // const QTDE_AUTO_DESTAQUE: number = 10;

    function hasSub(
      keys: any[] = [],
      key: string = ''
    ): boolean {
      // key.includes(`${key}_`)
      if (keys.length && key) {
        const KEY: string = `${key}_`;
        return keys.some(key => key.startsWith(KEY));
      } // if
      return false;
    }

    // const LOGS: any[] = [];

    const AUTO_DESTAQUES: any = {};

    const {
      dryRun: DRY_RUN,
      apiUrl: API_URL,
      projeto: PROJETO,
      loja: LOJA
    } = props;

    const {
      id: LOJA_ID,
      token: LOJA_TOKEN
    } = LOJA;

    // JSONdb
    const DIR: string = `./hashes/${PROJETO}/lojas/${LOJA_ID}`;
    if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
    const DB_DEPTOS = new JSONdb(
      `${DIR}/departamentos.db`,
      { asyncWrite: false }
    );
    const DB_SUBS = new JSONdb(
      `${DIR}/subdepartamentos.db`,
      { asyncWrite: false }
    );
    const DB_PRODUTOS = new JSONdb(
      `${DIR}/produtos.db`,
      { asyncWrite: false }
    );

    // print.warning(props);
    const API = http.create({
      baseURL: API_URL,
      headers: { 'Authorization': `Bearer ${LOJA_TOKEN}` },
    });

    const { ok: OK, data: DATA } = await API.get('/produtos/some');
    const HAS_PRODUTOS: boolean = OK ? !!get(DATA, 'some') : false;

    const {
      usaDepartamentosBase: CONFIG_USA_DEPARTAMENTOS_BASE,
      qtdeAutoDestaque: QTDE_AUTO_DESTAQUE
    } = configJson;
    // print.debug(QTDE_AUTO_DESTAQUE);

    const PRODUTOS_BARCODES: any[] = get(props, 'produtos.barcodes') || [];
    const PRODUTOS_NBARCODES: any[] = get(props, 'produtos.nbarcodes') || [];
    const PRODUTOS_ALL: any[] = PRODUTOS_BARCODES.concat(PRODUTOS_NBARCODES);
    // print.success(PRODUTOS_BARCODES.length);
    // print.success(PRODUTOS_NBARCODES.length);

    try {
      const {
        departamentos: DEPTOS_BARCODES,
        subdepartamentos: SUBS_BARCODES
      } = buscaDeptosSubs(PRODUTOS_BARCODES);
      const {
        departamentos: DEPTOS_NBARCODES,
        subdepartamentos: SUBS_NBARCODES
      } = buscaDeptosSubs(PRODUTOS_NBARCODES);
      const DEPTOS_ALL: any[] = uniqBy(
        DEPTOS_BARCODES.concat(DEPTOS_NBARCODES),
        'departamento_id'
      );
      const SUBS_ALL: any[] = uniqBy(
        SUBS_BARCODES.concat(SUBS_NBARCODES),
        'subdepartamento_id'
      );
      // print.debug(SUBS_ALL);
      if (!HAS_PRODUTOS) {
        DEPTOS_ALL.forEach((d: any) =>
          AUTO_DESTAQUES[`${get(d, 'departamento_id')}`] = QTDE_AUTO_DESTAQUE
        );
        SUBS_ALL.forEach((d: any) =>
          AUTO_DESTAQUES[`${get(d, 'departamento_id')}_${get(d, 'subdepartamento_id')}`] = QTDE_AUTO_DESTAQUE
        );
        // AUTO_DESTAQUES: Object.entries
        const KEYS = Object.keys(AUTO_DESTAQUES);
        KEYS.forEach((key: string) => {
          if (
            !key.includes('_')
            && hasSub(KEYS, key)
          ) {
            AUTO_DESTAQUES[key] = 0;
          } // if
        });
      } // if
      // print.debug(AUTO_DESTAQUES);

      print.table(
        [
          ['Produto(s) encontrado(s)', String(PRODUTOS_ALL.length)],
          ['Departamento(s) encontrado(s)', String(DEPTOS_ALL.length)],
          ['Subdepartamento(s) encontrado(s)', String(SUBS_ALL.length)],
        ],
        { format: 'lean' }
      );

      // const DEPTOS_SYNC: any[] = [...DEPTOS_NBARCODES];
      const DEPTOS_SYNC: any[] = CONFIG_USA_DEPARTAMENTOS_BASE
        ? DEPTOS_NBARCODES
        : DEPTOS_ALL;
      const SUBS_SYNC: any[] = CONFIG_USA_DEPARTAMENTOS_BASE
        ? SUBS_NBARCODES
        : SUBS_ALL;

      // print.table([...LOGS], { format: 'lean' });

      print.divider();
      print.warning('Sincronizando departamentos...');
      print.divider();
      for (const DEPTO of DEPTOS_SYNC) {
        const DEPTO_ID: string = get(DEPTO, 'departamento_id');
        if (DEPTO_ID) {
          const DEPTO_BODY = {
            nome: get(DEPTO, 'departamento_nome'),
            ativo: chkBool(get(DEPTO, 'departamento_ativo')),
          };
          const HASH_DEPTO: string = HASH(DEPTO_BODY);
          const DB_HASH_DEPTO = get(DB_DEPTOS.get(DEPTO_ID), 'hash');
          if (!DRY_RUN) {
            try {
              DB_DEPTOS.set(
                DEPTO_ID,
                { hash: HASH_DEPTO }
              );
              if (HASH_DEPTO !== DB_HASH_DEPTO) {
                // console.log(HASH_DEPTO, DB_HASH_DEPTO);
                await API.post(
                  `/departamentos/${DEPTO_ID}`,
                  DEPTO_BODY
                );
                print.success(JSON.stringify(DEPTO_BODY));
                print.divider();
              } // if
            } catch (err) {
              print.error(err);
            } // try-catch
          } else {
            if (HASH_DEPTO !== DB_HASH_DEPTO) {
              // console.log(HASH_DEPTO, DB_HASH_DEPTO);
              print.highlight(`DRY-RUN: #${DEPTO_ID} ${JSON.stringify(DEPTO_BODY)}`);
              print.divider();
            } // if
          } // else
        } // if
      } // for

      print.divider();
      print.warning('Sincronizando subdepartamentos...')
      print.divider();
      for (const SUB of SUBS_SYNC) {
        const SUB_ID: string = get(SUB, 'subdepartamento_id');
        const DEPTO_ID: string = get(SUB, 'departamento_id');
        if (SUB_ID) {
          const SUB_BODY = {
            nome: get(SUB, 'subdepartamento_nome'),
            ativo: chkBool(get(SUB, 'subdepartamento_ativo')),
          };
          const HASH_SUB: string = HASH(SUB_BODY);
          const DB_HASH_SUB = get(DB_SUBS.get(SUB_ID), 'hash');
          if (!DRY_RUN) {
            try {
              DB_SUBS.set(
                SUB_ID,
                { hash: HASH_SUB }
              );
              if (HASH_SUB !== DB_HASH_SUB) {
                await API.post(
                  `/departamentos/${DEPTO_ID}/subdepartamentos/${SUB_ID}`,
                  SUB_BODY
                );
                print.success(JSON.stringify(SUB_BODY));
                print.divider();
              } // if
            } catch (error) {
              print.error(error);
            } // try-catch
          } else {
            // print.highlight(`DRY-RUN: ${JSON.stringify(SUB_BODY)}`);
            if (HASH_SUB !== DB_HASH_SUB) {
              print.highlight(`DRY-RUN: #${SUB_ID} ${JSON.stringify(SUB_BODY)}`);
              print.divider();
            }
          } // else
        } // if
      } // for

      print.divider();
      print.warning('Sincronizando produtos...')
      print.divider();
      for (const PRODUTO of PRODUTOS_ALL) {
        // TODO: Calcular estoqueCritico usando qtde_estoque_minimo <-> qtde_estoque_atual
        const PROD_ID: string = String(get(PRODUTO, 'id'));
        const DEPTO_ID: string = String(get(PRODUTO, 'departamento_id') || '');
        const SUB_ID: string = String(get(PRODUTO, 'subdepartamento_id') || '');
        if (PROD_ID) {
          const PROD_BODY: any = {
            "atacado": {
              "status": !!chkBool(get(PRODUTO, 'atacado_status')),
              "qtde": Number(get(PRODUTO, 'atacado_qtde') || 0),
              "valor": Number(get(PRODUTO, 'atacado_preco') || 0),
            },
            "ativo": !!chkBool(get(PRODUTO, 'ativo')),
            "barcode": get(PRODUTO, 'barcode') || '',
            "estoqueCritico": false, // chkBool(get(PRODUTO, 'ativo')),
            "departamento": {
              "ativo": !!chkBool(get(PRODUTO, 'departamento_ativo')),
              "id": DEPTO_ID,
              "nome": get(PRODUTO, 'departamento_nome') || '',
            },
            // "destaque": !!(Math.random() < 0.5),
            // "limiteVenda": {
            //   "max": Number(get(PRODUTO, 'preco') || 0),
            //   "min": Number(get(PRODUTO, 'preco') || 0),
            // },
            "ncm": get(PRODUTO, 'ncm') || '',
            "nome": get(PRODUTO, 'nome') || '',
            "preco": Number(get(PRODUTO, 'preco') || 0),
            "subdepartamento": {
              "ativo": !!chkBool(get(PRODUTO, 'subdepartamento_ativo', true)),
              "id": SUB_ID,
              "nome": get(PRODUTO, 'subdepartamento_nome') || '',
            },
            "tipoUnidadeFracao": get(PRODUTO, 'tipo_unidade_fracao') || '',
            "usaDepartamentoBase": !!chkBool(CONFIG_USA_DEPARTAMENTOS_BASE),
          };

          if (!HAS_PRODUTOS) {
            const KEY: string = !!SUB_ID ? `${DEPTO_ID}_${SUB_ID}` : DEPTO_ID;
            const QTDE: number = Number(get(AUTO_DESTAQUES, KEY, 0));
            if (QTDE > 0) {
              AUTO_DESTAQUES[KEY] = QTDE - 1;
              PROD_BODY.destaque = true;
            } // if
          } // if

          const HASH_PROD: string = HASH(PROD_BODY);
          const DB_HASH_PROD = get(DB_PRODUTOS.get(PROD_ID), 'hash');
          if (!DRY_RUN) {
            try {
              if (HASH_PROD !== DB_HASH_PROD) {
                DB_PRODUTOS.set(
                  PROD_ID,
                  { hash: HASH_PROD }
                );
                // console.log(PROD_ID, HASH_PROD, DB_HASH_PROD);
                API.post(
                  `/produtos/${PROD_ID}`,
                  PROD_BODY
                )
                  .then(() => {
                    print.success(JSON.stringify(PROD_BODY));
                    print.divider();
                  });
              } // if
            } catch (err) {
              print.warning(err);
            } // try-catch
          } else {
            // print.highlight(`DRY-RUN: ${JSON.stringify(SUB_BODY)}`);
            // console.log(PROD_ID, HASH_PROD, DB_HASH_PROD);
            if (HASH_PROD !== DB_HASH_PROD) {
              print.highlight(`DRY-RUN: #${PROD_ID} ${JSON.stringify(PROD_BODY)}`);
              print.divider();
            } // if
          } // else
        } // if
      } // for
      // LOGS = [];

      // print.info(LOJA_TOKEN);
      // print.info(API_URL);

      // const { ok, data } = await API.get(`/departamentos/${1}`);
    } catch (error) {
      print.error(error.message);
    } // try-catch
  };
}
