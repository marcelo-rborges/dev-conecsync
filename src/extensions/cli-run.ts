//#region gluegun
import { GluegunToolbox } from 'gluegun';
const os = require('os');
//#endregion

//#region 3rd
import { get } from 'lodash';
//#endregion 

//#region models
import {
  // API_URLS,
  SUPPORTED_SQLS,
  SUPPORTED_NOSQLS,
  SUPPORTED_ALL
} from '../models/consts';
const mercadeiro = require('../../config/destinos/mercadeiro.json');
// const sequelizeConn = require('../libs/sequelize-conn');
// import { TConexaoDb } from '../models/types';
const configJson = require('../../config/config.json');
// const estoqueJson = require('../../config/origens/estoque.json');
// const formasPgtoJson = require('../../config/origens/formas-pgto.json');
// const produtosPromocoesJson = require('../../config/origens/produtos-promocoes.json');
const produtosJson = require('../../config/origens/produtos.json');
// const promocoesJson = require('../../config/origens/promocoes.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.run = async (props: string) => {
    const {
      parameters,
      print
    } = toolbox;

    const origemOk = (origem: any, config: any): boolean => {
      if (!!origem) {
        const { nomeView, arquivoCsv, schemaNoSql } = origem;
        const { db, csvs } = config;
        if (SUPPORTED_SQLS.includes(db) && schemaNoSql === false) {
          return !!nomeView;
        } else if (SUPPORTED_NOSQLS.includes(db) && schemaNoSql === true) {
          return SUPPORTED_NOSQLS.includes(db);
        } else if (csvs !== '' && arquivoCsv !== '') {
          return true;
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
      (props || '').toLowerCase().trim().replace(/-/g, '') === 'dryrun'
      || parameters.options.dryRun
    );
    // print.info('DRY_RUN: ' + DRY_RUN);

    const INFO: boolean = !!(
      (props || '').toLowerCase().trim().replace(/-/g, '') === 'info'
      || parameters.options.info
    );
    // print.info('INFO: ' + INFO);

    // node version
    const nodeVersion = await toolbox.system.run('node -v', { trim: true });
    LOGS.push(['Node js', nodeVersion]);

    // info?
    LOGS.push(['Modo informativo', !!INFO ? 'HABILITADO' : 'desabilitado']);

    // dry run?
    !INFO && LOGS.push(['Modo simulação (test)', !!DRY_RUN ? 'HABILITADO' : 'desabilitado']);

    // "/config/config.json"
    const {
      db: CONFIG_DB,
      csvs: CONFIG_CSVS,
      sandbox: CONFIG_SANDBOX,
      onlineStatus: CONFIG_ONLINE_STATUS,
      usaNomesBase: CONFIG_USA_NOME_BASE,
      usaDepartamentosBase: CONFIG_USA_DEPARTAMENTOS_BASE,
    } = configJson;
    // const SANDBOX: boolean = !!get(config, 'sandbox');
    LOGS.push(['Conexão DB em uso', CONFIG_DB || '-']);
    LOGS.push(['Pasta CSVS', CONFIG_CSVS || '-']);
    LOGS.push(['onlineStatus', CONFIG_ONLINE_STATUS || '-']);
    LOGS.push(['usaNomesBase', CONFIG_USA_NOME_BASE ?? '-']);
    LOGS.push(['usaDepartamentosBase', CONFIG_USA_DEPARTAMENTOS_BASE ?? '-']);
    LOGS.push(['Pasta temporária', os.tmpdir()]);
    LOGS.push(['Modo sandbox', !!CONFIG_SANDBOX ? 'habilitado' : 'DESABILITADO']);

    // print.info('CONFIG_DB: ' + CONFIG_DB);
    // print.info('CONFIG_CSVS: ' + CONFIG_CSVS);
    if (!CONFIG_DB && !CONFIG_CSVS) {
      print.table([...LOGS], { format: 'lean' });
      print.divider();
      print.error('ERRO: Nenhuma fonte de origens de dados indicada.');
      print.success('SOLUÇÃO: Indique um tipo de conexão de banco de dados desejado (db:) ou uma pasta para arquivos .csv (csvs:) em "/config/config.json".');
      // print.info('conecsync config (exibe arquivo de configuração.');
      print.divider();
      toolbox.configuracao();
      print.divider();
      return;
    } // if

    if (!!CONFIG_DB && !SUPPORTED_ALL.includes(CONFIG_DB)) {
      print.table([...LOGS], { format: 'lean' });
      print.divider();
      print.error(`ERRO: Conexão "${CONFIG_DB}" é inválida ou não suportada.`);
      print.success('SOLUÇÃO: Indique um tipo VÁLIDO de conexão de banco de dados (db:) em "/config/config.json".');
      // print.info('conecsync config (exibe arquivo de configuração.');
      print.divider();
      toolbox.configuracao();
      print.divider();
      return;
    } // else

    // ORIGENS.estoque = origemOk(estoqueJson, configJson);
    // ORIGENS.formasPgto = origemOk(formasPgtoJson, configJson);
    // ORIGENS.produtosPromocoes = origemOk(produtosPromocoesJson, configJson);
    ORIGENS.produtos = origemOk(produtosJson, configJson);
    // ORIGENS.promocoes = origemOk(promocoesJson, configJson);

    // print.highlight(ORIGENS.estoque = origemOk(estoqueJson, configJson));
    // print.highlight(ORIGENS.formasPgto = origemOk(formasPgtoJson, configJson));
    // print.highlight(ORIGENS.produtosPromocoes = origemOk(produtosPromocoesJson, configJson));
    // print.highlight(ORIGENS.produtos = origemOk(produtosJson, configJson));
    // print.highlight(ORIGENS.promocoes = origemOk(promocoesJson, configJson));

    // print.warning('ORIGENS: ' + JSON.stringify(ORIGENS));

    if (
      !ORIGENS.produtos
      // && !ORIGENS.estoque
      // && !ORIGENS.formasPgto
      // && !ORIGENS.produtosPromocoes
      // && !ORIGENS.promocoes
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
    if (!!MERCADEIRO_LOJAS.length && !INFO) {
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
