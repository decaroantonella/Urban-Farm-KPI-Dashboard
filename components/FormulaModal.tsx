import React from 'react';

interface FormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  formulaContent: React.ReactNode;
}

const FormulaModal: React.FC<FormulaModalProps> = ({ isOpen, onClose, title, formulaContent }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="formula-modal-title"
      onClick={onClose} // Close modal on overlay click
    >
      <div 
        className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="formula-modal-title" className="text-xl font-semibold text-sky-400">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Cerrar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-sm text-slate-300 space-y-2 leading-relaxed prose prose-sm prose-invert max-w-none">
          {formulaContent}
        </div>
        <div className="mt-6 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormulaModal;