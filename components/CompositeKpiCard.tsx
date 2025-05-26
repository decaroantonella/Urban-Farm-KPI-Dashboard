import React from 'react';
import { CompositeKpi, CompositeKpiStatus, KpiThresholds } from '../types'; // Import KpiThresholds
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { CogIcon } from './icons/CogIcon'; // Import CogIcon
import { ExpandIcon } from './icons/ExpandIcon'; // Import ExpandIcon
import TrendChart from './TrendChart'; 
import { formatValueForDisplay } from '../logic/formulas';

interface CompositeKpiCardProps {
  compositeKpi: CompositeKpi;
  onOpenFormulaModal: (ckpi: CompositeKpi) => void;
  onOpenConfigModal: (ckpi: CompositeKpi) => void; // New prop for config
  onOpenExpandedModal: (ckpi: CompositeKpi) => void; // New prop for expand
}

const getCompositeKpiStatusColor = (status: CompositeKpiStatus): string => {
  switch (status) {
    case CompositeKpiStatus.Excellent:
      return 'bg-sky-500';
    case CompositeKpiStatus.Good:
      return 'bg-green-500';
    case CompositeKpiStatus.Regular:
      return 'bg-yellow-500';
    case CompositeKpiStatus.Deficient:
      return 'bg-red-600';
    default:
      return 'bg-slate-500';
  }
};

const CompositeKpiCard: React.FC<CompositeKpiCardProps> = ({ 
  compositeKpi, 
  onOpenFormulaModal,
  onOpenConfigModal,
  onOpenExpandedModal 
}) => {
  const { name, value, status, description, icon: IconComponent, historicalData, unit, thresholds, valueInterpretation } = compositeKpi;
  const color = getCompositeKpiStatusColor(status);

  const handleFormulaButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onOpenFormulaModal(compositeKpi);
  };

  const handleConfigButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onOpenConfigModal(compositeKpi);
  };

  const handleExpandButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onOpenExpandedModal(compositeKpi);
  };

  return (
    <div 
      className="bg-slate-800 p-5 rounded-xl shadow-2xl flex flex-col justify-between h-full"
      role="article"
      aria-labelledby={`composite-kpi-title-${compositeKpi.id}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            {IconComponent && <IconComponent className="h-8 w-8 text-sky-400 flex-shrink-0" />}
            <h3 id={`composite-kpi-title-${compositeKpi.id}`} className="text-md font-semibold text-sky-400 leading-tight truncate" title={name}>{name}</h3>
          </div>
          <div className="flex space-x-1 flex-shrink-0">
            <button
              onClick={handleFormulaButtonClick}
              className="text-slate-400 hover:text-sky-400 transition-colors p-1 -m-1"
              aria-label={`Ver fórmula para ${name}`}
              title={`Ver fórmula para ${name}`}
            >
              <DocumentTextIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleExpandButtonClick}
              className="text-slate-400 hover:text-sky-400 transition-colors p-1 -m-1"
              aria-label={`Expandir ${name}`}
              title={`Expandir ${name}`}
            >
              <ExpandIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleConfigButtonClick}
              className="text-slate-400 hover:text-sky-400 transition-colors p-1 -m-1"
              aria-label={`Configurar umbrales para ${name}`}
              title={`Configurar umbrales para ${name}`}
            >
              <CogIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-3 h-10 overflow-y-auto">{description}</p>
        
        <div className="my-4 text-center">
          <span className="text-4xl font-bold text-white">{formatValueForDisplay(value)}</span>
           {unit && <span className="text-lg text-slate-400 ml-1">{unit}</span>}
        </div>

        <div className={`inline-block px-3 py-1.5 text-sm font-bold text-white rounded-full ${color} text-center w-full mb-2`}>
          {status}
        </div>
      </div>
      
      <TrendChart
        data={historicalData}
        unit={unit}
        thresholds={thresholds}
        valueInterpretation={valueInterpretation}
      />
    </div>
  );
};

export default CompositeKpiCard;