USE modelo_conecdata;

CREATE TABLE `produtos_promocoes` (
  `pp_pk` int NOT NULL,
  `pp_fk_promocao` int NOT NULL,
  `pp_fk_produto` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `produtos_promocoes` (`pp_pk`, `pp_fk_promocao`, `pp_fk_produto`) VALUES
(1, 1, 86),
(2, 2, 86),
(5, 3, 410);

ALTER TABLE `produtos_promocoes` ADD PRIMARY KEY (`pp_pk`);

ALTER TABLE `produtos_promocoes` MODIFY `pp_pk` int NOT NULL AUTO_INCREMENT;

DROP VIEW IF EXISTS view_conecdata_produtos_promocoes;

CREATE VIEW
  view_conecdata_produtos_promocoes
AS SELECT
  pp_pk AS id_produto_promocao,
  pp_fk_promocao AS id_produto_promocao_promocao,
  pp_fk_produto AS id_produto_promocao_produto,
  1 AS id_loja
FROM
  produtos_promocoes
WHERE
  fpg_c_id_forma_conecdata IS NOT NULL;
