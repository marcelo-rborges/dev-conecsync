DROP VIEW IF EXISTS view_conecsync_produtos;

CREATE VIEW view_conecsync_produtos AS
SELECT
  seu_id AS id,
  COALESCE (seu_barcode, "") AS barcode,
  seu_preco AS preco,
  seu_id_grupo AS departamento_id,
  COALESCE (seu_nome_grupo, "") AS departamento_nome,
  COALESCE (seu_ativo_grupo, "") AS departamento_ativo,
  seu_id_subgrupo AS subdepartamento_id,
  COALESCE (seu_nome_subgrupo, "") AS subdepartamento_nome,
  COALESCE (seu_ativo_subgrupo, "") AS subdepartamento_ativo,
  COALESCE (seu_nome, "") AS nome,
  sua_qtde_estoque_min AS estoque_minimo,
  sua_qtde_estoque_atual AS estoque_atual,
  seu_atacado_status AS atacado_status,
  sua_qtde_atacado AS atacado_qtde,
  seu_preco_atacado AS atacado_preco,
  COALESCE (seu_fracionado_tipo, "") AS tipo_unidade_fracao,
  seu_ativo AS ativo,
  seu_id_loja AS loja_id
FROM
  sua_tabela_produtos
  LEFT JOIN sua_tabela_grupos AS departamentos ON produtos.pro_fk_grupo = departamentos.gru_pk
  LEFT JOIN sua_tabela_subgrupos AS subdepartamentos ON produtos.pro_fk_subgrupo = subdepartamentos.sub_pk;
