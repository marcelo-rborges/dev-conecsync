import { promises as fs } from 'fs';
import moment from 'moment';
import { CONFIG } from '../config/config';
import { get } from 'lodash';
import * as rp from 'request-promise';

export function toFloat(val: any): number {
  switch (typeof val) {
    case 'number':
      return val;
      break;

    case 'string':
      return parseFloat((val || '').replace(',', '.')) || 0;
      break;

    default:
      return 0;
      break;
  } // switch
}

export function log(msg: string) {
  const TS = moment().format('YYYY-MM-DD HH:mm:ss');
  msg = `${TS} ${msg}`;

  fs.writeFile('ok.log', `${msg}\n`, {
    flag: 'a'
  });
  CONFIG.verbose && console.log(' ' + msg);
}

export function errorLog(msg: string) {
  const TS = moment().format('YYYY-MM-DD HH:mm:ss');

  fs.writeFile('errors.log', `${TS} ${msg}\n`, {
    flag: 'a'
  });
  CONFIG.verbose && console.log('\x1b[31m', `${TS} ERRO: ${msg}`, '\x1b[0m');
}

export function errorLogApi(
  origem: string,
  ids: string[],
  retorno: string,
  msg: string
) {
  const TS = moment().format('YYYY-MM-DD HH:mm:ss');
  const ERRO: string = `${ids.join(',')} (${retorno}) ${JSON.stringify(msg)}\n`;
  fs.writeFile(
    `${origem}-api-errors.log`,
    `${TS} ${ERRO}`,
    { flag: 'a' }
  );
  CONFIG.verbose && console.log(
    // '\x1b[31m',
    '\x1b[128m',
    `${TS} ERRO: ${ERRO}`,
    '\x1b[0m'
  );
}

export function produtosHasSome(
  lojas: any[],
  apiUrl: string,
  idLoja: string
): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    // console.log('ID_LOJA:', ID_LOJA);
    let hasSome: boolean = true;
    if (
      (lojas || []).length
      && apiUrl
      && idLoja
    ) {
      let token: string = '';
      const L: any = (lojas || [])
        .find((l: any) => l.id.toString() === idLoja);
      if (L) {
        token = get(L, 'token') || '';
      } // if
      // console.log('api.some.token', token);

      if (token) {
        const URL: string = `${apiUrl}/produtos/some`;
        // console.log(URL);
        // console.log(body);
        try {
          const RESP: any = await rp.get(URL, {
            json: true,
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          // console.log('api.some.RESP', RESP);
          hasSome = !!get(RESP, 'some', true);
        } catch (error) {
          hasSome = true;
        } // try-catch
      } // if
    } // if

    return resolve(hasSome);
  });
}


export function chkBool(val: any): boolean | null {
  switch (typeof val) {
    case 'boolean':
      return !!val;
      break;

    case 'number':
      return val > 0;
      break;

    case 'string':
      return ['S', 'T', '1'].includes(val.trim().toUpperCase());
      break;

    default:
      return null;
      break;
  }
}

export function fixBuffStr(val: any): any {
  return typeof val === 'object'
    ? String.fromCharCode.apply(null, new Uint16Array(val))
    : val;
}
