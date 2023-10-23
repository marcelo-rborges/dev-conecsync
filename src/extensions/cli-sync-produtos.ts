//#region gluegun
import { GluegunToolbox } from 'gluegun';
const { http } = require('gluegun');
const os = require('os');
//#endregion

//#region 3rd
// import axios/* , { AxiosResponse } */ from 'axios';
const fs = require('fs');
import {
  get,
  // uniqBy
} from 'lodash';
const HASH = require('object-hash');
const JSONdb = require('simple-json-db');
//#endregion 

//#region libs
import { buildUrl, chkBool } from '../libs';
//#endregion

//#region models
type TStatusOnlineProduto = 'on' | 'off' | 'auto';
const configJson = require('../../config/config.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runSyncProdutos = async (props: any) => {
    const { print } = toolbox;
    // const QTDE_AUTO_DESTAQUE: number = 10;

    // const LOGS: any[] = [];
    // const AUTO_DESTAQUES: any = {};
    const PRODUTO_FRACIONADO_FRACAO_DEFAULTS = {
      KG: 0.5,
      K: 0.5,
      GR: 500,
      G: 500,
      LT: 0.5,
      L: 0.5,
      ML: 500,
      MT: 0.5,
      M: 0.5,
      CM: 500,
    };
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
    const TOTAL: {
      changed: number,
      unchanged: number
    } = {
      changed: 0,
      unchanged: 0
    };

    let deptos = [];

    // JSONdb
    const DIR: string = `${os.tmpdir()}/hashes/${PROJETO}/lojas/${LOJA_ID}`;
    // console.log('DIR: ', DIR, fs.existsSync(DIR));
    // try {
    if (!fs.existsSync(DIR)) { fs.mkdirSync(DIR, { recursive: true }); }
    //   fs.access(
    //     DIR,
    //     (error) => {
    //       console.log(error);
    //       !!error && fs.mkdirSync(DIR, { recursive: true });
    //     }
    //   );
    // } catch (error) {
    //   !!error && console.log(get(error, 'message') || '');
    // } // try-catch

    const DB_PRODUTOS = new JSONdb(`${DIR}/produtos.db`, { asyncWrite: false });

    // print.warning(props);
    const API = http.create({ baseURL: API_URL, headers: { 'Authorization': `Bearer ${LOJA_TOKEN}` } });
    // const API = axios.create({
    //   baseURL: API_URL,
    //   timeout: 1000,
    //   headers: { 'Authorization': `Bearer ${LOJA_TOKEN}` }
    // });

    // const { ok: OK, data: DATA } = await API.get('/produtos/flags/some');
    // const HAS_PRODUTOS: boolean = OK ? !!get(DATA, 'some') : false;
    // print.debug(`HAS_PRODUTOS:${HAS_PRODUTOS}`);

    // const PRODUTOS_BARCODES: any[] = get(props, 'produtos.barcodes') || [];
    // const PRODUTOS_NBARCODES: any[] = get(props, 'produtos.nbarcodes') || [];
    // const PRODUTOS_ALL: any[] = PRODUTOS_BARCODES.concat(PRODUTOS_NBARCODES);
    const PRODUTOS_ALL: any[] = get(props, 'produtos') || [];
    // print.debug(PRODUTOS_ALL);
    const PRODUTOS_SOME = (await API.get('/produtos/flags/some'))?.data?.some;

    print.table(
      [
        ['Produto(s) encontrado(s)', String(PRODUTOS_ALL.length)],
        ['Primeira carga', !!PRODUTOS_SOME ? 'Não' : 'Sim'],
        // ['Produto(s) com barcodes(s)', String(PRODUTOS_BARCODES.length)],
        // ['Produto(s) sem barcodes(s)', String(PRODUTOS_NBARCODES.length)],
        // ['Departamento(s) encontrado(s)', String(DEPTOS_ALL.length)],
        // ['Subdepartamento(s) encontrado(s)', String(SUBS_ALL.length)],
      ],
      { format: 'lean' }
    );

    print.divider();
    print.warning('Sincronizando produtos...')
    print.divider();
    for (const PRODUTO of PRODUTOS_ALL) {
      // console.log(PRODUTO);
      // print.debug(`${PRODUTO.ID_PRODUTO}:${JSON.stringify(PRODUTO)}`);
      // TODO: Calcular estoqueCritico usando qtde_estoque_minimo <-> qtde_estoque_atual
      const BARCODE: string = String(get(PRODUTO, 'barcodeProduto') || '').trim();
      const PROD_ID: string = String(get(PRODUTO, 'idProduto') || '');
      // print.debug(`PROD_ID:${PROD_ID}`);
      const DEPTO1_ID: string = String(get(PRODUTO, 'idDepartamento1') || '');
      const DEPTO2_ID: string = String(get(PRODUTO, 'idDepartamento2') || '');
      const DEPTO3_ID: string = String(get(PRODUTO, 'idDepartamento3') || '');
      const FRACIONADO_TIPO: string = (get(PRODUTO, 'fracionadoTipo') || '').toUpperCase();

      // idLoja: fixBuffStr(get(row, 'ID_LOJA')) || '',
      // estoqueControlado: fixBuffStr(get(row, 'ESTOQUE_CONTROLADO')) || '',
      // qtdeEstoqueMinimo: fixBuffStr(get(row, 'QTDE_ESTOQUE_MINIMO')) || '',
      // qtdeEstoqueAtual: fixBuffStr(get(row, 'QTDE_ESTOQUE_ATUAL')) || '',

      if (!!PROD_ID) {
        const PROD_BODY: any = {
          "atacado": {
            "status": !!chkBool(get(PRODUTO, 'atacadoStatus')),
            "qtde": Number((get(PRODUTO, 'atacadoQtde') || '')).toString().replace(/,/g, '.') || 0,
            "preco": Number((get(PRODUTO, 'atacadoPreco') || '')).toString().replace(/,/g, '.') || 0,
          },
          "ativo": !!chkBool(get(PRODUTO, 'ativoProduto')),
          "barcode": BARCODE,
          "departamento1": {
            "id": DEPTO1_ID,
            "nome": get(PRODUTO, 'nomeDepartamento1') || '',
          },
          "departamento2": {
            "id": DEPTO2_ID,
            "nome": get(PRODUTO, 'nomeDepartamento2') || '',
          },
          "departamento3": {
            "id": DEPTO3_ID,
            "nome": get(PRODUTO, 'nomeDepartamento3') || '',
          },
          // "departamento3": {
          //   // "ativo": !!chkBool(get(PRODUTO, 'ativoSubdepartamento', true)),
          //   "id": SUB_ID2,
          //   "nome": get(PRODUTO, 'nomeSubdepartamento2') || '',
          // },
          "estoqueCritico": false,
          "fracao": {
            tipo: FRACIONADO_TIPO,
            valor: Number(get(PRODUTO_FRACIONADO_FRACAO_DEFAULTS, FRACIONADO_TIPO) || '').toString().replace(/,/g, '.') || 0,
          },
          // "limiteVenda": {
          //   "max": Number(get(PRODUTO, 'preco') || 0),
          //   "min": Number(get(PRODUTO, 'preco') || 0),
          // },
          "ncm": PRODUTO?.ncmProduto || '',
          "nome": PRODUTO?.nomeProduto || '',
          "preco": {
            desc: 0,
            produto: Number((PRODUTO?.precoVenda || '')).toString().replace(/,/g, '.') || 0,
          },
          // "tipoUnidadeFracao": FRACIONADO_TIPO,
          // "usaDepartamentoBase": !!chkBool(CONFIG_USA_DEPARTAMENTOS_BASE),
          "usaNomesBase": chkBool(configJson?.usaNomesBase),
          "usaDepartamentosBase": chkBool(configJson?.usaDepartamentosBase),
        };

        if (!PRODUTOS_SOME) {
          const ONLINE_STATUS: TStatusOnlineProduto = configJson?.statusOnline;
          // if (typeof ONLINE_STATUS === 'boolean') { PROD_BODY.online = !!ONLINE_STATUS; } // if
          PROD_BODY.online = ONLINE_STATUS === 'on'
            ? true
            : ONLINE_STATUS === 'off'
              ? false
              : !!BARCODE;
        } // if

        // print.debug(`${PROD_ID}:${JSON.stringify(PROD_BODY)}`);

        // if (!HAS_PRODUTOS) {
        //   const KEY: string = !!SUB_ID ? `${DEPTO_ID}_${SUB_ID}` : DEPTO_ID;
        //   const QTDE: number = Number(get(AUTO_DESTAQUES, KEY, 0));
        //   if (QTDE > 0) {
        //     AUTO_DESTAQUES[KEY] = QTDE - 1;
        //     PROD_BODY.destaque = true;
        //   } // if
        // } // if

        const HASH_PROD: string = HASH(PROD_BODY) || '';
        const DB_HASH_PROD = get(DB_PRODUTOS.get(PROD_ID), 'hash') || '';
        // print.debug(`DRY-RUN:${!!DRY_RUN}, #${PROD_ID}, HASH_PROD:${HASH_PROD}, DB_HASH_PROD:${DB_HASH_PROD}`);
        const HASH_CHANGED: boolean = HASH_PROD !== DB_HASH_PROD;
        TOTAL[HASH_CHANGED ? 'changed' : 'unchanged'] += 1;
        process.stdout.write(HASH_CHANGED ? '*' : '.');
        if (!DRY_RUN) {
          try {
            if (!!HASH_CHANGED) {
              DB_PRODUTOS.set(PROD_ID, { hash: HASH_PROD });
              // await API.post(`/produtos/${PROD_ID}`, PROD_BODY);
              /* API.post(
                `/produtos/${PROD_ID}`,
                PROD_BODY
              )
                .then(() => {
                  print.success(`\n#${PROD_ID}: ${JSON.stringify(PROD_BODY)}`);
                  print.divider();
                }); */
              // gluegun.http
              const RESP = await API.post(`/produtos/${PROD_ID}`, PROD_BODY);
              // print.debug(`\n#OK: ${PROD_ID}: ${JSON.stringify(RESP?.data)}`);
              // axios
              // const RET: AxiosResponse = 
              // await API.post(`/produtos/${PROD_ID}`, PROD_BODY);
              // print.success(`\n#${PROD_ID}: ${JSON.stringify(PROD_BODY)}`);
              deptos.push(`${RESP?.data?.departamentos?.d1?.id || ''},${RESP?.data?.departamentos?.d1?.nome || ''},${RESP?.data?.departamentos?.d2?.id || ''},${RESP?.data?.departamentos?.d2?.nome || ''},${RESP?.data?.departamentos?.d3?.id || ''},${RESP?.data?.departamentos?.d3?.nome || ''}`);
              // deptos.push(`${RESP?.data?.departamentos?.d1?.id || ''},${RESP?.data?.departamentos?.d2?.id || ''},${RESP?.data?.departamentos?.d3?.id || ''}`);
              print.success(`\n#${PROD_ID}: ${JSON.stringify(RESP?.data)}`);
              print.divider();
            } // if
          } catch (err) {
            !!err && print.warning(err);
          } // try-catch
        } else {
          // print.highlight(`DRY-RUN: ${JSON.stringify(SUB_BODY)}`);
          // console.log(PROD_ID, HASH_PROD, DB_HASH_PROD);
          if (HASH_PROD !== DB_HASH_PROD) {
            print.highlight(`\nDRY-RUN: #${PROD_ID}: ${JSON.stringify(PROD_BODY)}`);
            print.divider();
          } // if
        } // else
      } // if
    } // for

    // process.stdout.write(JSON.stringify(TOTAL));
    process.stdout.write('\n');
    print.divider();
    print.table(
      [
        ['Produto(s) modificado(s)', String(TOTAL.changed)],
        ['Produto(s) NÃO modificado(s)', String(TOTAL.unchanged)],
      ],
      { format: 'lean' }
    );
    if (!DRY_RUN) {
      const UNIQUE = [];
      deptos.forEach((s) => { if (!UNIQUE.includes(s)) { UNIQUE.push(s); } });
      deptos = (UNIQUE || [])
        .map(ad => (ad.split(',').filter(s => !!s)).join(','))
        .filter(s => !!s.replace(/,/g, ''))
        .filter(as => ((as.split(',') || []).length > 2));
      // console.log(deptos);

      print.divider();
      print.warning('Verificando departamentos...')
      print.divider();
      for (const ad of (deptos || [])) {
        try {
          // let path = `/departamentos/${PROD_ID}`
          // print.debug(ad);
          const CELLS = ad.split(',');
          if (CELLS?.length === 4 || CELLS?.length === 6) {
            const [D1, N1, D2, N2, D3, N3] = CELLS;
            // print.debug([D1, N1, D2, N2, D3, N3]);
            let nome: string = N1;

            // let url = new URL(`/departamentos/${D1}`);
            // !!D2 && url.searchParams.append('id2', D2);
            // !!D3 && url.searchParams.append('id3', D3);
            // print.debug(url);

            const PARAMS: any = {};
            if (!!D2) { PARAMS.id2 = D2; nome = N2; }
            if (!!D3) { PARAMS.id3 = D3; nome = N3; }

            // /departamentos/OrlVI1XYyxM2519fc3Mq?id2=mowjjkPCnDRsL5zGMw1n&id3=FNbVRuxJfcqGcPVo42XY
            const URL: string = buildUrl(`/departamentos/${D1}`, PARAMS);
            // print.debug(URL);
            const CHANGES: any = {
              nome,
              _refresh: Math.random().toString(36).slice(2, 10),
            };
            await API.post(URL, CHANGES);
            print.success(`\n#${nome}: ${JSON.stringify(CHANGES)}`);

            // const RESP = await API.post(path, PROD_BODY);
            print.divider();
          } // if
        } catch (err) {
          !!err && print.warning(err);
        } // try-catch
      } // for-of
    } // if

    /*
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
        
      } // for
      // LOGS = [];
 
      // print.info(LOJA_TOKEN);
      // print.info(API_URL);
      // const { ok, data } = await API.get(`/departamentos/${1}`);
    } catch (error) {
      print.error(error.message);
    } // try-catch
    */
  };
}
