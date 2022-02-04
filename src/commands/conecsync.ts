import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
  name: 'conecsync',
  description: 'Diagnóstico e recomendações.',
  run: (toolbox) => {
    const {
      print,
      meta
    } = toolbox;

    print.success(`\n${meta.packageJSON().name} v${meta.version()} > Passo a passo`);
    print.divider();

    toolbox.diag();

    print.divider();
    print.highlight(' > conecsync -h (para lista completa de comandos).');
    print.highlight(' > conecsync guia (para guia interativo).');

    // toolbox.guia();
    // toolbox.command.run();
  },
}

module.exports = command;
