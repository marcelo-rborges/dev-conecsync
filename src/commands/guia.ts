import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
  name: 'guia',
  description: 'Guia passo a passo do sistema.',
  run: async (toolbox) => {
    const {
      print,
      meta
    } = toolbox;

    print.success(`\n${meta.packageJSON().name} v${meta.version()} > Guia`);
    print.divider();
    toolbox.guia();
  },
}

module.exports = command;
