import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
  name: 'diag',
  description: 'Roda em modo simulação (executa sem gravações/acessos à api).',
  run: async (toolbox) => {
    const {
      print,
      meta
    } = toolbox;

    print.success(`\n${meta.packageJSON().name} v${meta.version()} > Diag`);
    print.divider();
    toolbox.run('--dry-run');
  },
}

module.exports = command;
