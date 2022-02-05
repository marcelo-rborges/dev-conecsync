import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
  name: 'diag',
  description: 'run --dry-run (executa sem gravações/acessos à api).',
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
