//#region 3rd
import {
  get,
  uniqBy,
} from 'lodash';
//#endregion

export function buscaDeptosSubs(produtos: any[]): {
  departamentos: any[];
  subdepartamentos: any[];
} {
  const RETORNO = {
    departamentos: [],
    subdepartamentos: []
  };

  if (produtos.length) {
    const DEPTOS: any[] = produtos
      .map((p: any) => (
        {
          departamento_id: get(p, 'departamento_id'),
          departamento_nome: get(p, 'departamento_nome'),
          departamento_ativo: get(p, 'departamento_ativo')
        }
      ));

    const SUBS: any[] = produtos
      .filter((p: any) => !!(get(p, 'subdepartamento_id') || 0))
      .map((p: any) => {
        // console.log(p);
        return {
          departamento_id: get(p, 'departamento_id'),
          subdepartamento_id: get(p, 'subdepartamento_id'),
          subdepartamento_nome: get(p, 'subdepartamento_nome'),
          subdepartamento_ativo: get(p, 'subdepartamento_ativo')
        }
      }
      );

    RETORNO.departamentos = (uniqBy(DEPTOS, 'departamento_id') || [])
      .filter((v: any) => !!get(v, 'departamento_id'));
    RETORNO.subdepartamentos = uniqBy(SUBS, 'subdepartamento_id')
      .filter((v: any) => !!get(v, 'subdepartamento_id'));
  } // if

  return RETORNO;
}