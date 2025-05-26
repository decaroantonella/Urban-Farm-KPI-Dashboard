import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="help-modal-title"
    >
      <div 
        className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="help-modal-title" className="text-xl font-semibold text-sky-400">Ayuda para Carga de CSV</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Cerrar modal de ayuda"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
          <p>Para cargar datos históricos mediante un archivo CSV, asegúrese de que el archivo cumpla con el siguiente formato:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>La primera fila debe ser una cabecera y será ignorada.</li>
            <li>Cada fila subsiguiente debe representar un punto de dato.</li>
            <li>Las columnas deben ser: <strong>kpi_id,date,value</strong></li>
          </ul>
          <p><strong>Detalles de las Columnas:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>kpi_id:</strong> El identificador único del KPI (ej: <code>eua</code>, <code>per</code>, <code>irr</code>, etc.).</li>
            <li><strong>date:</strong> La fecha del dato en formato <code>YYYY-MM-DD</code> (ej: <code>2024-03-15</code>).</li>
            <li><strong>value:</strong> El valor numérico del KPI para esa fecha. Use punto (<code>.</code>) como separador decimal.</li>
          </ul>
          <p><strong>Ejemplo de contenido CSV:</strong></p>
          <pre className="bg-slate-700 p-3 rounded-md text-xs overflow-x-auto">
            <code>
              kpi_id,date,value<br />
              eua,2024-01-01,3.5<br />
              eua,2024-01-02,3.2<br />
              per,2024-01-01,75.0<br />
              irr,2024-01-01,90.5<br />
            </code>
          </pre>
          <p>Los datos cargados se agregarán a los datos históricos existentes para cada KPI. Si ya existe un dato para la misma fecha y KPI, el nuevo dato lo reemplazará (o puede ser promediado, dependiendo de la lógica de importación, actualmente reemplaza).</p>
        </div>
        <div className="mt-6 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
