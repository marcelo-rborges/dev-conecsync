//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region 3rd
import { get } from 'lodash';
// import { fixBuffStr } from '../libs/buff2str';
// const { Op } = require('sequelize');
//#endregion 

//#region models
const configJson = require('../../config/config.json');
const produtosJson = require('../../config/origens/produtos.json');
// // const configJson = require('../../config/config.json');
// const firebirdJson = require('../../config/conexoes/firebird.json');
// const produtosJson = require('../../config/origens/produtos.json');
// const FIREBIRD = require('node-firebird');
// import { DEBUG } from '../models/consts';
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.runOrigemProdutosCsv = async (props: any) => {
    const { print } = toolbox;

    // props
    const {
      dryRun: DRY_RUN,
      projeto: PROJETO,
      apiUrl: API_URL,
      loja: LOJA,
      // conexao: TIPO_CONEXAO
    } = props;

    // print.info(`dryRun: ${DRY_RUN}`);
    // print.info(`projeto: ${PROJETO}`);
    // print.info(`apiUrl: ${API_URL}`);
    // print.info(`loja: ${JSON.stringify(LOJA)}`);
    // print.info(`conexao: ${TIPO_CONEXAO}`);

    try {
      const fs = require('fs');
      // const csv = require('csv-parser');
      const SEARCH_REG_EXP = /"/g;
      const csvFile = `${configJson.csvs}/${produtosJson.arquivoCsv}`;
      print.info('csvFile: ' + csvFile);
      const FIELD_CONTENTS: any = {};
      // const FORMAS_REQ_FIELDS = ['id_interno', 'id_externo', 'ativo'];
      // const FIELDPOS = {
      //   id_interno: -1,
      //   id_externo: -1,
      //   id_loja: -1,
      //   ativo: -1
      // };

      // const VALUE = 
      // fs.createReadStream()
      fs.readFile(csvFile, 'utf8', (err, data) => {
        if (err) throw err;

        let rows = data.trim().split('\n');
        rows.filter(r => r.trim() && r && r[0] !== '*');
        const LR: number = rows.length;
        let resultado = LR - 1;
        // print.info(rows);
        print.info(`${resultado} produto(s)`);

        const HEADER: string[] = rows[0].split(';');
        // print.info(`Header: ${HEADER}`);

        const LH: number = HEADER.length;
        for (let i = 0; i < LH; i++) {
          const FIELD: string = ((HEADER[i] || '').trim().replace(SEARCH_REG_EXP, '')).toUpperCase();
          // print.highlight('FIELD: ' + FIELD);
          if (!!FIELD) { FIELD_CONTENTS[FIELD] = i; }
        } // for
        // print.info(`FIELD_CONTENTS: ${JSON.stringify(FIELD_CONTENTS)}`);

        const PRODUTOS: any[] = [];
        const BADLINES: number[] = [];
        for (let i = 0; i < LR; i++) {
          const ROW: string[] = rows[i].split(';');
          if (!!i) { // Ignora header.
            if (ROW.length !== LH) {
              BADLINES.push(i);
            } else {
              // ROWS_OK.push(rows[i]);
              // print.warning(FIELD_CONTENTS['ID_LOJA']);
              // print.warning(ROW);
              // print.warning(ROW.at(FIELD_CONTENTS['ID_PRODUTO']));
              PRODUTOS.push(
                {
                  idLoja: FIELD_CONTENTS['ID_LOJA'] >= 0 && ROW.at(FIELD_CONTENTS['ID_LOJA']) || '',
                  idProduto: FIELD_CONTENTS['ID_PRODUTO'] >= 0 && ROW.at(FIELD_CONTENTS['ID_PRODUTO']) || '',
                  barcodeProduto: FIELD_CONTENTS['BARCODE_PRODUTO'] >= 0 && ROW.at(FIELD_CONTENTS['BARCODE_PRODUTO']) || '',
                  precoVenda: FIELD_CONTENTS['PRECO_VENDA'] >= 0 && ROW.at(FIELD_CONTENTS['PRECO_VENDA']) || '',
                  idDepartamento1: FIELD_CONTENTS['ID_DEPARTAMENTO1'] >= 0 && ROW.at(FIELD_CONTENTS['ID_DEPARTAMENTO1']) || '',
                  nomeDepartamento1: FIELD_CONTENTS['NOME_DEPARTAMENTO1'] >= 0 && ROW.at(FIELD_CONTENTS['NOME_DEPARTAMENTO1']) || '',
                  ativoDepartamento1: FIELD_CONTENTS['ATIVO_DEPARTAMENTO1'] >= 0 && ROW.at(FIELD_CONTENTS['ATIVO_DEPARTAMENTO1']) || '',
                  idDepartamento2: FIELD_CONTENTS['ID_DEPARTAMENTO2'] >= 0 && ROW.at(FIELD_CONTENTS['ID_DEPARTAMENTO2']) || '',
                  nomeDepartamento2: FIELD_CONTENTS['NOME_DEPARTAMENTO2'] >= 0 && ROW.at(FIELD_CONTENTS['NOME_DEPARTAMENTO2']) || '',
                  ativoDepartamento2: FIELD_CONTENTS['ATIVO_DEPARTAMENTO2'] >= 0 && ROW.at(FIELD_CONTENTS['ATIVO_DEPARTAMENTO2']) || '',
                  idDepartamento3: FIELD_CONTENTS['ID_DEPARTAMENTO3'] >= 0 && ROW.at(FIELD_CONTENTS['ID_DEPARTAMENTO3']) || '',
                  nomeDepartamento3: FIELD_CONTENTS['NOME_DEPARTAMENTO3'] >= 0 && ROW.at(FIELD_CONTENTS['NOME_DEPARTAMENTO3']) || '',
                  ativoDepartamento3: FIELD_CONTENTS['ATIVO_DEPARTAMENTO3'] >= 0 && ROW.at(FIELD_CONTENTS['ATIVO_DEPARTAMENTO3']) || '',
                  ncmProduto: FIELD_CONTENTS['NCM_PRODUTO'] >= 0 && (ROW.at(FIELD_CONTENTS['ID_LOJA']) || '').replace(/\D/g, ''),
                  nomeProduto: FIELD_CONTENTS['NOME_PRODUTO'] >= 0 && ROW.at(FIELD_CONTENTS['NOME_PRODUTO']) || '',
                  estoqueControlado: FIELD_CONTENTS['ESTOQUE_CONTROLADO'] >= 0 && ROW.at(FIELD_CONTENTS['ESTOQUE_CONTROLADO']) || '',
                  qtdeEstoqueMinimo: FIELD_CONTENTS['QTDE_ESTOQUE_MINIMO'] >= 0 && ROW.at(FIELD_CONTENTS['QTDE_ESTOQUE_MINIMO']) || '',
                  qtdeEstoqueAtual: FIELD_CONTENTS['QTDE_ESTOQUE_ATUAL'] >= 0 && ROW.at(FIELD_CONTENTS['QTDE_ESTOQUE_ATUAL']) || '',
                  atacadoStatus: FIELD_CONTENTS['ATACADO_STATUS'] >= 0 && ROW.at(FIELD_CONTENTS['ATACADO_STATUS']) || '',
                  atacadoPreco: FIELD_CONTENTS['ATACADO_PRECO'] >= 0 && ROW.at(FIELD_CONTENTS['ATACADO_PRECO']) || '',
                  atacadoQtde: FIELD_CONTENTS['ATACADO_QTDE'] >= 0 && ROW.at(FIELD_CONTENTS['ATACADO_QTDE']) || '',
                  fracionadoTipo: FIELD_CONTENTS['FRACIONADO_TIPO'] >= 0 && ROW.at(FIELD_CONTENTS['FRACIONADO_TIPO']) || '',
                  ativoProduto: FIELD_CONTENTS['ATIVO_PRODUTO'] >= 0 && ROW.at(FIELD_CONTENTS['ATIVO_PRODUTO']) || '',
                }
              );
            } // else
          } // if
        } // for

        if (!!BADLINES.length) {
          throw new Error(`Linhas inválidas encontradas: ${BADLINES.join(', ')}`);
        } // if
        // print.info(PRODUTOS);
        toolbox.runSyncProdutos(
          {
            dryRun: DRY_RUN,
            projeto: PROJETO,
            loja: LOJA,
            apiUrl: API_URL,
            produtos: PRODUTOS
          }
        ); 

        /* 

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
        */
      });
    } catch (error) {
      print.error(get(error, 'message'));
    }
  };
}
