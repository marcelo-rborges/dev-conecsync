//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region models
const configJson = require('../../config/config.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.configuracao = () => {
    // toolbox.print.info('called foo extension');
    const {
      print
    } = toolbox;

    print.table(
      [
        ['/config/config.json', JSON.stringify(configJson)],
      ]
    );
    print.divider();

    // print.highlight('db: Tipo de conexão com banco de dados.');
    // print.info("Opções: '' | 'firebird' | 'mariadb' | 'mongodb' | 'mssql' | 'postgressql'");
    // print.divider();
    print.warning('Propriedades:');
    print.divider();

    print.table(
      [
        ['db (opcional)', 'Seleção de tipo de conexão com banco de dados.'],
      ]
    );
    print.highlight("  Opções disponíveis: '' | 'firebird' | 'mariadb' | 'mssql' | 'mysql' | 'postgres'.");
    print.divider();

    print.table(
      [
        ['csvs (opcional)', 'Seleção de pasta para leitura de arquivos csv.'],
      ]
    );
    print.highlight('  Ex: "c:\/csvs" (windows), "\/c\/origens\/csvs" (linux/mac), ...".');
    print.divider();

    print.table(
      [
        ['sandbox (obrigatório)', 'Seleciona api de modo desenvolvimento ou produção.']
      ]
    );
    print.highlight(
      '   true: Modo desenvolvimento ou sandbox, apenas para testes de integração, sincronizam em lojas que não atendem de fato os pedidos.'
    );
    print.highlight(
      '  false: Modo produção, sincroniza com lojas reais da plataforma.'
    );
    print.warning('- Essa selecão deve corresponder aos tipos de tokens de loja indicados (desenvolvimento/produção) em "/config/destinos/*.json" ou suas chamadas à api serão recusadas.');
    print.divider();

    print.table(
      [
        // ['statusOnline (opcional)', 'Força flag online true/false para TODOS produtos.']
        ['statusOnline', 'Força flag online true/false para TODOS produtos.']
      ]
    );
    print.highlight(
      '              on*: Todos os produtos com online TRUE.'
    );
    print.highlight(
      '             off*: Todos os produtos com online FALSE.'
    );
    print.highlight(
      '  auto (default)*: Online de produtos com barcode TRUE e sem barcode FALSE.'
    );
    print.highlight(
      '           fauto : Aplica "auto" mesmo que loja da plataforma já tenha produtos.'
    );
    print.warning('* Essa configuração só é aplicada quando o cadastro de produtos na loja na plataforma estiver vazio, ou seja na primeira carga de produtos realizada.');
    print.divider();
    
    print.table(
      [
        ['usaNomesBase', 'Força uso do nome no cadastro (ignora base).']
      ]
    );
    print.warning('- Aplicado apenas a produtos com código de barras válido.');
    print.divider();
    
    print.table(
      [
        ['usaDepartamentosBase', 'Força uso de departamentos no cadastro (ignora base).']
      ]
    );
    print.warning('- Aplicado apenas a produtos com código de barras válido.');
  }
}
