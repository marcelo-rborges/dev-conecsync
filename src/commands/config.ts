//#region gluegun
import { GluegunCommand } from 'gluegun';
//#endregion

const command: GluegunCommand = {
  name: 'config',
  description: 'Configurações gerais.',
  run: async (toolbox) => {
    const {
      print,
      meta
    } = toolbox;

    print.success(`\n${meta.packageJSON().name} v${meta.version()} > Config`);
    print.divider();
    toolbox.configuracao();
    print.divider();
  },
}

module.exports = command;
