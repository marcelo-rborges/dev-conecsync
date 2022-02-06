//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region 3rd
import { get } from 'lodash';
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

    // const {
    //   produtos: PRODUTOS
    // } = props;

    const PRODUTOS_BARCODES: any[] = get(props, 'barcodes.PRODUTOS_BARCODES') || [];

    // try {
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
    // } catch (error) {
    //   return Promise.reject(error);
    // } // try-catch




    print.newline();
    print.highlight(`Sincronizando ${PRODUTOS_BARCODES.length} produto(s).`);
    print.divider();

    // const LOGS: any[] = [];
    for (const produto of PRODUTOS_BARCODES) {
      print.success(`> ${JSON.stringify(produto)}`);
      print.divider();
    } // for-of

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
