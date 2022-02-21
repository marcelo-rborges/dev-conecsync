//#region gluegun
import { GluegunToolbox, print } from 'gluegun';
//#endregion

//#region 3rd
// import { get } from 'lodash';
//#endregion 

//#region models
const formasPgtoJson = require('../../config/origens/formas-pgto.json');
const configJson = require('../../config/config.json');
import { tipoConexaoOrigem } from '../libs'
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runOrigemFormasPgto = async (props: any) => {
    // const { print } = toolbox;

    // props
    const {
      dryRun: DRY_RUN,
      projeto: PROJETO,
      apiUrl: API_URL,
      loja: LOJA,
    } = props;

    // print.success(JSON.stringify(props));

    let { db: TIPO_CONEXAO } = configJson;
    // const { arquivoCsv: ARQUIVO_CSV } = formasPgtoJson;

    TIPO_CONEXAO = tipoConexaoOrigem(formasPgtoJson);

    print.highlight(TIPO_CONEXAO)

    switch (TIPO_CONEXAO) {
      case 'csv':
        toolbox.runOrigemFormasPgtoCsv(
          {
            dryRun: DRY_RUN,
            projeto: PROJETO,
            apiUrl: API_URL,
            loja: LOJA,
            conexao: TIPO_CONEXAO
          }
        );
        break;

      case 'mongodb':
        // toolbox.runOrigemProdutosMongoDB(
        //   {
        //     dryRun: DRY_RUN,
        //     projeto: PROJETO,
        //     apiUrl: API_URL,
        //     loja: LOJA,
        //     conexao: TIPO_CONEXAO
        //   }
        // );
        break;

      case 'firebird':
        // toolbox.runOrigemProdutosFirebird(
        //   {
        //     dryRun: DRY_RUN,
        //     projeto: PROJETO,
        //     apiUrl: API_URL,
        //     loja: LOJA,
        //     conexao: TIPO_CONEXAO
        //   }
        // );
        break;

      case 'mariadb':
      case 'mssql':
      case 'mysql':
      case 'postgres':
        // toolbox.runOrigemProdutosSequelize(
        //   {
        //     dryRun: DRY_RUN,
        //     projeto: PROJETO,
        //     apiUrl: API_URL,
        //     loja: LOJA,
        //     conexao: TIPO_CONEXAO
        //   }
        // );
        break;

      default:
        break;
    } // switch
  };
}
