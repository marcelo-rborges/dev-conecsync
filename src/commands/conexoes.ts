//#region gluegun
import { GluegunCommand } from 'gluegun';
//#endregion

const command: GluegunCommand = {
  name: 'conexoes',
  description: 'Lista configurações de conexões com banco de dados.',
  run: async (toolbox) => {
    toolbox.conexoes();
  },
};

module.exports = command;
