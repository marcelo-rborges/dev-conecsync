CREATE VIEW
    view_mercadeiro_produtos
  AS SELECT
    pro_pk AS id,
    pro_c_barcode AS barcode,
    pro_f_preco AS preco,

    pro_fk_grupo AS departamento_id,
    gru_c_grupo AS departamento_nome,
    gru_b_ativo AS departamento_ativo,

    pro_fk_subgrupo AS subdepartamento_id,
    sub_c_subgrupo AS subdepartamento_nome,
    sub_b_ativo AS subdepartamento_ativo,

    pro_c_produto AS nome,

    pro_f_qtde_estoque_min AS estoque_minimo,
    pro_f_qtde_estoque_loja AS estoque_atual,

    pro_b_atacado AS atacado_status,
    pro_f_qtde_atacado AS atacado_qtde,
    pro_f_valor_atacado AS atacado_valor,

    pro_c_fracionado_tipo AS tipo_unidade_fracao,

    pro_b_ativo AS ativo,

    1 AS loja_id
  FROM
    produtos
  LEFT JOIN
    grupos AS departamentos ON produtos.pro_fk_grupo = departamentos.gru_pk
  LEFT JOIN
    subgrupos AS subdepartamentos ON produtos.pro_fk_subgrupo = subdepartamentos.sub_pk