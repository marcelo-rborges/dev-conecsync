DROP VIEW IF EXISTS view_conecsync_produtos;

CREATE VIEW view_conecsync_produtos AS
SELECT
  seu_id AS id,
  COALESCE (seu_barcode, "") AS barcode,
  COALESCE (seu_preco, 0) AS preco,
  seu_id_grupo AS departamento_id,
  COALESCE (seu_nome_grupo, "") AS departamento_nome,
  seu_ativo_grupo AS departamento_ativo,
  seu_id_subgrupo AS subdepartamento_id,
  COALESCE (seu_nome_subgrupo, "") AS subdepartamento_nome,
  seu_ativo_subgrupo AS subdepartamento_ativo,
  COALESCE (seu_nome, "") AS nome,
  COALESCE (sua_qtde_estoque_min, 0) AS qtde_estoque_minimo,
  COALESCE (sua_qtde_estoque_atual, 0) AS qtde_estoque_atual,
  seu_atacado_status AS atacado_status,
  COALESCE (seu_valor_atacado, 0) AS atacado_preco,
  COALESCE (sua_qtde_atacado, 0) AS atacado_qtde,
  COALESCE (seu_fracionado_tipo, "") AS tipo_unidade_fracao,
  seu_ativo AS ativo,
  seu_id_loja AS loja_id
FROM
  sua_tabela_produtos
  LEFT JOIN sua_tabela_grupos AS departamentos ON produtos.pro_fk_grupo = departamentos.gru_pk
  LEFT JOIN sua_tabela_subgrupos AS subdepartamentos ON produtos.pro_fk_subgrupo = subdepartamentos.sub_pk;
