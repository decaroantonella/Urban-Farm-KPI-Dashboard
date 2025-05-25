
import React, { useState, useEffect, useCallback } from 'react';
import { KpiInputValues, KpiResult, CompositeIndexResult, KpiId, KpiDefinition, CompositeIndexDefinition, KpiDirectInputValues } from './types';
import { KPI_DEFINITIONS } from './constants/kpiDefinitions';
import { COMPOSITE_INDEX_DEFINITIONS } from './constants/compositeIndexDefinitions';
import { evaluateKpi, calculateCompositeIndexValue, evaluateCompositeIndex } from './utils/evaluationHelpers';
import KpiCard from './components/KpiCard';
import SectionTitle from './components/SectionTitle';
import { FarmHeaderIcon, EnvironmentalIcon, SocialImpactIcon, TechDevIcon, GlobalPerformanceIcon } from './components/Icons';

// Initial data for "Unidad de Trabajo" prototype, aiming for "Aceptable" or "Bueno"
const initialInputValues: KpiInputValues = {
  // EUA
  aguaUtilizadaTotal: 280, // L/month for 100kg production
  produccionTotal: 100,    // kg/month
  // PER
  energiaRenovableGenerada: 85, // kWh
  energiaConsumoTotal: 100,    // kWh
  // IRR
  residuosReciclados: 90,    // kg
  residuosGeneradosTotal: 100, // kg
  // IIC (uses produccionTotal from EUA)
  emisionesCO2Eq: 80,       // kg CO2eq for 100kg production
  // AAL
  poblacionConAccesoLocal: 35,
  poblacionTotalAreaInfluencia: 50,
  // IPCA
  participantesActivosMensuales: 15,
  capacidadTotalParticipacion: 20,
  // ICS
  parametrosSueloOptimos: 88,
  parametrosSueloMedidosTotal: 100,
  // IITSF
  inversionTecnologiasSmart: 1800, 
  presupuestoOperativoAnual: 10000,
  // IRA
  usoActualAgroquimicos: 3, 
  usoBaseAgroquimicos: 10,  
  // ISAC
  lotesCumplenEstandares: 97,
  lotesProducidosTotal: 100,
  // Direct Inputs for some KPIs/Indices
  disponibilidadSistemaMonitoreo: 97, // For ESM (%),
  eficienciaAnalisisDatos: 0.75, // For EAD_norm (0-1)
};


const App: React.FC = () => {
  const [inputValues, setInputValues] = useState<KpiInputValues>(initialInputValues);
  const [kpiResults, setKpiResults] = useState<Record<KpiId, KpiResult>>({} as Record<KpiId, KpiResult>);
  const [compositeIndexResults, setCompositeIndexResults] = useState<Record<string, CompositeIndexResult>>({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleInputChange = useCallback((kpiId: keyof KpiInputValues, value: string | number) => {
    setInputValues(prev => ({ ...prev, [kpiId]: typeof value === 'string' ? parseFloat(value) || 0 : value }));
  }, []);

  useEffect(() => {
    // 1. Calculate KPI Results
    const currentKpiResults = {} as Record<KpiId, KpiResult>;
    KPI_DEFINITIONS.forEach(def => {
      let value: number | undefined;
      if (def.calculate) {
        value = def.calculate(inputValues);
      } else if (def.directInputKey) {
         value = inputValues[def.directInputKey as keyof KpiDirectInputValues] as number;
      }
      if (value !== undefined) {
        currentKpiResults[def.id] = evaluateKpi(def, value);
      }
    });
    setKpiResults(currentKpiResults);

    // 2. Prepare scores for composite indices
    const kpiScoresForComposites: Partial<Record<KpiId, number>> =
        Object.fromEntries(
            Object.entries(currentKpiResults).map(([id, result]) => [id as KpiId, result.score ?? 0])
        );
    
    // For IDT, we need EAD_norm and ESM_norm (which is score from ESM KPI)
    const scoresForIdt: Partial<Record<KpiId | 'EAD_norm' | 'ESM_norm', number>> = {
        ...kpiScoresForComposites, // includes IITSF score
    };
    if (currentKpiResults.ESM) {
        scoresForIdt.ESM_norm = currentKpiResults.ESM.score ?? 0;
    }
    if (inputValues.eficienciaAnalisisDatos !== undefined) {
        scoresForIdt.EAD_norm = inputValues.eficienciaAnalisisDatos; // EAD_norm is directly 0-1
    }


    // 3. Calculate Composite Indices in stages
    const currentCompositeResultsData = {} as Record<string, CompositeIndexResult>;

    COMPOSITE_INDEX_DEFINITIONS.forEach(def => {
        if (def.id === 'ISA' || def.id === 'IIS') {
            const value = calculateCompositeIndexValue(def, kpiScoresForComposites, {});
            currentCompositeResultsData[def.id] = evaluateCompositeIndex(def, value);
        } else if (def.id === 'IDT') {
            const value = calculateCompositeIndexValue(def, scoresForIdt, {});
            currentCompositeResultsData[def.id] = evaluateCompositeIndex(def, value);
        }
    });
    
    const igdDef = COMPOSITE_INDEX_DEFINITIONS.find(def => def.id === 'IGD');
    if (igdDef) {
        const value = calculateCompositeIndexValue(igdDef, {}, currentCompositeResultsData); // IGD only needs other composite scores
        currentCompositeResultsData[igdDef.id] = evaluateCompositeIndex(igdDef, value);
    }
    
    setCompositeIndexResults(currentCompositeResultsData);

  }, [inputValues]);

  const renderKpiSection = (title: string, kpiDefs: KpiDefinition[], icon?: React.ReactNode) => (
    <div className="mb-12">
      <SectionTitle title={title} icon={icon} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiDefs.map(def => (
          <KpiCard
            key={def.id}
            definition={def}
            inputValues={inputValues}
            onInputChange={handleInputChange}
            result={kpiResults[def.id]}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-farm-dark-bg text-gray-900 dark:text-farm-dark-text p-4 sm:p-8 transition-colors duration-300">
      <header className="mb-10 text-center">
        <FarmHeaderIcon className="w-20 h-20 mx-auto text-farm-primary dark:text-farm-accent mb-4" />
        <h1 className="text-4xl sm:text-5xl font-bold text-farm-primary dark:text-farm-accent">
          Urban Farm KPI Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          Estudio del impacto de las granjas urbanas en ciudades inteligentes.
        </p>
         <button
            onClick={toggleDarkMode}
            className="mt-6 px-6 py-2 bg-farm-secondary dark:bg-farm-primary text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-farm-accent focus:ring-opacity-50"
          >
            <span className="mr-2">{darkMode ? '☀️' : '🌙'}</span>
            Modo {darkMode ? 'Claro' : 'Oscuro'}
          </button>
      </header>

      <main>
        {renderKpiSection(
          'Sostenibilidad Ambiental',
          KPI_DEFINITIONS.filter(k => ['EUA', 'PER', 'IRR', 'IIC'].includes(k.id)),
          <EnvironmentalIcon className="w-8 h-8 mr-3 text-green-500" />
        )}
        {renderKpiSection(
          'Impacto Social',
          KPI_DEFINITIONS.filter(k => ['AAL', 'IPCA', 'ISAC'].includes(k.id)),
          <SocialImpactIcon className="w-8 h-8 mr-3 text-blue-500" />
        )}
        {renderKpiSection(
          'Desarrollo y Operación Tecnológica',
          KPI_DEFINITIONS.filter(k => ['ICS', 'IITSF', 'IRA', 'ESM', 'EAD'].includes(k.id)),
          <TechDevIcon className="w-8 h-8 mr-3 text-purple-500" />
        )}

        <div className="mb-12">
          <SectionTitle title="Índices Compuestos Globales" icon={<GlobalPerformanceIcon className="w-8 h-8 mr-3 text-orange-500" />} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPOSITE_INDEX_DEFINITIONS.map(def => (
              <KpiCard
                key={def.id}
                definition={def}
                result={compositeIndexResults[def.id]}
                isComposite={true}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-white dark:bg-farm-dark-card shadow-xl rounded-lg">
          <h3 className="text-2xl font-semibold text-farm-primary dark:text-farm-accent mb-4">Nota sobre la Unidad de Trabajo Prototipo</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Los valores iniciales representan una "Unidad de Trabajo" prototipo con un desempeño generalmente aceptable.
            Modifique los valores de entrada para los KPIs individuales y observe cómo cambian los indicadores y las alertas.
            Esta herramienta está diseñada para ayudar a visualizar el impacto de diferentes factores operativos.
            Producción mensual base asumida: 100 kg.
          </p>
        </div>
      </main>

      <footer className="text-center mt-12 py-6 border-t border-gray-300 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Urban Farm KPI Dashboard. Basado en el modelo de evaluación propuesto.
        </p>
      </footer>
    </div>
  );
};

export default App;
