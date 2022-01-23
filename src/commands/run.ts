import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'run',
  description: 'Inicia processo de sincronização.',
  run: async (toolbox) => {
    const { print } = toolbox

    print.info('Sync started')
  },
}

module.exports = command;
