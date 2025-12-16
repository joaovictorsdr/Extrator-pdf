export interface BuyerData {
  nome: string;
  nomeRegistroCivil: string;
  filiacaoMae: string;
  nacionalidade: string;
  regimeCasamento: string;
  rg: string;
  endereco: string;
  municipio: string;
  dataNascimento: string;
  estadoCivil: string;
  dataCasamento: string;
  profissao: string;
}

export interface SpouseData {
  nome: string;
  nomeRegistroCivil: string;
  nacionalidade: string;
  rg: string;
  dataNascimento: string;
  estadoCivil: string;
  profissao: string;
}

export interface IncomeData {
  rendaIndividual: string;
  rendaFamiliar: string;
}

export interface PropertyData {
  tipoUnidade: string;
  fracaoIdeal: string;
  valorAvaliacaoTerreno: string;
  descricaoUnidade: string;
}

export interface ExtractionResult {
  fileName: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  data?: {
    comprador: BuyerData;
    conjuge: SpouseData;
    renda: IncomeData;
    imovel: PropertyData;
  };
  error?: string;
}