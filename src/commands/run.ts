import { GluegunCommand } from 'gluegun';

import { get } from 'lodash';

import { API_URLS } from '../models/consts';

// const sequelizeConn = require('../libs')
const mercadeiro = require('../../config/destinos/mercadeiro.json');
const sequelizeConn = require('../libs/sequelize-conn');

import { TConexaoDb } from '../models/types';
const config = require('../../config/config.json');

const command: GluegunCommand = {
  name: 'run',
  description: 'Inicia processo de sincronização.',
  run: async (toolbox) => {
    const { print } = toolbox;


    const DB: TConexaoDb = get(config, 'db') || '';
    let sequelize;

    const SANDBOX: boolean = !!get(config, 'sandbox');
    print.warning(`> Modo sandbox ${SANDBOX ? 'habilitado' : 'DESABILITADO'}.`);

    // mercadeiro
    const API_URL: string = SANDBOX
      ? API_URLS.mercadeiro.sandbox
      : API_URLS.mercadeiro.producao;
    print.success(`> Mercadeiro API: ${API_URL} (${SANDBOX ? 'sandbox' : 'produção'}).`);

    const LOJAS: any[] = (get(mercadeiro, 'lojas') || [])
      .filter(l => get(l, 'id') && get(l, 'token'));
    print.success(`> Mercadeiro: ${LOJAS.length} loja(s).`);
    if (LOJAS.length) {

      for (const LOJA of LOJAS) {

        print.success(`> Lendo produtos: Loja ${LOJA.id}.`);

        if (DB) {
          print.warning(`> Banco de dados ${DB} indicado.`);
          switch (DB) {
            case 'mssql':
            case 'mariadb':
            case 'mysql':
            case 'postgresql':
              // Sequelize
              try {
                sequelize = await sequelizeConn(DB);
                print.success(`> ${DB.toUpperCase()} conectado com sucesso.`);
              } catch (err) {
                print.error(err);
              } finally {
                sequelize && sequelize.close();
              }// try-catch
              break;

            // case 'mongodb':
            // break;

            case 'firebird':
              break;
          } // switch






        } // if
      } // for

    } // if
  },
}

module.exports = command;
