import React, { useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFilesSelected, disabled }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      
      const files = Array.from(e.dataTransfer.files).filter(
        (file: File) => file.type === 'application/pdf'
      );
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected, disabled]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files) return;
    const files = Array.from(e.target.files).filter(
      (file: File) => file.type === 'application/pdf'
    );
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
        disabled
          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
          : 'border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400'
      }`}
    >
      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
        disabled={disabled}
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
        <UploadCloud className={`w-12 h-12 mb-4 ${disabled ? 'text-gray-400' : 'text-blue-500'}`} />
        <p className="text-lg font-medium text-gray-700">
          Arraste e solte seus PDFs aqui
        </p>
        <p className="text-sm text-gray-500 mt-1">
          ou clique para selecionar (apenas PDF)
        </p>
      </label>
    </div>
  );
};

export default Dropzone;