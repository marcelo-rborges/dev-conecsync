//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region 3rd
// import { get } from 'lodash';
//#endregion 

//#region models
import {
  API_URLS,
  //   SUPPORTED_SQLS,
  //   SUPPORTED_NOSQLS
} from '../models/consts';
// const mercadeiro = require('../../config/destinos/mercadeiro.json');
// const sequelizeConn = require('../libs/sequelize-conn');
// import { TConexaoDb } from '../models/types';
const configJson = require('../../config/config.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runProjeto = async (props: any) => {
    // toolbox.print.info('called foo extension');
    const { print } = toolbox;

    const LOGS: any[] = [];

    // props
    const {
      dryRun: DRY_RUN,
      projeto: PROJETO,
      lojas: LOJAS,
      origens: ORIGENS
    } = props;

    // print.success(JSON.stringify(props));

    // "/config/config.json"
    const { sandbox: CONFIG_SANDBOX } = configJson;

    // apis
    const API_URL: string = CONFIG_SANDBOX
      ? API_URLS[PROJETO].sandbox
      : API_URLS[PROJETO].producao;
    print.newline();
    print.table(
      [
        [PROJETO, `${LOJAS.length} loja(s) encontrada(s).`],
        ['API URL', API_URL]
      ],
      { format: 'lean' }
    );
    // print.warning(API_URL);

    for (const LOJA of LOJAS) {
      print.newline();
      for (const ORIGEM of ORIGENS) {
        print.highlight(`> Loja ${LOJA.id} - origem ${ORIGEM.toUpperCase()}`);

        switch (ORIGEM) {
          case 'produtos':
            toolbox.runOrigemProdutos(
              {
                dryRun: DRY_RUN,
                projeto: PROJETO,
                apiUrl: API_URL,
                loja: LOJA,
                origem: ORIGEM
              }
            );
            break;
          
          case 'formasPgto':
            toolbox.runOrigemFormasPgto(
              {
                dryRun: DRY_RUN,
                projeto: PROJETO,
                apiUrl: API_URL,
                loja: LOJA,
                origem: ORIGEM
              }
            );
            break;

          default:
            break;
        } // switch        
      } // for
    } // for
    print.table([...LOGS], { format: 'lean' });
  };
}
