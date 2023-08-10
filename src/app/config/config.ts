export const CONFIG = {
  db: {
    conexao: {
      host: '127.0.0.1',
      tabela: 'hypico',
      usuario: 'root',
      senha: 'masterkey',
      tipo: 'mysql', /* 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
    }
  },
  fb: { // Firebird
    conexao: {
      host: '127.0.0.1',
      port: 3050,
      database: 'D:\\mercadeiro\\fb\\TGAalfredo.FDB',
      user: 'SYSDBA',
      password: 'masterkey',
      lowercase_keys: false,
      role: null,
      pageSize: 4096
    }
  },
  mongodb: {
    conexao: {
      host: 'mongodb://localhost:27017',
      database: 'conecdata',
      usuario: 'conecdata',
      senha: 'masterkey',
      tipo: 'mongodb',
    }
  },
  csv: {
    // path: 'd:\\conecsync-csvs' // '\/home\/conecdata\/csvs'
    path: '\/home\/dev01\/conecdata\/conecsync-csvs' // 'd:\\conecsync-csvs'
  },
  /* 
    TRUE = plataforma de testes
    FALSE = plataforma definitiva ( CUIDADO )
  */
  sandbox: false,
  /* 
    TRUE = Envia mensagens para terminal (se disponível)
    FALSE = Não envia mensagens, apenas grava no arquivo de log
  */
  verbose: true
}
