import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
  name: 'conecsync',
  description: 'help + diag (modo simulação).',
  run: async (toolbox) => {
    const { print } = toolbox;

    print.newline();
    print.printHelp(toolbox);
    print.newline();

    toolbox.run('--dry-run');
  },
}

module.exports = command;
