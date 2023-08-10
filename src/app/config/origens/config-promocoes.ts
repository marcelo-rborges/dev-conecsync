// Origens de dados podem ser "views no DB" ou "paths de arquivos CSV"
export const CONFIG_PROMOCOES = {
  /* Tipo de origem */
  // Se '' ignora essa origem de dados (não sincroniza).
  tipo: '', // 'fb', 'db' | 'csv' | ''

  // Nome da view do cadastro de promoções
  nomeView: 'view_conecdata_promocoes', // db/fb
}

/* Mysql
  DROP VIEW IF EXISTS view_conecdata_promocoes;

  CREATE VIEW
    view_conecdata_promocoes
  AS SELECT
    prm_pk AS id_promocao,
    prm_c_descricao AS descricao,
    prm_c_tipo AS tipo,
    prm_f_qtde_apd AS qtde_apd,
    prm_f_limite_desc_apd AS lim_desc_apd,
    prm_f_perc_desc_apd AS perc_desc_apd,
    prm_f_qtde_leve_lp AS qtde_leve_lp,
    prm_f_qtde_pague_lp AS qtde_pague_lp,
    1 AS id_loja,
    1 AS promocao_ativa
  FROM
    promocoes
*/
