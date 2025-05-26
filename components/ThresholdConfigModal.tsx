import React, { useState, useEffect } from 'react';
import { KpiThresholds, Kpi, CompositeKpi } from '../types';

interface ThresholdConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Kpi | CompositeKpi; // Changed from kpi to item
  onSave: (itemId: string, newThresholds: KpiThresholds, itemType: 'kpi' | 'composite') => void; // Updated onSave
}

const ThresholdConfigModal: React.FC<ThresholdConfigModalProps> = ({ isOpen, onClose, item, onSave }) => {
  const [currentThresholds, setCurrentThresholds] = useState<KpiThresholds>(item.thresholds);

  useEffect(() => {
    setCurrentThresholds(item.thresholds);
  }, [item.thresholds, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentThresholds(prev => ({ ...prev, [name]: value === '' ? undefined : parseFloat(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Determine itemType: Kpi has 'category', CompositeKpi does not (among other differences)
    const itemType = 'category' in item ? 'kpi' : 'composite';
    onSave(item.id, currentThresholds, itemType);
    onClose();
  };
  
  const renderThresholdFields = () => {
    // Composite KPIs always have valueInterpretation: 'higherIsBetter'
    const valueInterpretation = 'category' in item ? item.valueInterpretation : 'higherIsBetter';
    const isPercentage = 'category' in item && item.valueInterpretation === 'percentage';

    if (valueInterpretation === 'higherIsBetter' || valueInterpretation === 'percentage') {
      const optimalLabel = isPercentage ? "Óptimo (%)" : "Óptimo (Mínimo)";
      const acceptableLabel = isPercentage ? "Aceptable (Mínimo %)" : "Aceptable (Mínimo)";
      const attentionLabel = isPercentage ? "Requiere Atención (Mínimo %)" : "Requiere Atención (Mínimo)";

      const optimalKey = isPercentage ? 'optimalPercentage' : 'optimalMin';
      const acceptableKey = isPercentage ? 'acceptablePercentage' : 'acceptableMin';
      const attentionKey = isPercentage ? 'attentionPercentage' : 'attentionMin';

      return (
        <>
          <div>
            <label htmlFor={optimalKey} className="block text-sm font-medium text-slate-300">{optimalLabel}</label>
            <input
              type="number"
              name={optimalKey}
              id={optimalKey}
              value={currentThresholds[optimalKey as keyof KpiThresholds] ?? ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2"
            />
          </div>
          <div>
            <label htmlFor={acceptableKey} className="block text-sm font-medium text-slate-300">{acceptableLabel}</label>
            <input
              type="number"
              name={acceptableKey}
              id={acceptableKey}
              value={currentThresholds[acceptableKey as keyof KpiThresholds] ?? ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2"
            />
          </div>
          <div>
            <label htmlFor={attentionKey} className="block text-sm font-medium text-slate-300">{attentionLabel}</label>
            <input
              type="number"
              name={attentionKey}
              id={attentionKey}
              value={currentThresholds[attentionKey as keyof KpiThresholds] ?? ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Para "{item.name}", valores más altos son mejores. {isPercentage ? `Crítico es menor que "${attentionLabel}".` : `Crítico es menor que el mínimo de "Requiere Atención".`}</p>
        </>
      );
    } else { // lowerIsBetter (only for Kpi, not CompositeKpi)
      return (
        <>
          <div>
            <label htmlFor="optimalMax" className="block text-sm font-medium text-slate-300">Óptimo (Máximo)</label>
            <input
              type="number"
              name="optimalMax"
              id="optimalMax"
              value={currentThresholds.optimalMax ?? ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="acceptableMax" className="block text-sm font-medium text-slate-300">Aceptable (Máximo)</label>
            <input
              type="number"
              name="acceptableMax"
              id="acceptableMax"
              value={currentThresholds.acceptableMax ?? ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="attentionMax" className="block text-sm font-medium text-slate-300">Requiere Atención (Máximo)</label>
            <input
              type="number"
              name="attentionMax"
              id="attentionMax"
              value={currentThresholds.attentionMax ?? ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2"
            />
          </div>
           <p className="text-xs text-slate-400 mt-1">Para "{item.name}", valores más bajos son mejores. Crítico es mayor que el máximo de "Requiere Atención".</p>
        </>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 id="modal-title" className="text-xl font-semibold mb-4 text-sky-400">Configurar Umbrales: {item.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderThresholdFields()}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 hover:bg-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThresholdConfigModal;