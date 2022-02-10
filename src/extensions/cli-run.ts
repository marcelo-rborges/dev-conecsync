//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region 3rd
import { get } from 'lodash';
//#endregion 

//#region models
import {
  // API_URLS,
  SUPPORTED_SQLS,
  SUPPORTED_NOSQLS
} from '../models/consts';
const mercadeiro = require('../../config/destinos/mercadeiro.json');
// const sequelizeConn = require('../libs/sequelize-conn');
// import { TConexaoDb } from '../models/types';
const configJson = require('../../config/config.json');
const estoqueJson = require('../../config/origens/estoque.json');
const formasPgtoJson = require('../../config/origens/formas-pgto.json');
const produtosPromocoesJson = require('../../config/origens/produtos-promocoes.json');
const produtosJson = require('../../config/origens/produtos.json');
const promocoesJson = require('../../config/origens/promocoes.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.run = async (props: string) => {
    // toolbox.print.info('called foo extension');
    const {
      parameters,
      print
    } = toolbox;

    function origemOk(origem: any, config: any): boolean {
      if (origem) {
        const { nomeView } = origem;
        const { db } = config;
        if (SUPPORTED_SQLS.includes(db)) {
          // print.warning(db);
          // print.warning(!!nomeView);
          return !!nomeView;
        } else {
          return SUPPORTED_NOSQLS.includes(db);
        }// else
      } // else
      return false;
    }

    const LOGS: any[] = [];
    const ORIGENS: any = {
      estoque: false,
      formasPgto: false,
      produtosPromocoes: false,
      produtos: false,
      promocoes: false
    };

    // print.info(args);
    // print.info(parameters.options.dryRun);
    const DRY_RUN: boolean = !!(
      (props || '').toLowerCase().trim().replace(/-/g,'') === 'dryrun'
      || parameters.options.dryRun
    );
    // print.info(DRY_RUN);

    // const DB: TConexaoDb = get(config, 'db') || '';
    // let sequelize;

    // node version
    const nodeVersion = await toolbox.system.run('node -v', { trim: true });
    LOGS.push(['Node js', nodeVersion]);

    // dry run?
    LOGS.push(
      [
        'Modo diagnóstico (dry run)',
        DRY_RUN ? 'HABILITADO' : 'desabilitado'
      ]
    );

    // "/config/config.json"
    const {
      db: CONFIG_DB,
      csvs: CONFIG_CSVS,
      sandbox: CONFIG_SANDBOX,
      usaDepartamentosBase: CONFIG_USA_DEPARTAMENTOS_BASE,
      qtdeAutoDestaque: QTDE_AUTO_DESTAQUE
    } = configJson;
    // const SANDBOX: boolean = !!get(config, 'sandbox');
    LOGS.push(['Conexão DB', CONFIG_DB]);
    LOGS.push(['Pastas CSVS', CONFIG_CSVS]);
    LOGS.push(
      [
        'Usa departamentos base',
        CONFIG_USA_DEPARTAMENTOS_BASE ? 'HABILITADO' : 'desabilitado'
      ]
    );
    LOGS.push(
      [
        'Qtde auto destaque', String(QTDE_AUTO_DESTAQUE)
      ]
    );
    LOGS.push(
      [
        'Modo sandbox',
        CONFIG_SANDBOX ? 'habilitado' : 'DESABILITADO'
      ]
    );

    if (!CONFIG_DB && !CONFIG_CSVS) {
      print.table([...LOGS], { format: 'lean' });
      print.divider();
      print.error('ERRO: Nenhuma fonte de origens de dados indicada.');
      print.success('SOLUÇÃO: Indique um tipo de conexão de banco de dados desejado ou uma pasta para arquivos .csv em "/config/config.json".');
      // print.info('conecsync config (exibe arquivo de configuração.');
      print.divider();
      toolbox.configuracao();
      print.divider();
      return;
    } // if

    ORIGENS.estoque = origemOk(estoqueJson, configJson);
    ORIGENS.formasPgto = origemOk(formasPgtoJson, configJson);
    ORIGENS.produtosPromocoes = origemOk(produtosPromocoesJson, configJson);
    ORIGENS.produtos = origemOk(produtosJson, configJson);
    ORIGENS.promocoes = origemOk(promocoesJson, configJson);

    // print.warning(JSON.stringify(ORIGENS));

    if (
      !ORIGENS.estoque
      && !ORIGENS.formasPgto
      && !ORIGENS.produtosPromocoes
      && !ORIGENS.produtos
      && !ORIGENS.promocoes
    ) {
      print.table([...LOGS], { format: 'lean' });
      print.divider();
      print.error('ERRO: Nenhuma origem indicada.');
      print.success('SOLUÇÃO: Indique pelo menos uma origem de dados para sincronização em "/config/origens/*.json".');
      toolbox.origens();
      print.divider();
      return;
    } // if

    // destinos
    const MERCADEIRO_LOJAS: any[] = (get(mercadeiro, 'lojas') || [])
      .filter((l: any) => get(l, 'id') && get(l, 'token'));

    if (
      !MERCADEIRO_LOJAS.length
      /* && !OUTROPROJETO.LOJAS.length */
    ) {
      print.table([...LOGS], { format: 'lean' });
      print.divider();
      print.error('ERRO: Nenhuma loja destino indicada.');
      print.success('SOLUÇÃO: Indique as lojas (ids e tokens) nos projetos cujas apis deseja acessar em "/config/destinos/*.json".');
      print.divider();
      toolbox.destinos();
      return;
    } // if

    print.table([...LOGS], { format: 'lean' });
    // Mercadeiro
    if (MERCADEIRO_LOJAS.length) {
      toolbox.runProjeto(
        {
          dryRun: DRY_RUN,
          projeto: 'mercadeiro',
          lojas: MERCADEIRO_LOJAS,
          origens: Object.entries(ORIGENS)
            .filter((origem: any) => !!origem[1])
            .map((origem: any) => String(origem[0]))
        }
      );
    } // if

    // print.divider();
    // print.success('!!!! Diagnóstico concluído com sucesso !!!!');
    // print.divider();
    // print.info('Verifique as configurações e execute "conecsync run" para iniciar a sincronização real.');
    // print.divider();
    // print.newline();
  };
}
