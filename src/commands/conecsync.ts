import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
  name: 'conecsync',
  description: 'Diagnóstico geral.',
  run: (toolbox) => {
    const {
      print,
      meta
    } = toolbox;

    print.success(`\n${meta.packageJSON().name} v${meta.version()} > Passo a passo`);
    print.divider();

    toolbox.menu();
  },
}

module.exports = command;
