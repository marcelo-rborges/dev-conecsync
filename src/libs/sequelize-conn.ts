//#region 3rd
const { Sequelize } = require('sequelize');
//#endregion

//#region models
const mssql = require('../../config/conexoes/mssql.json');
const mysql = require('../../config/conexoes/mysql.json');
const mariadb = require('../../config/conexoes/mariadb.json');
const postgres = require('../../config/conexoes/postgres.json');
const SEQUELIZE: any = {
  mssql,
  mysql,
  mariadb,
  postgres
};
//#endregion

export function connect(db): Promise<any> {
  return new Promise(
    async (resolve, reject) => {
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
        resolve(sequelize);
      } catch (error) {
        const ERR: string = `${db.toUpperCase()} falha de conexão: ${error.message}`;
        reject(ERR);
      } // try-catch
    });
}

// module.exports = connect;