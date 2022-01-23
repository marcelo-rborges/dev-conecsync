import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
  name: 'config',
  description: 'Configurações diversas.',
  run: async (toolbox) => {
    const { print } = toolbox;

    print.info('Config started');
  },
}

module.exports = command;
