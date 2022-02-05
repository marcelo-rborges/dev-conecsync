//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region 3rd
import { get } from 'lodash';
//#endregion 

//#region models
import {
  API_URLS,
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
  toolbox.run = async (args: string) => {
    // toolbox.print.info('called foo extension');
    const {
      parameters,
      print
    } = toolbox;

    function origemOk(origem: any): boolean {
      if (origem) {
        const { tipoConexao, nomeView } = origem;
        if (SUPPORTED_SQLS.includes(tipoConexao)) {
          return !!nomeView;
        } else {
          return SUPPORTED_NOSQLS.includes(tipoConexao);
        }// else
      } // else
      return false;
    }

    const LOGS: any[] = [];
    const ORIGENS: any = {
      estoque: false,
      // formasPgto: false,
      // produtosPromocoes: false,
      // produtos: false,
      // promocoes: false
    };

    // print.info(args);
    // print.info(parameters.options.dryRun);
    const DRY_RUN: boolean = !!(
      (args || '').toLowerCase() === '--dry-run'
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
      usaDepartamentosBase: CONFIG_USA_DEPARTAMENTOS_BASE
    } = configJson;
    // const SANDBOX: boolean = !!get(config, 'sandbox');
    LOGS.push(
      [
        'Usa departamentos base',
        CONFIG_USA_DEPARTAMENTOS_BASE ? 'HABILITADO' : 'desabilitado'
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

    // origens
    // const {
    //   tipoConexao: ESTOQUE_TIPO_CONEXAO,
    //   nomeView: ESTOQUE_NOME_VIEW
    // } = estoqueJson;

    // const {
    //   tipoConexao: FORMAS_PGTO_TIPO_CONEXAO,
    //   noveView: FORMAS_PGTO_NOME_VIEW
    // } = formasPgtoJson;

    // const {
    //   tipoConexao: PRODUTOS_PROMOCOES_TIPO_CONEXAO,
    //   noveView: PRODUTOS_PROMOCOES_NOME_VIEW
    // } = produtosPromocoesJson;

    // const {
    //   tipoConexao: PRODUTOS_TIPO_CONEXAO,
    //   noveView: PRODUTOS_NOME_VIEW
    // } = produtosJson;

    // const {
    //   tipoConexao: PROMOCOES_TIPO_CONEXAO,
    //   noveView: PROMOCOES_NOME_VIEW
    // } = promocoesJson;

    ORIGENS.estoque = origemOk(estoqueJson);
    ORIGENS.formasPgto = origemOk(formasPgtoJson);
    ORIGENS.produtosPromocoes = origemOk(produtosPromocoesJson);
    ORIGENS.produtos = origemOk(produtosJson);
    ORIGENS.promocoes = origemOk(promocoesJson);

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

    // Mercadeiro
    const API_URL: string = CONFIG_SANDBOX
      ? API_URLS.mercadeiro.sandbox
      : API_URLS.mercadeiro.producao;
    LOGS.push(
      [
        'Mercadeiro',
        `${MERCADEIRO_LOJAS.length} loja(s) encontrada(s).`
      ]
    );
    if (MERCADEIRO_LOJAS.length) {
      // LOGS.push(
      //   [
      //     'API Mercadeiro',
      //     `${API_URL} (${CONFIG_SANDBOX ? 'sandbox' : 'produção'})`
      //   ]
      // );
      print.warning(API_URL);











      print.table([...LOGS], { format: 'lean' });

      // if (CONFIG_DB) {

      // for (const LOJA of LOJAS) {

      //   print.warning(`> Lendo produtos: Loja ${LOJA.id}.`);

      //   if (DB) {
      //     print.warning(`> Tipo de conexão indicada: ${DB}.`);
      //     switch (DB) {
      //       case 'mssql':
      //       case 'mariadb':
      //       case 'mysql':
      //       case 'postgresql':
      //         // Sequelize
      //         try {
      //           sequelize = await sequelizeConn(DB);
      //           print.success(`> Conectando ${DB.toUpperCase()}: OK.`);
      //         } catch (err) {
      //           print.error(err);
      //         } finally {
      //           sequelize && sequelize.close();
      //         }// try-catch
      //         break;

      //       // case 'mongodb':
      //       // break;

      //       case 'firebird':
      //         break;
      //     } // switch
      //   } // if
      // } // for



    } // if

    print.divider();
    print.success('!!!! Diagnóstico concluído com sucesso !!!!');
    print.divider();
    print.info('Verifique as configurações e execute "conecsync run" para iniciar a sincronização real.');
    print.divider();
    print.newline();
  };
}
