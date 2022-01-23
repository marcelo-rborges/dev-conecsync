import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
  name: 'origens',
  description: 'Lista origens.',
  run: async (toolbox) => {
    toolbox.origens();
  },
}

module.exports = command;
