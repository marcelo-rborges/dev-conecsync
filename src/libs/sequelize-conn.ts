const { Sequelize } = require('sequelize');

const mssql = require('../../config/conexoes/mssql.json');
const mysql = require('../../config/conexoes/mysql.json');
const mariadb = require('../../config/conexoes/mariadb.json');
const postgresql = require('../../config/conexoes/postgresql.json');
const SEQUELIZE: any = {
  mssql,
  mysql,
  mariadb,
  postgresql
};

async function connect(db) {
  let sequelize = new Sequelize(
    SEQUELIZE[db].tabela,
    SEQUELIZE[db].usuario,
    SEQUELIZE[db].senha,
    {
      host: SEQUELIZE[db].host,
      dialect: db,
    }
  );

  try {
    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    const ERR: string = `${db.toUpperCase()} falha de conexão: ${error.message}`;
    // print.error(ERR);
    throw new Error(ERR);
  } // try-catch
}

module.exports = connect;