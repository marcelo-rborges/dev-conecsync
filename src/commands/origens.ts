//#region gluegun
import { GluegunCommand } from 'gluegun';
//#endregion

const command: GluegunCommand = {
  name: 'origens',
  description: 'Lista configurações de origens de dados.',
  run: async (toolbox) => {
    const {
      print,
      meta
    } = toolbox;

    print.success(`\n${meta.packageJSON().name} v${meta.version()} > config > origens > *.json`);
    print.divider();

    toolbox.origens();
  },
}

module.exports = command;
