//#region gluegun
import { GluegunCommand } from 'gluegun';
//#endregion

const command: GluegunCommand = {
  name: 'guia',
  description: 'Guia interativo de utilização.',
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
