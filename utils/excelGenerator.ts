import * as XLSX from 'xlsx';
import { ExtractionResult } from '../types';

export const generateExcelReport = (results: ExtractionResult[]) => {
  // Filter only successful results
  const validResults = results.filter((r) => r.status === 'success' && r.data);

  if (validResults.length === 0) return;

  // Flatten the data into the requested structure
  const rows = validResults.map((item) => {
    const d = item.data!;
    
    // We construct a row object where keys correspond to the user's specific "Lines"
    // Prefixes (A:, B:, C:) help group them in the spreadsheet header, though they will be separate columns.
    return {
      "Arquivo": item.fileName,
      
      // COLUNA A: ITEM 1: COMPRADOR
      "A - NOME": d.comprador?.nome || '',
      "A - NOME REGISTRO CIVIL": d.comprador?.nomeRegistroCivil || '',
      "A - FILIAÇÃO MÃE": d.comprador?.filiacaoMae || '',
      "A - NACIONALIDADE": d.comprador?.nacionalidade || '',
      "A - REGIME CASAMENTO": d.comprador?.regimeCasamento || '',
      "A - R.G. N.": d.comprador?.rg || '',
      "A - ENDEREÇO": d.comprador?.endereco || '',
      "A - MUNICIPIO": d.comprador?.municipio || '',
      "A - DATA NASCIMENTO": d.comprador?.dataNascimento || '',
      "A - ESTADO CIVIL": d.comprador?.estadoCivil || '',
      "A - DATA DE CASAMENTO": d.comprador?.dataCasamento || '',
      "A - PROFISSÃO": d.comprador?.profissao || '',

      // COLUNA A: ITEM 1: CÔNJUGE (Mixed into Col A group as requested by flow)
      "A - CÔNJUGE": d.conjuge?.nome || 'N/A',
      "A - CÔNJUGE REGISTRO CIVIL": d.conjuge?.nomeRegistroCivil || '',
      "A - CÔNJUGE NACIONALIDADE": d.conjuge?.nacionalidade || '',
      "A - CÔNJUGE R.G.": d.conjuge?.rg || '',
      "A - CÔNJUGE DATA NASC.": d.conjuge?.dataNascimento || '',
      "A - CÔNJUGE EST. CIVIL": d.conjuge?.estadoCivil || '',
      "A - CÔNJUGE PROFISSÃO": d.conjuge?.profissao || '',

      // COLUNA B: ITEM 2: RENDA
      "B - RENDA INDIVIDUAL": d.renda?.rendaIndividual || '',
      "B - RENDA FAMILIAR": d.renda?.rendaFamiliar || '',

      // COLUNA C: ITEM 7.1: IMÓVEL
      "C - TIPO DA UNIDADE": d.imovel?.tipoUnidade || '',
      "C - FRAÇÃO IDEAL": d.imovel?.fracaoIdeal || '',
      "C - VAL. AVAL. FRAÇÃO TERRENO": d.imovel?.valorAvaliacaoTerreno || '',
      "C - DESCRIÇÃO DA UNIDADE": d.imovel?.descricaoUnidade || '',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  
  // Auto-width for columns
  const wscols = Object.keys(rows[0] || {}).map(key => ({ wch: Math.max(20, key.length + 5) }));
  worksheet['!cols'] = wscols;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório Dados");

  XLSX.writeFile(workbook, "Relatorio_Extracao_Imoveis.xlsx");
};