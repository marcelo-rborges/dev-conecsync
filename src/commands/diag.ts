import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
  name: 'diag',
  description: 'Executa diagnóstico do sistema.',
  run: async (toolbox) => {
    const {
      print,
      meta
    } = toolbox;

    print.success(`\n${meta.packageJSON().name} v${meta.version()} > Diag`);
    print.divider();
    toolbox.diag();
  },
}

module.exports = command;
