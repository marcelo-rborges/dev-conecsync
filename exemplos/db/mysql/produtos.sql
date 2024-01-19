USE modelo_conecdata;

CREATE TABLE `produtos` (
  `pro_pk` int NOT NULL,
  `pro_fk_grupo` int DEFAULT NULL,
  `pro_fk_subgrupo` int NOT NULL,
  `pro_fk_unid_entrada` int DEFAULT '1',
  `pro_b_ativo` tinyint UNSIGNED DEFAULT '1',
  `pro_b_cardapio` tinyint UNSIGNED DEFAULT '1',
  `pro_b_estoque` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `pro_b_fracionado` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `pro_b_peso_balanca` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `pro_b_promocao` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `pro_b_taxa_serv` tinyint UNSIGNED NOT NULL DEFAULT '1',
  `pro_c_barcode` varchar(13) CHARACTER SET utf8 DEFAULT NULL,
  `pro_c_produto` varchar(60) CHARACTER SET utf8 DEFAULT NULL,
  `pro_c_produto_curto` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  `pro_dt_sync` datetime DEFAULT NULL,
  `pro_c_img` varchar(60) CHARACTER SET utf8 DEFAULT NULL,
  `pro_f_est_max` decimal(10,4) UNSIGNED NOT NULL DEFAULT '0.0000',
  `pro_f_est_min` decimal(10,4) UNSIGNED NOT NULL DEFAULT '0.0000',
  `pro_f_est_qtde_deposito` decimal(10,4) NOT NULL DEFAULT '0.0000',
  `pro_f_est_qtde_loja` decimal(10,4) NOT NULL DEFAULT '0.0000',
  `pro_f_preco_venda` decimal(10,4) UNSIGNED NOT NULL DEFAULT '0.0000',
  `pro_f_preco_venda_promo` decimal(10,4) UNSIGNED NOT NULL DEFAULT '0.0000',
  `pro_f_qtde_entrada` decimal(10,4) NOT NULL DEFAULT '1.0000',
  `pro_i_cod` int UNSIGNED DEFAULT NULL,
  `pro_f_preco_custo` decimal(12,4) UNSIGNED NOT NULL DEFAULT '0.0000',
  `pro_f_preco_custo_medio` decimal(12,4) UNSIGNED NOT NULL DEFAULT '0.0000',
  `pro_dt_amostragem` datetime DEFAULT NULL,
  `pro_fk_uni_entrada` int DEFAULT NULL,
  `pro_fk_uni_saida` int DEFAULT NULL,
  `pro_c_descricao` varchar(60) CHARACTER SET utf8 DEFAULT NULL,
  `pro_f_preco` decimal(10,2) NOT NULL DEFAULT '0.00',
  `pro_f_qtde_saida` decimal(10,2) DEFAULT '0.00',
  `pro_e_tipo_preco` varchar(5) CHARACTER SET utf8 DEFAULT NULL,
  `pro_b_favorito` tinyint NOT NULL DEFAULT '0',
  `pro_b_balanca` tinyint NOT NULL DEFAULT '0',
  `pro_f_qtde_estoque_deposito` decimal(10,2) NOT NULL DEFAULT '0.00',
  `pro_f_qtde_estoque_loja` decimal(10,2) NOT NULL DEFAULT '0.00',
  `pro_f_qtde_estoque_min` decimal(10,2) NOT NULL DEFAULT '0.00',
  `pro_b_atacado` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `pro_f_qtde_atacado` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00',
  `pro_f_valor_atacado` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00',
  `pro_f_perc_limite_venda` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00',
  `pro_f_qtde_limite_venda` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00',
  `pro_f_fracao` decimal(10,0) UNSIGNED DEFAULT '0',
  `pro_c_fracionado_tipo` varchar(3) DEFAULT NULL,
  `pro_b_online` tinyint UNSIGNED NOT NULL DEFAULT '1',
  `pro_b_destaque` tinyint UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `produtos` (`pro_pk`, `pro_fk_grupo`, `pro_fk_subgrupo`, `pro_fk_unid_entrada`, `pro_b_ativo`, `pro_b_cardapio`, `pro_b_estoque`, `pro_b_fracionado`, `pro_b_peso_balanca`, `pro_b_promocao`, `pro_b_taxa_serv`, `pro_c_barcode`, `pro_c_produto`, `pro_c_produto_curto`, `pro_dt_sync`, `pro_c_img`, `pro_f_est_max`, `pro_f_est_min`, `pro_f_est_qtde_deposito`, `pro_f_est_qtde_loja`, `pro_f_preco_venda`, `pro_f_preco_venda_promo`, `pro_f_qtde_entrada`, `pro_i_cod`, `pro_f_preco_custo`, `pro_f_preco_custo_medio`, `pro_dt_amostragem`, `pro_fk_uni_entrada`, `pro_fk_uni_saida`, `pro_c_descricao`, `pro_f_preco`, `pro_f_qtde_saida`, `pro_e_tipo_preco`, `pro_b_favorito`, `pro_b_balanca`, `pro_f_qtde_estoque_deposito`, `pro_f_qtde_estoque_loja`, `pro_f_qtde_estoque_min`, `pro_b_atacado`, `pro_f_qtde_atacado`, `pro_f_valor_atacado`, `pro_f_perc_limite_venda`, `pro_f_qtde_limite_venda`, `pro_f_fracao`, `pro_c_fracionado_tipo`, `pro_b_online`, `pro_b_destaque`) VALUES
(86, 7, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891000100103', 'LEITE CONDENSADO MOCA NESTLE LT 395G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.0000', '0.0000', '1.0000', 86, '0.0000', '0.0000', NULL, 1, 1, '', '6.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(406, 19, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891000528709', 'CALDO DE GALINHA MAGGI 63G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 406, '0.0000', '0.0000', NULL, 1, 1, '', '1.25', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(410, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7895800201503', 'TRIDENTE DE MORANGO C/5  8G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '2.0000', '0.0000', '1.0000', 410, '0.0000', '0.0000', NULL, 1, 1, '', '1.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(411, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7895800304211', 'TRIDENT DE HORTELA C/5  8G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 411, '0.0000', '0.0000', NULL, 1, 1, '', '1.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(412, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7895800430002', 'TRIDENT TUTTI-FRUTTI C/5  8G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 412, '0.0000', '0.0000', NULL, 1, 1, '', '1.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(413, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7895800304228', 'TRIDENTE DE MENTA C/5  8G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 413, '0.0000', '0.0000', NULL, 1, 1, '', '1.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(414, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7895800304235', 'TRIDENT CANELA C/5  8G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 414, '0.0000', '0.0000', NULL, 1, 1, '', '1.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(416, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7896020417149', 'THREE BOND 2G TRADICIONAL', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '12.0000', '0.0000', '1.0000', 416, '0.0000', '0.0000', NULL, 1, 1, '', '2.00', '1.00', '=', 0, 0, '0.00', '55.00', '20.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(429, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '78912366', 'CHOCOLATE BATON BRANCO 16G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 429, '0.0000', '0.0000', NULL, 1, 1, '', '1.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(430, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7895800304679', 'HALLS DE MORANGO C/10 34G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 430, '0.0000', '0.0000', NULL, 1, 1, '', '1.25', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(432, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7895800420003', 'HALLS DE UVA VERDE C/10 34G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 432, '0.0000', '0.0000', NULL, 1, 1, '', '1.25', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(433, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7895800303313', 'HALLS DE EXTRA FORTE C/10 34G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 433, '0.0000', '0.0000', NULL, 1, 1, '', '1.25', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(434, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7895800300145', 'HALLS DE CEREJA C/10  34G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 434, '0.0000', '0.0000', NULL, 1, 1, '', '1.25', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(435, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7895800300381', 'HALLS DE MENTA C/10 37G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 435, '0.0000', '0.0000', NULL, 1, 1, '', '1.25', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(436, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '78600027', 'TIC TAC LARANJA 16G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 436, '0.0000', '0.0000', NULL, 1, 1, '', '3.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(438, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891000462300', 'CHOCOLATE CHOKITO 32G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 438, '0.0000', '0.0000', NULL, 1, 1, '', '1.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(439, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891000460207', 'CHOCOLATE PRESTIGIO 33G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 439, '0.0000', '0.0000', NULL, 1, 1, '', '1.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(440, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '78912359', 'CHOCOLATE BATON AO LEITE  16G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 440, '0.0000', '0.0000', NULL, 1, 1, '', '1.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(564, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891000464908', 'CHOCOLATE CHARGE 40G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 564, '0.0000', '0.0000', NULL, 1, 1, '', '1.50', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(703, 8, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7896090122707', 'ESPONJA DE AÇO 60G ASSOLAN', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 703, '0.0000', '0.0000', NULL, 1, 1, '', '1.50', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(900, 8, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891022638004', 'DETERGENTE NEUTRO 500ML LIMPOL', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '12.3400', '0.0000', '1.0000', 900, '0.0000', '0.0000', NULL, 1, 1, '', '2.25', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(1004, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891132007486', 'VONO SOPA MILHO C/FRANGO 15G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '7.9800', '0.0000', '1.0000', 15257, '0.0000', '0.0000', NULL, 1, 1, '', '2.25', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(1061, 13, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7896417209173', 'MISTURA PARA BOLO  LIMAO VILMA 400G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 14907, '0.0000', '0.0000', NULL, 1, 1, '', '2.25', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(1065, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7894900010015', 'REFRIGERANTE COCA COLA LATA  350ML', '', NULL, '', '0.0000', '100.0000', '0.0000', '90.0000', '10.5000', '0.0000', '1.0000', 1004, '0.0000', '0.0000', NULL, 1, 1, '', '3.50', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(1083, 9, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891528038025', 'CREME DENTAL SORRISO DENTES BRANCOS 50G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 1022, '0.0000', '0.0000', NULL, 1, 1, '', '2.50', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(1085, 12, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891024134702', 'CREME DENTAL COLGATE MENTA REFRESCANTE 90G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 1024, '0.0000', '0.0000', NULL, 1, 1, '', '2.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(1091, 12, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7896090400041', 'SABONETE FRANCIS LUXO LAVANDA DE GRASSE 90G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 1030, '0.0000', '0.0000', NULL, 1, 1, '', '1.50', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(1121, 13, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7896021304974', 'MISTURA DE BOLO ECON. CHOCOLATE SANTA AMALIA 400G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 1060, '0.0000', '0.0000', NULL, 1, 1, '', '3.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(1243, 9, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7896061951343', 'LENCOS DE PAPEL KLEENEX 10 UND', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 1182, '0.0000', '0.0000', NULL, 1, 1, '', '1.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(1423, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7896007912124', 'FOSFORO FIAT LUX', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 1362, '0.0000', '0.0000', NULL, 1, 1, '', '3.50', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(1451, 8, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891022850031', 'ESPONJA DE AÇO Q LUSTRO', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 1390, '0.0000', '0.0000', NULL, 1, 1, '', '1.25', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(1757, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891962011295', 'TORRADA BAUDUCCO LIGHT 160G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 1696, '0.0000', '0.0000', NULL, 1, 1, '', '3.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(1761, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891000919705', 'BISCOITO  LEITE E MEL 200G NESFIT', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 1700, '0.0000', '0.0000', NULL, 1, 1, '', '3.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(1774, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7894900551051', 'DEL VALLE FRUT LIMAO 450ML', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 1713, '0.0000', '0.0000', NULL, 1, 1, '', '2.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(1775, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7894900556056', 'DEL VALLE FRUT CITRUS PUNCH 450ML', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 1714, '0.0000', '0.0000', NULL, 1, 1, '', '2.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(1776, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7894900550054', 'DEL VALLE FRUT UVA 450ML', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 1715, '0.0000', '0.0000', NULL, 1, 1, '', '2.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(2081, 9, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891024132005', 'COLGATE TRIPLA AÇÃO MENTA ORIGINAL 90G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 2008, '0.0000', '0.0000', NULL, 1, 1, '', '2.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(2086, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7896000554369', 'SUCO MAGUARY CONCENTRADO CAJU 500ML', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 2013, '0.0000', '0.0000', NULL, 1, 1, '', '3.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(2095, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7894900603705', 'KAPO ABACAXI 200ML', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 2022, '0.0000', '0.0000', NULL, 1, 1, '', '2.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(2105, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7894900552058', 'DEL VALLE FRUT TANGERINA 450 ML', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 2032, '0.0000', '0.0000', NULL, 1, 1, '', '2.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(2108, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7894900563702', 'KAPO LARANJA 200ML', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 2035, '0.0000', '0.0000', NULL, 1, 1, '', '2.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(2375, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '78917125', 'CHOCOLATE TALENTO DIET 25G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 2302, '0.0000', '0.0000', NULL, 1, 1, '', '3.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(2432, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '78913769', 'BOMBOM OURO BRANCO', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 2359, '0.0000', '0.0000', NULL, 1, 1, '', '1.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(2451, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7892300000698', 'CUSCUZ SINHÁ 500G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 2378, '0.0000', '0.0000', NULL, 1, 1, '', '1.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(2607, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7898288540027', 'TORRESMO SABOR DE MINAS FRITO 100G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 2534, '0.0000', '0.0000', NULL, 1, 1, '', '5.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(2785, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '78910942', 'GUARANA ANTARTICA CAÇULINHA 237ML', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 2712, '0.0000', '0.0000', NULL, 1, 1, '', '1.50', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(2954, 19, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7896025801196', 'MOLHO DE ALHO CEPERA 150ML', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 2881, '0.0000', '0.0000', NULL, 1, 1, '', '2.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(3253, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '78907485', 'CHOCOLATE TALENTO BRANCO 25G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 3174, '0.0000', '0.0000', NULL, 1, 1, '', '2.50', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(3254, 18, 0, 1, 1, 1, 1, 0, 0, 0, 1, '78907492', 'CHOCOLATE TALENTO  C/UVAS PASSAS 25G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 3175, '0.0000', '0.0000', NULL, 1, 1, '', '2.50', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(3333, 22, 2, 1, 1, 1, 1, 0, 0, 0, 1, '7891022637007', 'DETERGENTE LIMAO 500ML LIMPOL', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 3254, '0.0000', '0.0000', NULL, 1, 1, '', '1.50', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(3334, 22, 1, 1, 1, 1, 1, 0, 0, 0, 1, '7891022640007', 'DETERGENTE COCO 500ML LIMPOL', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 3255, '0.0000', '0.0000', NULL, 1, 1, '', '1.50', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(3336, 22, 1, 1, 1, 1, 1, 0, 0, 0, 1, '7891022639001', 'DETERGENTE MACA 500ML LIMPOL', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 3257, '0.0000', '0.0000', NULL, 1, 1, '', '1.50', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(3430, 13, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891079008010', 'CUP NOODLES DE CARNE NISSIN 64G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 3351, '0.0000', '0.0000', NULL, 1, 1, '', '3.50', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(3431, 13, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891079008034', 'CUP NOODLES GALINHA CAIPIRA 64G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 3352, '0.0000', '0.0000', NULL, 1, 1, '', '3.50', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(3435, 5, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7896102502213', 'EXTRATO DE TOMATE QUERO COPO 190G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 3356, '0.0000', '0.0000', NULL, 1, 1, '', '3.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(3438, 19, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891000528808', 'CALDO DE GALINHA MAGGI 126GR', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 3359, '0.0000', '0.0000', NULL, 1, 1, '', '2.25', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(3444, 19, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7896007811403', 'MOLHO INGLES KENKO 150ML', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 3365, '0.0000', '0.0000', NULL, 1, 1, '', '2.00', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(3471, 5, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7896292305793', 'MOLHO PARA CARNES MADEIRA SACHÊ 340G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 3392, '0.0000', '0.0000', NULL, 1, 1, '', '4.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(20151, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891000115633', 'RAÇÃO DE CARNE DOG 100G PURINA', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 265808, '0.0000', '0.0000', NULL, 1, 1, '', '2.25', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(20400, 4, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891000255445', 'CRUNCH CEREAL NESTLÉ 120G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 266057, '0.0000', '0.0000', NULL, 1, 1, '', '4.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(20953, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7891000115763', 'FRISKIES CARNE 85G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 266585, '0.0000', '0.0000', NULL, 1, 1, '', '2.25', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(21102, 9, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7500435134415', 'ESCOVA DENTAL ORAL B PRÓ', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 266730, '0.0000', '0.0000', NULL, 1, 1, '', '2.99', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(21386, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7622300999308', 'SUCO FRESH 10G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 267013, '0.0000', '0.0000', NULL, 1, 1, '', '0.69', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(21387, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7622300999506', 'SUCO FRESH TANGERINA  10G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 267014, '0.0000', '0.0000', NULL, 1, 1, '', '0.69', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(21388, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7622300999131', 'SUCO FRESH ABACAXI 10G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 267015, '0.0000', '0.0000', NULL, 1, 1, '', '0.69', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(21389, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7622300999544', 'SUCO FRESH UVA 10G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 267016, '0.0000', '0.0000', NULL, 1, 1, '', '0.69', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(21390, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7622300999469', 'SUCO FRESH MORANGO 10G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 267017, '0.0000', '0.0000', NULL, 1, 1, '', '0.69', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(21702, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7622300999261', 'SUCO FRESH GUARANA 10G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 267328, '0.0000', '0.0000', NULL, 1, 1, '', '0.69', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(21703, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7622300999223', 'SUCO FRESH CAJU 10G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 267329, '0.0000', '0.0000', NULL, 1, 1, '', '0.69', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(21954, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7622300999384', 'SUCO FRESH MANGA 10G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 267578, '0.0000', '0.0000', NULL, 1, 1, '', '0.75', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0),
(21955, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, '7622300999421', 'SUCO FRESH MARACUJA 10G', '', NULL, '', '0.0000', '0.0000', '0.0000', '0.0000', '10.5000', '0.0000', '1.0000', 267579, '0.0000', '0.0000', NULL, 1, 1, '', '0.69', '1.00', '=', 0, 0, '0.00', '0.00', '0.00', 0, '0.00', '0.00', '0.00', '0.00', '0', NULL, 1, 0);

ALTER TABLE `produtos` ADD PRIMARY KEY (`pro_pk`);

ALTER TABLE `produtos` MODIFY `pro_pk` int NOT NULL AUTO_INCREMENT;

DROP VIEW view_conecdata_produtos;

CREATE VIEW
  view_conecdata_produtos
AS SELECT
  pro_pk AS id_produto,
  pro_c_barcode AS barcode_produto,
  pro_f_preco_venda AS preco_venda,
  
  pro_fk_grupo AS id_departamento,
  gru_c_grupo AS nome_departamento,
  gru_b_ativo AS ativo_departamento,
  
  pro_fk_subgrupo AS id_subdepartamento,
  sub_c_subgrupo AS nome_subdepartamento,
  sub_b_ativo AS ativo_subdepartamento,
  
  pro_c_produto AS nome_produto,
  
  pro_b_estoque AS estoque_controlado,
  pro_f_qtde_estoque_min AS qtde_estoque_minimo,
  pro_f_qtde_estoque_loja AS qtde_estoque_atual,
  
  pro_b_atacado AS atacado_status,
  pro_f_qtde_atacado AS atacado_qtde,
  pro_f_valor_atacado AS atacado_preco,
  
  pro_f_perc_limite_venda AS percentual_limite_venda,
  pro_f_qtde_min_limite_venda AS qtde_min_limite_venda,
  pro_f_qtde_max_limite_venda AS qtde_max_limite_venda,

  pro_c_fracionado_tipo AS fracionado_tipo,
  
  pro_b_ativo AS ativo_produto,
    
  pro_c_descricao AS descricao_produto,
  
  1 AS id_loja
FROM
  produtos
LEFT JOIN
  grupos AS departamentos ON produtos.pro_fk_grupo = departamentos.gru_pk
LEFT JOIN
  subgrupos AS subdepartamentos ON produtos.pro_fk_subgrupo = subdepartamentos.sub_pk;

/*
CREATE VIEW
  view_conecdata_produtos
AS SELECT
  pro_pk AS id_produto,
  pro_c_barcode AS barcode_produto,
  pro_f_preco_venda AS preco_venda,
  
  pro_fk_grupo AS id_departamento,
  gru_c_grupo AS nome_departamento,
  gru_b_ativo AS ativo_departamento,
  
  pro_fk_subgrupo AS id_subdepartamento,
  sub_c_subgrupo AS nome_subdepartamento,
  sub_b_ativo AS ativo_subdepartamento,
  
  pro_c_produto AS nome_produto,
      
  pro_b_estoque AS estoque_controlado,
  pro_f_qtde_estoque_min AS qtde_estoque_minimo,
  pro_f_qtde_estoque_loja AS qtde_estoque_atual,
  
  pro_b_atacado AS atacado_status,
  pro_f_qtde_atacado AS atacado_qtde,
  pro_f_valor_atacado AS atacado_preco,
  
  pro_f_perc_limite_venda AS percentual_limite_venda,
  pro_f_qtde_limite_venda AS qtde_limite_venda,

  pro_b_fracionado AS fracionado_status,
  pro_f_fracao AS fracionado_fracao,
  pro_c_fracionado_tipo AS fracionado_tipo,
  0 AS fracionado_perc_desc_promo_auto,
  
  pro_b_ativo AS ativo_produto,
  
  pro_b_online AS online_produto,
  
  pro_c_descricao AS descricao_produto,

  pro_b_destaque AS destaque,
  
  1 AS online_departamento,
  
  1 AS id_loja
FROM
  produtos
LEFT JOIN
  grupos AS departamentos ON produtos.pro_fk_grupo = departamentos.gru_pk
LEFT JOIN
  subgrupos AS subdepartamentos ON produtos.pro_fk_subgrupo = subdepartamentos.sub_pk;
*/

/* CREATE VIEW
  view_conecdata_produtos
AS SELECT
  pro_pk AS id_produto,
  pro_c_barcode AS barcode_produto,
  pro_f_preco AS preco_venda,
  
  pro_fk_grupo AS id_departamento,
  pro_c_grupo AS nome_departamento,
  1 AS ativo_departamento,
  
  pro_fk_subgrupo AS id_subdepartamento,
  pro_c_subgrupo AS nome_subdepartamento,
  1 AS ativo_subdepartamento,
  
  pro_c_produto AS nome_produto,

  0 AS estoque_controlado,
  0 AS qtde_estoque_minimo,
  0 AS qtde_estoque_atual,
  
  0 AS atacado_status,
  0 AS atacado_qtde,
  0 AS atacado_preco,
  
  0 AS percentual_limite_venda,
  0 AS qtde_limite_venda,

  0 AS fracionado_status,
  0 AS fracionado_fracao,
  '' AS fracionado_tipo,
  0 AS fracionado_perc_desc_promo_auto,
  
  1 AS ativo_produto,
  
  null AS online_produto,
  
  '' AS descricao_produto,

  null AS destaque,
  
  1 AS online_departamento,
  
  1 AS id_loja
FROM
  produtos */


/*
CREATE VIEW
  view_conecdata_produtos
AS SELECT
  pro_pk AS id_produto,
  pro_c_barcode AS barcode_produto,
  pro_f_preco_venda AS preco_venda,
  
  pro_fk_grupo AS id_departamento,
  gru_c_grupo AS nome_departamento,
  gru_b_ativo AS ativo_departamento,
  
  pro_fk_subgrupo AS id_subdepartamento,
  sub_c_subgrupo AS nome_subdepartamento,
  sub_b_ativo AS ativo_subdepartamento,
  
  pro_c_produto AS nome_produto,
  
  pro_b_estoque AS estoque_controlado,
  pro_f_qtde_estoque_min AS qtde_estoque_minimo,
  pro_f_qtde_estoque_loja AS qtde_estoque_atual,
  
  0 AS atacado_status,
  0 AS atacado_qtde,
  0 AS atacado_preco,
  
  0 AS percentual_limite_venda,
  0 AS qtde_limite_venda_min,
  0 AS qtde_limite_venda_max,

  '' AS fracionado_tipo,
  
  pro_b_ativo AS ativo_produto,
    
  pro_c_descricao AS descricao_produto,
  
  1 AS id_loja
FROM
  produtos_ok as produtos
LEFT JOIN
  grupos AS departamentos ON produtos.pro_fk_grupo = departamentos.gru_pk
LEFT JOIN
  subgrupos AS subdepartamentos ON produtos.pro_fk_subgrupo = subdepartamentos.sub_pk
*/