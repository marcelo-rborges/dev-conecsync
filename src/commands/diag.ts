//#region gluegun
import { GluegunCommand } from 'gluegun';
//#endregion

const command: GluegunCommand = {
  name: 'test',
  description: 'Roda em modo simulação (executa sem gravações/acessos à api).',
  run: async (toolbox) => {
    const {
      print,
      meta
    } = toolbox;

    print.success(`\n${meta.packageJSON().name} v${meta.version()} > Test`);
    print.divider();
    toolbox.run('--dry-run');
  },
}

module.exports = command;
