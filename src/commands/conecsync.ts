//#region gluegun
import { GluegunCommand } from 'gluegun';
//#endregion

const command: GluegunCommand = {
  name: 'conecsync',
  description: 'help + info.',
  run: async (toolbox) => {
    const { print } = toolbox;

    print.newline();
    print.printHelp(toolbox);
    print.newline();

    toolbox.run('--info');
  },
}

module.exports = command;
