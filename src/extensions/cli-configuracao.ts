//#region gluegun
import { GluegunToolbox } from 'gluegun';
//#endregion

//#region models
const config = require('../../config/config.json');
//#endregion

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.configuracao = () => {
    // toolbox.print.info('called foo extension');
    const {
      print
    } = toolbox;

    print.table(
      [
        ['/config/config.json', JSON.stringify(config)],
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
    print.highlight("  Opções disponíveis: '' | 'firebird' | 'mariadb' | 'mongodb' | 'mssql' | 'mysql' | 'postgres'.");
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
      '  TRUE: Modo desenvolvimento ou sandbox, apenas para testes de integração, sincronizam em lojas que não funcionam realmente.'
    );print.highlight(
      '  FALSE: Modo produção, sincroniza com lojas reais da plataforma.'
    );
    print.warning('- Essa selecão deve corresponder aos tipos de tokens de loja indicados (desenvolvimento/produção) em "/config/destinos/*.json" ou todas chamadas à api serão recusadas.')
    print.divider();

    print.table(
      [
        ['usaDepartamentosBase (obrigatório)', 'Aplicada apenas à origem "produtos".']
      ]
    );
    print.highlight(
      '  TRUE: usa departamentos/subdepartamentos da base de dados.'
    );print.highlight(
      '  FALSE: usa departamentos/subdepartamendos do cadastro da loja.'
    );
    print.warning('- Disponível apenas em modo desenvolvimento, em modo produção será sempre buscada a configuração indicada na loja.');
    print.warning('- Apenas produtos industrializados (com barcode) podem ter seus departamentos/subdepartamentos buscados na base de dados, para produtos sem barcode, os da própria loja sempre serão utilizados.')
  }
}
