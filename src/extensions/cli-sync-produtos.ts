//#region gluegun
import { GluegunToolbox } from 'gluegun';
const { http } = require('gluegun');
//#endregion

//#region 3rd
import { get } from 'lodash';
//#endregion 

//#region libs
import {
  chkBool,
  buscaDeptosSubs
} from '../libs';
//#endregion

//#region models
// const sequelizeConn = require('../libs/sequelize-conn');
// import { CAMPOS_PRODUTOS } from '../models/consts';
// const configJson = require('../../config/config.json');
// const produtosJson = require('../../config/origens/produtos.json');
// const mariadbJson = require('../../config/conexoes/mariadb.json');
// const mysqlJson = require('../../config/conexoes/mysql.json');
// const mssqlJson = require('../../config/conexoes/mssql.json');
// const postgresqlJson = require('../../config/conexoes/postgresql.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runSyncProdutos = async (props: any) => {
    const { print } = toolbox;

    // const LOGS: any[] = [];

    const {
      apiUrl: API_URL,
      tokenLoja: TOKEN_LOJA,
    } = props;

    // print.warning(props);
    const API = http.create({
      baseURL: API_URL,
      headers: { 'Authorization': `Bearer ${TOKEN_LOJA}` },
    });

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
      const DEPTOS_ALL: any[] = DEPTOS_BARCODES.concat(DEPTOS_NBARCODES);
      const SUBS_ALL: any[] = SUBS_BARCODES.concat(SUBS_NBARCODES);

      print.table(
        [
          ['Produto(s) encontrado(s)', String(PRODUTOS_ALL.length)],
          ['Departamento(s) encontrado(s)', String(DEPTOS_ALL.length)],
          ['Subdepartamento(s) encontrado(s)', String(SUBS_ALL.length)],
        ],
        { format: 'lean' }
      );
      // print.table([...LOGS], { format: 'lean' });

      print.divider();
      print.warning('Sincronizando departamentos...')
      print.divider();
      for (const DEPTO of DEPTOS_ALL) {
        const DEPTO_ID: string = get(DEPTO, 'departamento_id');
        const DEPTO_BODY = {
          nome: get(DEPTO, 'departamento_nome'),
          ativo: chkBool(get(DEPTO, 'departamento_ativo')),
        };
        // print.debug(DEPTO_BODY);
        API.post(
          `/departamentos/${DEPTO_ID}`,
          DEPTO_BODY
        );
        print.success(DEPTO_BODY);
      } // for

      print.divider();
      print.warning('Sincronizando subdepartamentos...')
      print.divider();
      for (const SUB of SUBS_ALL) {
        const SUB_ID: string = get(SUB, 'departamento_id');
        const SUB_BODY = {
          nome: get(SUB, 'subdepartamento_nome'),
          ativo: chkBool(get(SUB, 'subdepartamento_ativo')),
        };
        // print.debug(SUB_BODY);
        API.post(
          `/subdepartamentos/${SUB_ID}`,
          SUB_BODY
        );
        print.success(SUB_BODY);
      } // for

      print.divider();
      print.warning('Sincronizando produtos...')
      print.divider();
      for (const PRODUTO of PRODUTOS_ALL) {
        // TODO: Calcular estoqueCritico usando qtde_estoque_minimo <-> qtde_estoque_atual

        const PRODUTO_ID: string = String(get(PRODUTO, 'id'));
        const PRODUTO_BODY = {
          "atacado": {
            "status": !!chkBool(get(PRODUTO, 'atacado_status')),
            "qtde": Number(get(PRODUTO, 'atacado_qtde') || 0),
            "valor": Number(get(PRODUTO, 'atacado_preco') || 0),
          },
          "ativo": !!chkBool(get(PRODUTO, 'ativo')),
          "barcode": get(PRODUTO, 'barcode') ||'',
          "estoqueCritico": false, // chkBool(get(PRODUTO, 'ativo')),
          "departamento": {
            "ativo": !!chkBool(get(PRODUTO, 'departamento_ativo')),
            "id": get(PRODUTO, 'departamento_id') ||'',
            "nome": get(PRODUTO, 'departamento_nome') ||'',
          },
          // "limiteVenda": {
          //   "max": Number(get(PRODUTO, 'preco') || 0),
          //   "min": Number(get(PRODUTO, 'preco') || 0),
          // },
          "ncm": get(PRODUTO, 'ncm') ||'',
          "nome": get(PRODUTO, 'nome') ||'',
          "preco": Number(get(PRODUTO, 'preco') || 0),
          "subdepartamento": {
            "ativo": !!chkBool(get(PRODUTO, 'subdepartamento_ativo')),
            "id": get(PRODUTO, 'subdepartamento_id') ||'',
            "nome": get(PRODUTO, 'subdepartamento_nome') ||'',
          },
          "tipoUnidadeFracao": get(PRODUTO, 'tipo_unidade_fracao') ||'',
          "usaDepartamentoBase": !!chkBool(get(PRODUTO, 'usaDepartamentoBase')),
        };
        API.post(
          `/produtos/${PRODUTO_ID}`,
          PRODUTO_BODY
        );
        print.success(PRODUTO_BODY);
      } // for

      // LOGS = [];

      // print.info(TOKEN_LOJA);
      // print.info(API_URL);

      // const { ok, data } = await API.get(`/departamentos/${1}`);
    } catch (error) {
      print.error(error.message);
    } // try-catch

    //   console.log(produtos.length);
    //   // produtos = produtos.slice(0, 200);
    //   // console.log(produtos.length);

    //   const {
    //     departamentos: DEPARTAMENTOS,
    //     subdepartamentos: SUBDEPARTAMENTOS
    //   } = buscaDepartamentosSubdepartamentos(produtos);
    //   // console.log(DEPARTAMENTOS);

    //   log(`${DEPARTAMENTOS.length} departamento(s) encontrado(s).`);
    //   RESULTADO.departamentos.total = DEPARTAMENTOS.length || 0;
    //   RESULTADO.departamentos.sincronizados = await syncDepartamentos(
    //     apiUrl,
    //     idLoja,
    //     DEPARTAMENTOS,
    //     hasSome
    //   );

    //   // console.log(SUBDEPARTAMENTOS);
    //   log(`${SUBDEPARTAMENTOS.length} subdepartamento(s) encontrado(s).`);
    //   RESULTADO.subdepartamentos.total = SUBDEPARTAMENTOS.length || 0;
    //   RESULTADO.subdepartamentos.sincronizados = await syncSubdepartamentos(
    //     apiUrl,
    //     idLoja,
    //     SUBDEPARTAMENTOS,
    //     hasSome
    //   );

    //   RESULTADO.produtos.total = produtos.length;
    //   log(`${RESULTADO.produtos.total} produto(s) encontrado(s).`);
    //   // console.log(produtos);
    //   RESULTADO.produtos.sincronizados = await syncProdutos(
    //     apiUrl,
    //     idLoja,
    //     produtos,
    //     hasSome
    //   );

    //   return RESULTADO;

    // print.newline();
    // print.highlight(`Sincronizando ${PRODUTOS_BARCODES.length} produto(s) com barcodes.`);
    // print.highlight(`Sincronizando ${PRODUTOS_NBARCODES.length} produto(s) sem barcodes.`);
    // print.divider();

    // const LOGS: any[] = [];
    // for (const produto of PRODUTOS_NBARCODES) {
    //   print.success(`> ${JSON.stringify(produto)}`);
    //   print.divider();
    // } // for-of

    // print.table([...LOGS]/* , { format: 'lean' } */);

    // props
    // const {
    //   // projeto: PROJETO,
    //   // apiUrl: API_URL,
    //   loja: LOJA,
    //   conexao: TIPO_CONEXAO
    // } = props;


  };
}
