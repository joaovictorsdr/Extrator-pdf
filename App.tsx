import React, { useState } from 'react';
import { FileSpreadsheet, Play, Trash2 } from 'lucide-react';
import Dropzone from './components/Dropzone';
import ExtractionList from './components/ExtractionList';
import { ExtractionResult } from './types';
import { fileToBase64 } from './utils/fileHelpers';
import { extractDataFromPDF } from './services/geminiService';
import { generateExcelReport } from './utils/excelGenerator';

function App() {
  const [results, setResults] = useState<ExtractionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    // Better approach: Add to state, then process the pending ones.
    const resultsWithFiles = files.map(f => ({
      fileObj: f,
      fileName: f.name,
      status: 'pending' as const
    }));
    
    // Note: The ExtractionResult type doesn't officially have fileObj, 
    // but we use this internal property for processing logic.
    setResults(prev => [...prev, ...resultsWithFiles] as any);
  };

  const processFiles = async () => {
    setIsProcessing(true);

    const indicesToProcess = results
      .map((r, i) => (r.status === 'pending' ? i : -1))
      .filter((i) => i !== -1);

    for (const index of indicesToProcess) {
      const item = results[index] as ExtractionResult & { fileObj?: File };
      if (!item.fileObj) continue;

      // Update status to processing
      setResults((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], status: 'processing' };
        return copy;
      });

      try {
        const base64 = await fileToBase64(item.fileObj);
        const data = await extractDataFromPDF(base64);
        
        setResults((prev) => {
          const copy = [...prev];
          copy[index] = { 
            ...copy[index], 
            status: 'success', 
            data: data 
          };
          return copy;
        });
      } catch (error) {
        setResults((prev) => {
          const copy = [...prev];
          copy[index] = { 
            ...copy[index], 
            status: 'error', 
            error: error instanceof Error ? error.message : "Falha na extração" 
          };
          return copy;
        });
      }
    }

    setIsProcessing(false);
  };

  const handleExport = () => {
    generateExcelReport(results);
  };

  const handleClear = () => {
    if (window.confirm("Tem certeza que deseja limpar a lista?")) {
      setResults([]);
    }
  };

  const hasPending = results.some(r => r.status === 'pending');
  const hasSuccess = results.some(r => r.status === 'success');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Extrator de Dados Imobiliários
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Carregue seus contratos (PDF), a IA extrairá os dados e gerará o relatório Excel formatado.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Dropzone 
            onFilesSelected={handleFilesSelected} 
            disabled={isProcessing} 
          />

          <div className="mt-6 flex flex-wrap gap-4 justify-center sm:justify-end">
            <button
              onClick={handleClear}
              disabled={results.length === 0 || isProcessing}
              className="flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Lista
            </button>
            
            <button
              onClick={processFiles}
              disabled={!hasPending || isProcessing}
              className={`flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                ${!hasPending || isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <Play className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processando...' : 'Processar Arquivos'}
            </button>

            <button
              onClick={handleExport}
              disabled={!hasSuccess}
              className={`flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                ${!hasSuccess ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Baixar Excel
            </button>
          </div>

          <ExtractionList results={results} />
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-400">
           Alimentado por Gemini 2.5 Flash
        </div>
      </div>
    </div>
  );
}

export default App;