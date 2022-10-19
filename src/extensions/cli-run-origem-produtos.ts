//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region 3rd
// import { get } from 'lodash';
//#endregion 

//#region models
// const produtosJson = require('../../config/origens/produtos.json');
const configJson = require('../../config/config.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runOrigemProdutos = async (props: any) => {
    // const { print } = toolbox;

    // props
    const {
      dryRun: DRY_RUN,
      projeto: PROJETO,
      apiUrl: API_URL,
      loja: LOJA,
    } = props;

    // print.success(JSON.stringify(props));

    const { db: TIPO_CONEXAO } = configJson;

    // print.highlight(TIPO_CONEXAO)

    switch (TIPO_CONEXAO) {
      case 'csv':
        break;

      // case 'mongodb':
      //   toolbox.runOrigemProdutosMongoDB(
      //     {
      //       dryRun: DRY_RUN,
      //       projeto: PROJETO,
      //       apiUrl: API_URL,
      //       loja: LOJA,
      //       conexao: TIPO_CONEXAO
      //     }
      //   );
      //   break;

      case 'firebird':
        toolbox.runOrigemProdutosFirebird(
          {
            dryRun: DRY_RUN,
            projeto: PROJETO,
            apiUrl: API_URL,
            loja: LOJA,
            conexao: TIPO_CONEXAO
          }
        );
        break;

      // case 'mariadb':
      // case 'mssql':
      // case 'mysql':
      // case 'postgres':
      //   toolbox.runOrigemProdutosSequelize(
      //     {
      //       dryRun: DRY_RUN,
      //       projeto: PROJETO,
      //       apiUrl: API_URL,
      //       loja: LOJA,
      //       conexao: TIPO_CONEXAO
      //     }
      //   );
      //   break;

      default:
        break;
    } // switch
  };
}
