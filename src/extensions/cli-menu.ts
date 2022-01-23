import { GluegunToolbox } from 'gluegun';

// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: GluegunToolbox) => {
  toolbox.menu = async () => {
    const { print } = toolbox;

    // multiple choice
    const askStep = {
      type: 'select',
      name: 'step',
      message: 'Ajuda?',
      choices: [
        '1 - Verifique e configure as conexões com banco de dados (conecsync conexoes).',
        '2 - Verifique as origens de dados (conecsync origens).',
        '3 - Para DBs SQL: crie as views das origens de dados desejadas.',
        '4 - Para DBs NOSQL: Verifique e configure os arquivos das origens de dados desejadas.',
        '5 - Configure as origens de dados.',
        '6 - Verifique e configure as configurações gerais (conecsync config).',
        '7 - Verifique e configure o destino da sincronização (conecsync destino).',
        '8 - Inicie a sincronização (conecsync run).',
        '9 - Sair.',
      ],
    };

    const { step } = await toolbox.prompt.ask(askStep);
    const STEP: number = Number(step.substring(0, 1).trim());
    // print.success(`\n${STEP}`);
    switch (STEP) {
      case 1:
        toolbox.conexoes();
        toolbox.menu();
        break;

      case 2:
        toolbox.origens();
        toolbox.menu();
        break;

      default:
        print.highlight("\nAté mais e obrigado por usar o ConecSYNC.")
        break;
    } // switch
  };

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "conecsync" property),
  // conecsync.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig("conecsync", process.cwd())
  // }
}
