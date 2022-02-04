import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
  name: 'conecsync',
  description: 'Diagnóstico e recomendações.',
  run: (toolbox) => {
    const {
      print,
      meta
    } = toolbox;

    print.success(`\n${meta.packageJSON().name} v${meta.version()}`);
    print.divider();

    // toolbox.diag();

    print.table(
      [
        ['conecsync -h', 'Lista completa de comandos.'],
        ['conecsync guia', 'Inicia guia interativo.'],
      ]
    );
    print.divider();
    // print.highlight(' > conecsync -h (para lista completa de comandos).');
    // print.highlight(' > conecsync guia (para guia interativo).');
    // print.divider();

    // toolbox.guia();
    // toolbox.command.run();
  },
}

module.exports = command;
