// Origens de dados podem ser "views no DB" ou "paths de arquivos CSV"
export const CONFIG_PRODUTOS_PROMOCOES = {
  /* Tipo de origem */
  // Se '' ignora essa origem de dados (não sincroniza).
  tipo: '', // 'fb', 'db' | 'csv' | ''

  // Nome da view do cadastro de produtos de promoções
  nomeView: 'view_conecdata_produtos_promocoes', // db/fb
}

/* Mysql
  DROP VIEW IF EXISTS view_conecdata_produtos_promocoes;

  CREATE VIEW
    view_conecdata_produtos_promocoes
  AS SELECT
    pp_pk AS id_produto_promocao,
    pp_fk_promocao AS id_produto_promocao_promocao,
    pp_fk_produto AS id_produto_promocao_produto,
    1 as id_loja
  FROM
    produtos_promocoes
*/
