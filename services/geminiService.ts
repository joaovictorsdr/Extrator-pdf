import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ExtractionResult } from "../types";

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    comprador: {
      type: Type.OBJECT,
      properties: {
        nome: { type: Type.STRING, description: "Nome completo do comprador" },
        nomeRegistroCivil: { type: Type.STRING, description: "Nome como consta no registro civil, se diferente" },
        filiacaoMae: { type: Type.STRING, description: "Nome da mãe" },
        nacionalidade: { type: Type.STRING },
        regimeCasamento: { type: Type.STRING },
        rg: { type: Type.STRING, description: "Número do RG" },
        endereco: { type: Type.STRING, description: "Endereço completo" },
        municipio: { type: Type.STRING },
        dataNascimento: { type: Type.STRING },
        estadoCivil: { type: Type.STRING },
        dataCasamento: { type: Type.STRING },
        profissao: { type: Type.STRING },
      },
    },
    conjuge: {
      type: Type.OBJECT,
      description: "Dados do cônjuge, se houver",
      properties: {
        nome: { type: Type.STRING },
        nomeRegistroCivil: { type: Type.STRING },
        nacionalidade: { type: Type.STRING },
        rg: { type: Type.STRING },
        dataNascimento: { type: Type.STRING },
        estadoCivil: { type: Type.STRING },
        profissao: { type: Type.STRING },
      },
    },
    renda: {
      type: Type.OBJECT,
      properties: {
        rendaIndividual: { type: Type.STRING, description: "Renda do cliente identificada pelo R$" },
        rendaFamiliar: { type: Type.STRING, description: "Renda familiar total" },
      },
    },
    imovel: {
      type: Type.OBJECT,
      properties: {
        tipoUnidade: { type: Type.STRING },
        fracaoIdeal: { type: Type.STRING },
        valorAvaliacaoTerreno: { type: Type.STRING, description: "Valor de avaliação da fração do terreno" },
        descricaoUnidade: { type: Type.STRING, description: "Descrição completa da unidade" },
      },
    },
  },
};

export const extractDataFromPDF = async (
  base64Content: string
): Promise<any> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analise este documento PDF de contrato imobiliário.
    Extraia as informações solicitadas nos campos JSON.
    
    Item 1: Dados do Comprador(a)/Devedor(a) e seu Cônjuge (se houver).
    Item 2: Renda Familiar e percentuais. Procure por valores em R$ para renda individual e familiar.
    Item 7.1: Do Imóvel Objeto da Venda. Tipo, frações, valores e descrição.
    
    Se uma informação não for encontrada, retorne uma string vazia ou "Não informado".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Content,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from Gemini");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};