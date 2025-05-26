import React from 'react';
import { Kpi } from '../types';
import TrendChart from './TrendChart';
// ThresholdConfigModal is now invoked from App.tsx
import { CogIcon } from './icons/CogIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ExpandIcon } from './icons/ExpandIcon';
import { getKpiStatusDetails } from '../logic/calculations';
import { formatValueForDisplay } from '../logic/formulas';

interface KpiCardProps {
  kpi: Kpi;
  onOpenFormulaModal: (kpi: Kpi) => void;
  onOpenConfigModal: (kpi: Kpi) => void; // Changed prop
  onOpenExpandedModal: (kpi: Kpi) => void; 
}

const KpiCard: React.FC<KpiCardProps> = ({ kpi, onOpenFormulaModal, onOpenConfigModal, onOpenExpandedModal }) => {
  const { status, color } = getKpiStatusDetails(kpi);
  const IconComponent = kpi.icon;

  const handleSettingsButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    onOpenConfigModal(kpi); // Use new prop
  };

  const handleFormulaButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    onOpenFormulaModal(kpi);
  };

  const handleExpandButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onOpenExpandedModal(kpi);
  };

  return (
    <div 
      className="bg-slate-800 p-5 rounded-xl shadow-2xl flex flex-col justify-between h-full"
      role="article" 
      aria-labelledby={`kpi-title-${kpi.id}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            <IconComponent className="h-8 w-8 text-sky-400 flex-shrink-0" />
            <h3 id={`kpi-title-${kpi.id}`} className="text-lg font-semibold text-sky-400 truncate" title={kpi.name}>{kpi.name}</h3>
          </div>
          <div className="flex space-x-1 flex-shrink-0">
            <button
              onClick={handleFormulaButtonClick}
              className="text-slate-400 hover:text-sky-400 transition-colors p-1 -m-1"
              aria-label={`Ver fórmula para ${kpi.name}`}
              title={`Ver fórmula para ${kpi.name}`}
            >
              <DocumentTextIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleExpandButtonClick}
              className="text-slate-400 hover:text-sky-400 transition-colors p-1 -m-1"
              aria-label={`Expandir ${kpi.name}`}
              title={`Expandir ${kpi.name}`}
            >
              <ExpandIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleSettingsButtonClick} 
              className="text-slate-400 hover:text-sky-400 transition-colors p-1 -m-1"
              aria-label={`Configurar umbrales para ${kpi.name}`}
              title={`Configurar umbrales para ${kpi.name}`}
            >
              <CogIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-3 h-10 overflow-y-auto">{kpi.description}</p>
        
        <div className="my-4 text-center">
          <span className="text-4xl font-bold text-white">{formatValueForDisplay(kpi.currentValue)}</span>
          <span className="text-lg text-slate-400 ml-1">{kpi.unit}</span>
        </div>

        <div className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-full ${color} text-center w-full mb-2`}>
          {status}
        </div>
      </div>
      
      <TrendChart 
        data={kpi.historicalData} 
        unit={kpi.unit} 
        thresholds={kpi.thresholds}
        valueInterpretation={kpi.valueInterpretation}
      />
      {/* ThresholdConfigModal is now rendered in App.tsx based on global state */}
    </div>
  );
};

export default KpiCard;