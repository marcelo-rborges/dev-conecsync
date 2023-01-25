//#region 3rd
const {
  DataTypes,
  // Model,
  // Sequelize
} = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');
//#endregion

//#region dbs
export const SUPPORTED_SQLS = ['firebird', 'mariadb', 'mssql', 'mysql', 'postgres'];
export const SUPPORTED_NOSQLS = ['mongodb'];
export const SUPPORTED_ALL = [...SUPPORTED_SQLS, ...SUPPORTED_NOSQLS];
//#endregion

//#region misc
export const DEBUG: boolean = false;
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
    sandbox: 'https://api.sandbox.mercadeiro.com.br', // 'https://api.sandbox.mercadeiro.com.br/v1'
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
    field: 'ID_PRODUTO',
    primaryKey: true
  },
  barcode: {
    type: DataTypes.STRING,
    field: 'BARCODE_PRODUTO'
  },
  preco: {
    type: DataTypes.DECIMAL,
    field: 'PRECO_VENDA'
  },
  departamento_id: {
    type: DataTypes.INTEGER,
    field: 'ID_DEPARTAMENTO'
  },
  departamento_nome: {
    type: DataTypes.STRING,
    field: 'NOME_DEPARTAMENTO'
  },
  departamento_ativo: {
    type: DataTypes.BOOLEAN,
    field: 'ATIVO_DEPARTAMENTO'
  },
  subdepartamento_id: {
    type: DataTypes.INTEGER,
    field: 'ID_SUBDEPARTAMENTO'
  },
  subdepartamento_nome: {
    type: DataTypes.STRING,
    field: 'NOME_SUBDEPARTAMENTO'
  },
  subdepartamento_ativo: {
    type: DataTypes.BOOLEAN,
    field: 'ATIVO_SUBDEPARTAMENTO'
  },
  ncm_produto: {
    type: DataTypes.STRING,
    field: 'NCM_PRODUTO'
  },
  nome: {
    type: DataTypes.STRING,
    field: 'NOME_PRODUTO'
  },
  estoque_controlado: {
    type: DataTypes.BOOLEAN,
    field: 'ESTOQUE_CONTROLADO'
  },
  qtde_estoque_minimo: {
    type: DataTypes.DECIMAL,
    field: 'QTDE_ESTOQUE_MINIMO'
  },
  qtde_estoque_atual: {
    type: DataTypes.DECIMAL,
    field: 'QTDE_ESTOQUE_ATUAL'
  },
  atacado_status: {
    type: DataTypes.BOOLEAN,
    field: 'ATACADO_STATUS'
  },
  atacado_qtde: {
    type: DataTypes.INTEGER,
    field: 'ATACADO_QTDE'
  },
  atacado_preco: {
    type: DataTypes.DECIMAL,
    field: 'ATACADO_PRECO'
  },
  tipo_unidade_fracao: {
    type: DataTypes.STRING,
    field: 'FRACIONADO_TIPO'
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    field: 'ATIVO_PRODUTO'
  },
  loja_id: {
    type: DataTypes.INTEGER,
    field: 'ID_LOJA'
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
