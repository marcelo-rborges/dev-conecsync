//#region gluegun
import { GluegunCommand } from 'gluegun'
//#endregion

const command: GluegunCommand = {
  name: 'destinos',
  description: 'Lista destinos das sicronizações.',
  run: async (toolbox) => {
    const {
      print,
      meta
    } = toolbox;

    print.success(`\n${meta.packageJSON().name} v${meta.version()} > config > destinos > *.json`);
    print.divider();

    toolbox.destinos();
  },
}

module.exports = command;
