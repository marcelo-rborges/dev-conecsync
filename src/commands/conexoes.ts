import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
  name: 'conexoes',
  description: 'Lista de conexões de banco de dados.',
  run: async (toolbox) => {
    toolbox.conexoes();
  },
};

module.exports = command;
