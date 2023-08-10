export function tipoConexaoOrigem (tipoJson: any) {
    const { nomeView, arquivoCsv, schemaNosql } = tipoJson;
    if (nomeView) {
        return nomeView;
    } else if (arquivoCsv) {
        return 'csv';
    } else if (schemaNosql) {
        return 'mongo';
    } else {
        return '';
    };
}