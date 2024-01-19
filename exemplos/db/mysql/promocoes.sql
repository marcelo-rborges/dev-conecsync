USE modelo_conecdata;

CREATE TABLE `promocoes` (
  `prm_pk` int NOT NULL,
  `prm_c_descricao` varchar(60) CHARACTER SET utf8 DEFAULT NULL,
  `prm_c_tipo` varchar(3) CHARACTER SET utf8 DEFAULT NULL,
  `prm_f_qtde_apd` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00',
  `prm_f_limite_desc_apd` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00',
  `prm_f_perc_desc_apd` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00',
  `prm_f_qtde_leve_lp` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00',
  `prm_f_qtde_pague_lp` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00',
  `id_loja` int DEFAULT NULL,
  `promocao_ativa` tinyint NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `promocoes` (`prm_pk`, `prm_c_descricao`, `prm_c_tipo`, `prm_f_qtde_apd`, `prm_f_limite_desc_apd`, `prm_f_perc_desc_apd`, `prm_f_qtde_leve_lp`, `prm_f_qtde_pague_lp`, `id_loja`, `promocao_ativa`) VALUES
(1, 'Leite Condensado Leve 3, pague 2', 'LP', '0.00', '0.00', '0.00', '3.00', '2.00', NULL, 1),
(2, 'Leite moça 50% desc a partir 4', 'APD', '4.00', '1.00', '50.00', '0.00', '0.00', NULL, 1),
(3, 'Trident morango 10% off', 'APD', '1.00', '0.00', '10.00', '0.00', '0.00', NULL, 1);

ALTER TABLE `promocoes` ADD PRIMARY KEY (`prm_pk`);

ALTER TABLE `promocoes` MODIFY `prm_pk` int NOT NULL AUTO_INCREMENT;

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
  1 AS promocao_ativa from hypico.promocoes
FROM
  promocoes
WHERE
  fpg_c_id_forma_conecdata IS NOT NULL;
