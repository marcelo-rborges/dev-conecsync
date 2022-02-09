DROP VIEW view_conecsync_produtos;

CREATE VIEW view_conecsync_produtos (
  id,
  barcode,
  preco,
  departamento_id,
  departamento_nome,
  departamento_ativo,
  subdepartamento_id,
  subdepartamento_nome,
  subdepartamento_ativo,
  nome,
  estoque_controlado,
  qtde_estoque_minimo,
  qtde_estoque_atual,
  atacado_status,
  atacado_preco,
  atacado_qtde,
  tipo_unidade_fracao,
  ativo,
  loja_id
) AS
SELECT
  COALESCE(seu_id, 0),
  COALESCE (seu_barcode, ''),
  COALESCE (seu_preco, 0),
  COALESCE(seu_id_grupo, 0),
  COALESCE (seu_nome_grupo, ''),
  COALESCE(seu_ativo_grupo, 1),
  COALESCE(seu_id_subgrupo, 1),
  COALESCE (seu_nome_subgrupo, ''),
  COALESCE(seu_ativo_subgrupo, 1),
  COALESCE (seu_nome, ''),
  COALESCE (sua_qtde_estoque_min, 0),
  COALESCE (sua_qtde_estoque_atual, 0),
  COALESCE(seu_atacado_status, 0),
  COALESCE (seu_valor_atacado, 0),
  COALESCE (sua_qtde_atacado, 0),
  COALESCE (seu_fracionado_tipo, ''),
  COALESCE(seu_ativo, 1),
  COALESCE(seu_id_loja, 0)
FROM
  sua_tabela_produtos
  LEFT JOIN sua_tabela_grupos AS departamentos ON produtos.pro_fk_grupo = departamentos.gru_pk
  LEFT JOIN sua_tabela_subgrupos AS subdepartamentos ON produtos.pro_fk_subgrupo = subdepartamentos.sub_pk;
