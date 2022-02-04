const { DataTypes } = require('sequelize');

// CSVs
// export const PRODUTOS_REQ_FIELDS: string[] = [
//   'id_produto', // INTEGER

//   'id_departamento', // INTEGER
//   'nome_departamento', // STRING
//   // 'ativo_departamento', // BOOLEAN
//   // 'online_departamento', // BOOLEAN

//   'nome_produto', // STRING
//   'barcode_produto', // STRING
//   'preco_venda', // FLOAT
//   // 'ativo_produto', // BOOLEAN
//   // 'descricao_produto', // STRING
//   // 'online_produto', // BOOLEAN
//   // 'destaque_produto', // BOOLEAN

//   // 'id_subdepartamento', // INTEGER
//   // 'nome_subdepartamento', // STRING
//   // 'ativo_subdepartamento', // BOOLEAN

//   // 'atacado_status', // BOOLEAN
//   // 'atacado_qtde', // INTEGER
//   // 'atacado_preco', // INTEGER/FLOAT

//   // 'percentual_limite_venda', // INTEGER/FLOAT
//   // 'qtde_limite_venda', // INTEGER/FLOAT

//   // 'fracionado_status', // BOOLEAN
//   // 'fracionado_fracao', // FLOAT
//   // 'fracionado_perc_desc_promo_auto', // FLOAT
//   // 'fracionado_tipo', // STRING

//   // 'estoque_controlado', // BOOLEAN
//   // 'qtde_estoque_atual', // INTEGER/FLOAT
//   // 'qtde_estoque_minimo', // INTEGER/FLOAT
// ];

// export const FORMAS_REQ_FIELDS: string[] = [
//   'id_interno', // INTEGER
//   'forma_ativa', // BOOLEAN
//   // 'nome_forma', // STRING
//   'id_externo', // STRING
// ];

// export const ESTOQUE_REQ_FIELDS: string[] = [
//   'id_produto', // STRING
//   'barcode_produto', // STRING
//   'nome_produto', // STRING
//   'qtde_estoque_atual', // INTEGER/FLOAT
//   'qtde_estoque_minimo', // INTEGER/FLOAT
// ];

// Apis
export const API_URLS = {
  mercadeiro: {
    sandbox: 'https://us-central1-mercadeiro-896b2.cloudfunctions.net/v1',
    producao: 'https://us-central1-mercadeiro--prod.cloudfunctions.net/v1', // 'https://api.mercadeiro.com.br/v1'
  }
}

// MODELS

// estoque
export const CAMPOS_ESTOQUE: any = {
  id_produto: {
    type: DataTypes.INTEGER,
    field: 'id_produto',
    primaryKey: true
  },
  estoque_controlado: {
    type: DataTypes.BOOLEAN,
    field: 'estoque_controlado'
  },
  barcode_produto: {
    type: DataTypes.STRING,
    field: 'barcode_produto'
  },
  nome_produto: {
    type: DataTypes.STRING,
    field: 'nome_produto'
  },
  id_loja: {
    type: DataTypes.INTEGER,
    field: 'id_loja'
  },
  qtde_estoque_minimo: {
    type: DataTypes.DECIMAL,
    field: 'qtde_estoque_minimo'
  },
  qtde_estoque_atual: {
    type: DataTypes.DECIMAL,
    field: 'qtde_estoque_atual'
  },
};

// formas pgto
export const CAMPOS_FORMAS: any = {
  id_interno: {
    type: DataTypes.INTEGER,
    field: 'id_interno',
    primaryKey: true
  },
  id_externo: {
    type: DataTypes.STRING,
    field: 'id_externo'
  },
  nome_forma: {
    type: DataTypes.STRING,
    field: 'nome_forma'
  },
  id_loja: {
    type: DataTypes.INTEGER,
    field: 'id_loja'
  }
};

// produtos
export const CAMPOS_PRODUTOS: any = {
  id_produto: {
    type: DataTypes.INTEGER,
    field: 'id_produto',
    primaryKey: true
  },
  barcode_produto: {
    type: DataTypes.STRING,
    field: 'barcode_produto'
  },
  preco_venda: {
    type: DataTypes.DECIMAL,
    field: 'preco_venda'
  },
  id_departamento: {
    type: DataTypes.INTEGER,
    field: 'id_departamento'
  },
  nome_departamento: {
    type: DataTypes.STRING,
    field: 'nome_departamento'
  },
  ativo_departamento: {
    type: DataTypes.BOOLEAN,
    field: 'ativo_departamento'
  },
  id_subdepartamento: {
    type: DataTypes.INTEGER,
    field: 'id_subdepartamento'
  },
  nome_subdepartamento: {
    type: DataTypes.STRING,
    field: 'nome_subdepartamento'
  },
  ativo_subdepartamento: {
    type: DataTypes.BOOLEAN,
    field: 'ativo_subdepartamento'
  },
  nome_produto: {
    type: DataTypes.STRING,
    field: 'nome_produto'
  },
  estoque_controlado: {
    type: DataTypes.BOOLEAN,
    field: 'estoque_controlado'
  },
  qtde_estoque_minimo: {
    type: DataTypes.DECIMAL,
    field: 'qtde_estoque_minimo'
  },
  qtde_estoque_atual: {
    type: DataTypes.DECIMAL,
    field: 'qtde_estoque_atual'
  },
  atacado_status: {
    type: DataTypes.BOOLEAN,
    field: 'atacado_status'
  },
  atacado_qtde: {
    type: DataTypes.INTEGER,
    field: 'atacado_qtde'
  },
  atacado_preco: {
    type: DataTypes.DECIMAL,
    field: 'atacado_preco'
  },
  percentual_limite_venda: {
    type: DataTypes.DECIMAL,
    field: 'percentual_limite_venda'
  },
  qtde_limite_venda_max: {
    type: DataTypes.DECIMAL,
    field: 'qtde_limite_venda_max'
  },
  qtde_limite_venda_min: {
    type: DataTypes.DECIMAL,
    field: 'qtde_limite_venda_min'
  },
  fracionado_tipo: {
    type: DataTypes.STRING,
    field: 'fracionado_tipo'
  },
  ativo_produto: {
    type: DataTypes.BOOLEAN,
    field: 'ativo_produto'
  },
  descricao_produto: {
    type: DataTypes.STRING,
    field: 'descricao_produto'
  },
  id_loja: {
    type: DataTypes.INTEGER,
    field: 'id_loja'
  },
  // online_produto: {
  //   type: DataTypes.BOOLEAN,
  //   field: 'online_produto'
  // },
  // industrializado: {
  //   type: DataTypes.BOOLEAN,
  //   field: 'industrializado'
  // },
  // fracionado_status: {
  //   type: DataTypes.BOOLEAN,
  //   field: 'fracionado_status'
  // },
  // fracionado_fracao: {
  //   type: DataTypes.DECIMAL,
  //   field: 'fracionado_fracao'
  // },
  // fracionado_perc_desc_promo_auto: {
  //   type: DataTypes.DECIMAL,
  //   field: 'fracionado_perc_desc_promo_auto'
  // },
  // destaque: {
  //   type: DataTypes.BOOLEAN,
  //   field: 'destaque'
  // },
  // online_departamento: {
  //   type: DataTypes.BOOLEAN,
  //   field: 'online_departamento'
  // },
};

// produtosPromocoes
export const CAMPOS_PRODUTOS_PROMOCOES: any = {
  id_produto_promocao: {
    type: DataTypes.INTEGER,
    field: 'id_produto_promocao',
    primaryKey: true
  },
  id_loja: {
    type: DataTypes.INTEGER,
    field: 'id_loja'
  },
  id_produto_promocao_promocao: {
    type: DataTypes.INTEGER,
    field: 'id_produto_promocao_promocao'
  },
  id_produto_promocao_produto: {
    type: DataTypes.INTEGER,
    field: 'id_produto_promocao_produto'
  },
};

// promocoes
export const CAMPOS_PROMOCOES: any = {
  id_promocao: {
    type: DataTypes.INTEGER,
    field: 'id_promocao',
    primaryKey: true
  },
  id_loja: {
    type: DataTypes.INTEGER,
    field: 'id_loja'
  },
  promocao_ativa: {
    type: DataTypes.BOOLEAN,
    field: 'promocao_ativa'
  },
  descricao: {
    type: DataTypes.STRING,
    field: 'descricao'
  },
  tipo: {
    type: DataTypes.STRING,
    field: 'tipo'
  },
  qtde_apd: {
    type: DataTypes.DECIMAL,
    field: 'qtde_apd'
  },
  lim_desc_apd: {
    type: DataTypes.DECIMAL,
    field: 'lim_desc_apd'
  },
  perc_desc_apd: {
    type: DataTypes.DECIMAL,
    field: 'perc_desc_apd'
  },
  qtde_leve_lp: {
    type: DataTypes.DECIMAL,
    field: 'qtde_leve_lp'
  },
  qtde_pague_lp: {
    type: DataTypes.DECIMAL,
    field: 'qtde_pague_lp'
  },
};

// destaques
export const AUTO_DESTAQUES = {};
