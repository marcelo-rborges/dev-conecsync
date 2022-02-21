DROP VIEW IF EXISTS view_conecsync_produtos;

CREATE VIEW view_conecsync_produtos AS
SELECT
  COALESCE (seu_id, 0) AS id,
  COALESCE (seu_barcode, '') AS barcode,
  COALESCE (seu_preco, 0) AS preco,
  COALESCE (seu_id_grupo, 0) AS departamento_id,
  COALESCE (seu_nome_grupo, '') AS departamento_nome,
  COALESCE (seu_ativo_grupo, 1) AS departamento_ativo,
  COALESCE (seu_id_subgrupo, 0) AS subdepartamento_id,
  COALESCE (seu_nome_subgrupo, '') AS subdepartamento_nome,
  COALESCE (seu_ativo_subgrupo, 1) AS subdepartamento_ativo,
  COALESCE (seu_nome, '') AS nome,
  COALESCE (sua_qtde_estoque_min, 0) AS qtde_estoque_minimo,
  COALESCE (sua_qtde_estoque_atual, 0) AS qtde_estoque_atual,
  COALESCE (seu_atacado_status, 0) AS atacado_status,
  COALESCE (seu_valor_atacado, 0) AS atacado_preco,
  COALESCE (sua_qtde_atacado, 0) AS atacado_qtde,
  COALESCE (seu_fracionado_tipo, '') AS tipo_unidade_fracao,
  COALESCE (seu_ativo, 1) AS ativo,
  COALESCE (seu_id_loja, 0) AS loja_id
FROM
  sua_tabela_produtos
  LEFT JOIN sua_tabela_grupos AS departamentos ON produtos.pro_fk_grupo = departamentos.gru_pk
  LEFT JOIN sua_tabela_subgrupos AS subdepartamentos ON produtos.pro_fk_subgrupo = subdepartamentos.sub_pk;
