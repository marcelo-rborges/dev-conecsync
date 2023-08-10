import * as rp from 'request-promise';
import {
  errorLog,
  fixBuffStr,
  log
} from './lib';
import { CAMPOS_PRODUTOS_PROMOCOES } from '../consts';
import { CONFIG_PRODUTOS_PROMOCOES } from '../config/origens/config-produtos-promocoes';
import { CONFIG } from '../config/config';
import { get } from 'lodash';
var Firebird = require('node-firebird');

export async function buscaProdutosPromocoesDB(
  sequelize,
  idLoja: string
) {
  if (sequelize) {
    try {
      log('Buscando produtos do DB.');
      await sequelize.sync();

      const ProdutosPromocoes = sequelize.define('ProdutosPromocoes',
        CAMPOS_PRODUTOS_PROMOCOES,
        {
          timestamps: false,
          sequelize,
          modelName: 'ProdutosPromocoes',
          tableName: get(CONFIG_PRODUTOS_PROMOCOES, 'nomeView') || ''
        }
      );

      // console.log('findall');
      return ProdutosPromocoes.findAll(
        {
          where: {
            id_loja: +idLoja
          }
        }
      );
    } catch (error) {
      errorLog(error.message);
      return [];
    } // try-catch
  } else {
    return [];
  } // else
}

export async function buscaProdutosPromocoesFB(idLoja: string) {
  return new Promise((resolve, reject) => {
    if (Firebird) {
      try {
        Firebird.attach(
          CONFIG.fb.conexao,
          function (err, db) {
            if (err) throw err;
            // console.log(db);
            if (db) {
              const SQL: string = `
                SELECT 
                  * 
                FROM 
                  ${CONFIG_PRODUTOS_PROMOCOES.nomeView} 
                WHERE
                  id_loja = ${idLoja}
                `;
              // console.log(SQL);
              db.query(SQL,
                function (err, result) {
                  // IMPORTANT: close the connection
                  // console.log(result);
                  result.forEach((row) => {
                    row.ID_PRODUTO_PROMOCAO = fixBuffStr(row.ID_PRODUTO_PROMOCAO);
                    row.ID_PRODUTO_PROMOCAO_PRODUTO = fixBuffStr(row.ID_PRODUTO_PROMOCAO_PRODUTO);
                    row.ID_PRODUTO_PROMOCAO_PROMOCAO = fixBuffStr(row.ID_PRODUTO_PROMOCAO_PROMOCAO);
                    row.ID_LOJA = fixBuffStr(row.ID_LOJA);
                  });
                  db.detach();
                  resolve(result);
                  return;
                }
              );
            } // if
          });
      } catch (error) {
        errorLog(error.message);
        reject(error);
        return;
      } // try-catch
    } else {
      resolve([]);
      return;
    } // else
  });
}
