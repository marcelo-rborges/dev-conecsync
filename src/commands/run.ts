//#region gluegun
import { GluegunCommand } from 'gluegun';
//#endregion

const command: GluegunCommand = {
  name: 'run',
  description: 'Inicia processo de sincronização real.',
  run: async (toolbox) => {
    const {
      print,
      meta
    } = toolbox;

    print.success(`\n${meta.packageJSON().name} v${meta.version()} > run`);
    print.divider();
    toolbox.run();
  },
}

module.exports = command;
