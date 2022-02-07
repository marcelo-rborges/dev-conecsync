//#region 3rd
const {
  DataTypes,
  // Model,
  // Sequelize
} = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');
//#endregion

//#region dbs
export const SUPPORTED_SQLS = ['firebird', 'mariadb', 'mssql', 'mysql', 'postgresql'];
export const SUPPORTED_NOSQLS = ['mongodb'];
export const SUPPORTED_ALL = [...SUPPORTED_SQLS, ...SUPPORTED_NOSQLS];
//#endregion

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
//   // 'tipo_unidade_fracao', // STRING

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
    sandbox: 'https://us-central1-mercadeiro-896b2.cloudfunctions.net/v1', // 'https://api.sandbox.mercadeiro.com.br/v1'
    producao: 'https://us-central1-mercadeiro--prod.cloudfunctions.net/v1', // 'https://api.mercadeiro.com.br/v1'
  }
};

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
  loja_id: {
    type: DataTypes.INTEGER,
    field: 'loja_id'
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
  loja_id: {
    type: DataTypes.INTEGER,
    field: 'loja_id'
  }
};

// produtos
export const CAMPOS_PRODUTOS: any = {
  id: {
    type: DataTypes.INTEGER,
    field: 'id',
    primaryKey: true
  },
  barcode: {
    type: DataTypes.STRING,
    field: 'barcode'
  },
  preco: {
    type: DataTypes.DECIMAL,
    field: 'preco'
  },
  departamento_id: {
    type: DataTypes.INTEGER,
    field: 'departamento_id'
  },
  departamento_nome: {
    type: DataTypes.STRING,
    field: 'departamento_nome'
  },
  departamento_ativo: {
    type: DataTypes.BOOLEAN,
    field: 'departamento_ativo'
  },
  subdepartamento_id: {
    type: DataTypes.INTEGER,
    field: 'subdepartamento_id'
  },
  subdepartamento_nome: {
    type: DataTypes.STRING,
    field: 'subdepartamento_nome'
  },
  subdepartamento_ativo: {
    type: DataTypes.BOOLEAN,
    field: 'subdepartamento_ativo'
  },
  nome: {
    type: DataTypes.STRING,
    field: 'nome'
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
  tipo_unidade_fracao: {
    type: DataTypes.STRING,
    field: 'tipo_unidade_fracao'
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    field: 'ativo'
  },
  loja_id: {
    type: DataTypes.INTEGER,
    field: 'loja_id'
  }
};

// produtosPromocoes
export const CAMPOS_PRODUTOS_PROMOCOES: any = {
  id_produto_promocao: {
    type: DataTypes.INTEGER,
    field: 'id_produto_promocao',
    primaryKey: true
  },
  loja_id: {
    type: DataTypes.INTEGER,
    field: 'loja_id'
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
  loja_id: {
    type: DataTypes.INTEGER,
    field: 'loja_id'
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
