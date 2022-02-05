//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region models
const mercadeiroJson = require('../../config/destinos/mercadeiro.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.destinos = () => {
    const { print } = toolbox;

    print.table(
      [
        ['/config/destinos/*.json', 'Conteúdo'],
        ['Mercadeiro', JSON.stringify(mercadeiroJson)],
      ],
      // { format: 'lean' }
    );
    print.divider();
    print.warning('Propriedades:');
    print.divider();

    print.table(
      [
        ['id', 'Chave primária da loja desejada em seu cadastro.']
      ]
    );
    print.divider();

    print.table(
      [
        ['token', 'Token de loja para indicação da loja destino para sincronização nesse projeto.']
      ]
    );
    print.warning(
      '- Assegure-se que a configuração da propriedade sandbox em "/config/config.json" corresponda ao tipo desse token (desenvolvimento/produção) ou todos acessos à api serão recusados.'
    );
    print.divider();
  }
}
