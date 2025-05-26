
import React from 'react';
import { Kpi, CompositeKpi, KpiStatus, CompositeKpiStatus } from '../types';
import TrendChart from './TrendChart';
import { getKpiStatusDetails, getCompositeKpiStatus as getCompositeStatus } from '../logic/calculations';
import { formatValueForDisplay } from '../logic/formulas';
import { CogIcon } from './icons/CogIcon'; // Default icon if item.icon is missing

interface ExpandedKpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Kpi | CompositeKpi | null; // Changed from kpi to item
}

const ExpandedKpiModal: React.FC<ExpandedKpiModalProps> = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  const isBaseKpi = 'category' in item; // Check if it's a Kpi or CompositeKpi
  
  let statusText: KpiStatus | CompositeKpiStatus;
  let statusColor: string;
  let currentValue: number;
  // FIX: Rename iconToRender to IconToRender and ensure consistent type.
  let IconToRender: React.FC<React.SVGProps<SVGSVGElement>>;

  if (isBaseKpi) {
    const kpiItem = item as Kpi;
    const statusDetails = getKpiStatusDetails(kpiItem);
    statusText = statusDetails.status;
    statusColor = statusDetails.color;
    currentValue = kpiItem.currentValue;
    // FIX: Apply type assertion to ensure compatibility.
    IconToRender = kpiItem.icon as React.FC<React.SVGProps<SVGSVGElement>>;
  } else {
    const compositeItem = item as CompositeKpi;
    statusText = compositeItem.status; // Status is pre-calculated
    switch (compositeItem.status) { // Determine color for composite status
      case CompositeKpiStatus.Excellent: statusColor = 'bg-sky-500'; break;
      case CompositeKpiStatus.Good: statusColor = 'bg-green-500'; break;
      case CompositeKpiStatus.Regular: statusColor = 'bg-yellow-500'; break;
      case CompositeKpiStatus.Deficient: statusColor = 'bg-red-600'; break;
      default: statusColor = 'bg-slate-500';
    }
    currentValue = compositeItem.value;
    // FIX: Apply type assertion to ensure compatibility.
    IconToRender = (compositeItem.icon || CogIcon) as React.FC<React.SVGProps<SVGSVGElement>>;
  }


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="expanded-kpi-title"
    >
      <div 
        className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-2xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            {/* FIX: Use capitalized IconToRender for JSX component */}
            <IconToRender className="h-10 w-10 text-sky-400 flex-shrink-0" />
            <div>
              <h2 id="expanded-kpi-title" className="text-2xl font-semibold text-sky-400">{item.name}</h2>
              <p className="text-sm text-slate-400">{item.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Cerrar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="my-6 text-center">
          <span className="text-5xl font-bold text-white">{formatValueForDisplay(currentValue)}</span>
          <span className="text-2xl text-slate-400 ml-2">{item.unit}</span>
        </div>

        <div className={`px-4 py-2 text-md font-semibold text-white rounded-full ${statusColor} text-center w-full mb-6`}>
          Estado: {statusText}
        </div>
        
        <h4 className="text-lg font-medium text-slate-300 mb-2">Tendencia Histórica</h4>
        <TrendChart 
          data={item.historicalData} 
          unit={item.unit} 
          thresholds={item.thresholds}
          valueInterpretation={item.valueInterpretation}
          isExpanded={true}
        />

        <div className="mt-8 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpandedKpiModal;
