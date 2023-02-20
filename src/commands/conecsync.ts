//#region gluegun
import { GluegunCommand } from 'gluegun';
//#endregion

const command: GluegunCommand = {
  name: 'conecsync',
  description: 'help + diag.',
  run: async (toolbox) => {
    const { print } = toolbox;

    print.newline();
    print.printHelp(toolbox);
    print.newline();

    toolbox.run('--diag');
  },
}

module.exports = command;
