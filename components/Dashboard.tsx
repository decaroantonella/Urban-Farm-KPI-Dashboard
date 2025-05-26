
import React, { ChangeEvent } from 'react';
import { Kpi, KpiThresholds, CompositeKpi } from '../types';
import KpiCard from './KpiCard';
import CompositeKpiCard from './CompositeKpiCard';
import { UploadIcon } from './icons/UploadIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { HelpIcon } from './icons/HelpIcon';


interface DashboardProps {
  kpis: Kpi[];
  compositeKpis: CompositeKpi[];
  onOpenFormulaModal: (item: Kpi | CompositeKpi) => void;
  onOpenConfigModal: (item: Kpi | CompositeKpi) => void; // New prop
  onOpenExpandedModal: (item: Kpi | CompositeKpi) => void; // Updated prop
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onGenerateRandomData: () => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onOpenHelpModal: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  kpis, 
  compositeKpis, 
  onOpenFormulaModal,
  onOpenConfigModal, // Destructure new prop
  onOpenExpandedModal, // Destructure updated prop
  onFileUpload,
  onGenerateRandomData,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onOpenHelpModal
}) => {
  const environmentalKpis = kpis.filter(kpi => kpi.category === 'environmental');
  const socialKpis = kpis.filter(kpi => kpi.category === 'social');
  const techOperationalKpis = kpis.filter(kpi => kpi.category === 'technological_operational');

  const igdKpi = compositeKpis.find(ckpi => ckpi.id === 'igd');
  const otherCompositeKpis = compositeKpis.filter(ckpi => ckpi.id !== 'igd');

  return (
    <div className="p-4 md:p-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-sky-400 text-center">Dashboard de KPIs para Granjas Urbanas</h1>
        <p className="text-slate-400 mt-2 text-center">Estudio del Impacto de las Granjas Urbanas en Ciudades Inteligentes</p>
      
        <div className="mt-8 flex flex-wrap gap-4 items-center justify-center p-4 bg-slate-800 rounded-lg shadow-md">
          {/* CSV Upload */}
          <label htmlFor="csvUpload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500">
            <UploadIcon className="h-5 w-5 mr-2" />
            Cargar CSV
          </label>
          <input id="csvUpload" type="file" accept=".csv" onChange={onFileUpload} className="hidden" />

          {/* Generate Random Data */}
          <button
            onClick={onGenerateRandomData}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500"
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            Generar Datos Aleatorios
          </button>

          {/* Help CSV */}
           <button
            onClick={onOpenHelpModal}
            className="inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
          >
            <HelpIcon className="h-5 w-5 mr-2" />
            Ayuda CSV
          </button>

          {/* Date Range */}
          <div className="flex flex-wrap gap-2 items-center">
            <label htmlFor="startDate" className="text-sm font-medium text-slate-300">Fecha Inicio:</label>
            <input 
              type="date" 
              id="startDate" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-700 text-slate-300 border-slate-600 rounded-md p-1.5 text-sm shadow-sm focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <label htmlFor="endDate" className="text-sm font-medium text-slate-300">Fecha Fin:</label>
            <input 
              type="date" 
              id="endDate" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-700 text-slate-300 border-slate-600 rounded-md p-1.5 text-sm shadow-sm focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>
      </header>

      {igdKpi && (
        <div className="mb-12">
          <h2 className="text-4xl font-semibold text-sky-300 mb-8 text-center">Índice Global de Desempeño (IGD)</h2>
          <div className="flex justify-center">
            <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
              <CompositeKpiCard 
                compositeKpi={igdKpi} 
                onOpenFormulaModal={() => onOpenFormulaModal(igdKpi)} 
                onOpenConfigModal={() => onOpenConfigModal(igdKpi)} // Pass handler
                onOpenExpandedModal={() => onOpenExpandedModal(igdKpi)} // Pass handler
              />
            </div>
          </div>
        </div>
      )}

      {otherCompositeKpis.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-sky-300 mb-6 text-center border-b border-sky-800 pb-3">Desglose de Índices Compuestos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherCompositeKpis.map((ckpi) => (
              <CompositeKpiCard 
                key={ckpi.id} 
                compositeKpi={ckpi} 
                onOpenFormulaModal={() => onOpenFormulaModal(ckpi)}
                onOpenConfigModal={() => onOpenConfigModal(ckpi)} // Pass handler
                onOpenExpandedModal={() => onOpenExpandedModal(ckpi)} // Pass handler
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-slate-200 mb-5 ml-1 border-l-4 border-sky-500 pl-3">Sostenibilidad Ambiental</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {environmentalKpis.map((kpi) => (
            <KpiCard 
              key={kpi.id} 
              kpi={kpi} 
              onOpenFormulaModal={() => onOpenFormulaModal(kpi)} 
              onOpenConfigModal={() => onOpenConfigModal(kpi)} // Pass handler
              onOpenExpandedModal={() => onOpenExpandedModal(kpi)} // Pass handler
            />
          ))}
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-slate-200 mb-5 ml-1 border-l-4 border-green-500 pl-3">Impacto Social</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialKpis.map((kpi) => (
            <KpiCard 
              key={kpi.id} 
              kpi={kpi} 
              onOpenFormulaModal={() => onOpenFormulaModal(kpi)} 
              onOpenConfigModal={() => onOpenConfigModal(kpi)} // Pass handler
              onOpenExpandedModal={() => onOpenExpandedModal(kpi)} // Pass handler
            />
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-slate-200 mb-5 ml-1 border-l-4 border-amber-500 pl-3">Desarrollo Tecnológico y Operativo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techOperationalKpis.map((kpi) => (
            <KpiCard 
              key={kpi.id} 
              kpi={kpi} 
              onOpenFormulaModal={() => onOpenFormulaModal(kpi)} 
              onOpenConfigModal={() => onOpenConfigModal(kpi)} // Pass handler
              onOpenExpandedModal={() => onOpenExpandedModal(kpi)} // Pass handler
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;