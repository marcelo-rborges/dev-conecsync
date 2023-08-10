//#region gluegun
import { GluegunToolbox } from 'gluegun';
const { http } = require('gluegun');
//#endregion

//#region 3rd
const fs = require('fs');
// import {
//   get,
//   uniqBy
// } from 'lodash';
// const HASH = require('object-hash');
// const JSONdb = require('simple-json-db');
//#endregion 

//#region libs
// import {
//   chkBool
// } from '../libs';
//#endregion

//#region models
// const configJson = require('../../config/config.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runSyncFormasPgto = async (props: any) => {
    const { print } = toolbox;
    // const QTDE_AUTO_DESTAQUE: number = 10;

    // function hasSub(
    //   keys: any[] = [],
    //   key: string = ''
    // ): boolean {
    //   // key.includes(`${key}_`)
    //   if (keys.length && key) {
    //     const KEY: string = `${key}_`;
    //     return keys.some(key => key.startsWith(KEY));
    //   } // if
    //   return false;
    // }

    // const LOGS: any[] = [];

    // const AUTO_DESTAQUES: any = {};

    const {
      // dryRun: DRY_RUN,
      apiUrl: API_URL,
      projeto: PROJETO,
      loja: LOJA,
      formasPgto: FORMAS_PGTO
    } = props;

    const {
      id: LOJA_ID,
      token: LOJA_TOKEN
    } = LOJA;

    // JSONdb
    const DIR: string = `./hashes/${PROJETO}/formas-pgto/${LOJA_ID}`;
    if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
    // const DB_FORMAS_PGTO = new JSONdb(
    //   `${DIR}/formasPgto.db`,
    //   { asyncWrite: false }
    // );
    const API = http.create({
      baseURL: API_URL,
      headers: { 'Authorization': `Bearer ${LOJA_TOKEN}` },
    });

    // const {
    //   ok: OK,
    // } = await API.get('/formas-pgto');
    // const HAS_PRODUTOS: boolean = OK ? !!get(DATA, 'some') : false;

    // print.warning(props);
    // const API = http.create({
    //   baseURL: API_URL,
    //   headers: { 'Authorization': `Bearer ${LOJA_TOKEN}` },
    // });

    // const { ok: OK, data: DATA } = await API.get('/produtos/some');
    // const HAS_PRODUTOS: boolean = OK ? !!get(DATA, 'some') : false;

    // const PRODUTOS_BARCODES: any[] = get(props, 'produtos.barcodes') || [];
    // const PRODUTOS_NBARCODES: any[] = get(props, 'produtos.nbarcodes') || [];
    // const PRODUTOS_ALL: any[] = PRODUTOS_BARCODES.concat(PRODUTOS_NBARCODES);
    // print.success(PRODUTOS_BARCODES.length);
    // print.success(PRODUTOS_NBARCODES.length);

    try {
      print.divider();
      print.warning('Sincronizando Formas de pagamento...');
      print.divider();

      // print.info(FORMAS_PGTO);

      FORMAS_PGTO.map(async el => {
        // print.info(el.id_interno);
        await API.post(`/formas-pgto/${el.id_interno}`)
        const { ok: OK } = await API.get('/formas-pgto');
        print.info(OK)
        // const teste  = await API.get('/formas-pgto/');
      })
      // const { ok: OK,
      //   // data: DATA
      // } = await API.get('/formas-pgto/');
      // print.info(OK)


      // for (const DEPTO of DEPTOS_SYNC) {
      //   const DEPTO_ID: string = get(DEPTO, 'departamento_id');
      //   if (DEPTO_ID) {
      //     const DEPTO_BODY = {
      //       nome: get(DEPTO, 'departamento_nome'),
      //       ativo: chkBool(get(DEPTO, 'departamento_ativo')),
      //     };
      //     const HASH_DEPTO: string = HASH(DEPTO_BODY);
      //     const DB_HASH_DEPTO = get(DB_DEPTOS.get(DEPTO_ID), 'hash');
      //     if (!DRY_RUN) {
      //       try {
      //         DB_DEPTOS.set(
      //           DEPTO_ID,
      //           { hash: HASH_DEPTO }
      //         );
      //         if (HASH_DEPTO !== DB_HASH_DEPTO) {
      //           // console.log(HASH_DEPTO, DB_HASH_DEPTO);
      //           await API.post(
      //             `/departamentos/${DEPTO_ID}`,
      //             DEPTO_BODY
      //           );
      //           print.success(JSON.stringify(DEPTO_BODY));
      //           print.divider();
      //         } // if
      //       } catch (err) {
      //         print.error(err);
      //       } // try-catch
      //     } else {
      //       if (HASH_DEPTO !== DB_HASH_DEPTO) {
      //         // console.log(HASH_DEPTO, DB_HASH_DEPTO);
      //         print.highlight(`DRY-RUN: #${DEPTO_ID} ${JSON.stringify(DEPTO_BODY)}`);
      //         print.divider();
      //       } // if
      //     } // else
      //   } // if
      // } // for


      // LOGS = [];

      // print.info(LOJA_TOKEN);
      // print.info(API_URL);

      // const { ok, data } = await API.get(`/departamentos/${1}`);
    } catch (error) {
      print.error(error.message);
    } // try-catch
  };
}
