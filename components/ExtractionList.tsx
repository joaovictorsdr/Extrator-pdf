import React from 'react';
import { CheckCircle, XCircle, Loader2, FileText } from 'lucide-react';
import { ExtractionResult } from '../types';

interface ExtractionListProps {
  results: ExtractionResult[];
}

const ExtractionList: React.FC<ExtractionListProps> = ({ results }) => {
  if (results.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Arquivos Processados</h3>
      <div className="bg-white shadow overflow-hidden rounded-md border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {results.map((result, index) => (
            <li key={index} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{result.fileName}</p>
                  {result.error && (
                    <p className="text-xs text-red-500">{result.error}</p>
                  )}
                  {result.status === 'success' && result.data && (
                    <p className="text-xs text-green-600">
                      Comprador: {result.data.comprador.nome} | Renda: {result.data.renda.rendaFamiliar}
                    </p>
                  )}
                </div>
              </div>
              <div>
                {result.status === 'pending' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Aguardando
                  </span>
                )}
                {result.status === 'processing' && (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                )}
                {result.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {result.status === 'error' && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExtractionList;