import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'destinos',
  description: 'Lista destinos.',
  run: async (toolbox) => {
    const { print } = toolbox

    print.info('Destinos')
  },
}

module.exports = command
