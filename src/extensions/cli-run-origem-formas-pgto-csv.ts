//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region 3rd
import { get } from 'lodash';
// const { Op } = require('sequelize');
//#endregion 

// //#region models
// const sequelizeConn = require('../libs/sequelize-conn');
import { chkBool } from '../libs';
const configJson = require('../../config/config.json');
const formasPgtoJson = require('../../config/origens/formas-pgto.json');
// const produtosJson = require('../../config/origens/produtos.json');
// const mariadbJson = require('../../config/conexoes/mariadb.json');
// const mysqlJson = require('../../config/conexoes/mysql.json');
// const mssqlJson = require('../../config/conexoes/mssql.json');
// const postgresqlJson = require('../../config/conexoes/postgresql.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runOrigemFormasPgtoCsv = async (props: any) => {
    const { print } = toolbox;

    // const LOGS: any[] = [];

    // props
    const {
        dryRun: DRY_RUN,
        projeto: PROJETO,
        apiUrl: API_URL,
        loja: LOJA,
      // conexao: TIPO_CONEXAO
    } = props;

    try {

      const fs = require('fs');
      // const csv = require('csv-parser');
      const SEARCH_REG_EXP = /"/g;
      const csvFile = `${configJson.csvs}/${formasPgtoJson.arquivoCsv}`;
      const FORMAS_REQ_FIELDS = ['id_interno', 'id_externo', 'ativo'];
      const FIELDPOS = {
        id_interno: -1,
        id_externo: -1,
        id_loja: -1,
        ativo: -1
      }

      // const VALUE = 
      // fs.createReadStream()
      fs.readFile(csvFile, 'utf8', (err, data) => {
        if (err) throw err;

        let rows = data.trim().split('\n');
        rows.filter(r => r.trim() && r && r[0] !== '*');
        const LR: number = rows.length;
        // let resultado = LR - 1;
        // print.info(rows);
        // print.info(`${resultado} forma(s) de pagamento`);

        const HEADER: string[] = rows[0].split(';');
        // print.info(`Header: ${HEADER}`);

        let req: string[] = FORMAS_REQ_FIELDS;
        // print.info(req);

        const LH: number = HEADER.length;
        for (let i = 0; i < LH; i++) {
          const FIELD: string = HEADER[i].trim().replace(SEARCH_REG_EXP, '');
          // print.highlight(FIELD);
          req = req.filter(v => {
            return v.trim().toLowerCase().replace(SEARCH_REG_EXP, '') === FIELD.toLowerCase();
          });
          if (FIELD) {
            FIELDPOS[FIELD] = i;
          } // if
        } // for
        // print.warning(FIELDPOS);

        if (req.length) {
          throw new Error(`Campos obrigatórios não indicados: ${req.join(', ')}`);
        } // if

        const BADLINES: number[] = [];
        for (let i = 0; i < LR; i++) {
          const ROW: string[] = rows[i].split(';');
          if (ROW.length !== LH) {
            BADLINES.push(i);
          } // if
        } // for

        if (BADLINES.length) {
          throw new Error(`Linhas inválidas encontradas: ${BADLINES.join(', ')}`);
        }

        const FORMAS = [];
        for (let i = 0; i < LR; i++) {
          if (i) {
            const ROW: string[] = rows[i]
              .replace(SEARCH_REG_EXP, '')
              .replace("\r", '')
              .split(';')
              .map((r: string) => r.toLowerCase() === 'null' ? '' : r.trim());
            const FORMA = {
              'id_interno': FIELDPOS['id_interno'] >= 0
                ? `${ROW[FIELDPOS['id_interno']].trim()}`
                : '',

              'id_externo': FIELDPOS['id_externo'] >= 0
                ? `${ROW[FIELDPOS['id_externo']].trim()}`
                : '',

              'id_loja': FIELDPOS['id_loja'] >= 0
                ? `${ROW[FIELDPOS['id_loja']].trim()}`
                : '',

              'ativo': FIELDPOS['ativo'] >= 0
                ? chkBool(ROW[FIELDPOS['ativo']] || '')
                : true
            };
            FORMAS.push(FORMA);
          } // if
        } // for
        print.info(FORMAS)
        toolbox.runSyncFormasPgto(
          {
            dryRun: DRY_RUN,
            projeto: PROJETO,
            loja: LOJA,
            apiUrl: API_URL,
            formasPgto: JSON.stringify(FORMAS)
          }
        );
      });
    } catch (error) {
      print.error(get(error, 'message'));
    } // try-catch
  };
}
