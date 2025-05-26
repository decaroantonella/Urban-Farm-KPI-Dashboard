

import React, { useState, useCallback, useMemo, ChangeEvent } from 'react';
import Dashboard from './components/Dashboard';
import FormulaModal from './components/FormulaModal';
import ExpandedKpiModal from './components/ExpandedKpiModal';
import HelpModal from './components/HelpModal';
import ThresholdConfigModal from './components/ThresholdConfigModal'; // Import ThresholdConfigModal
import { INITIAL_KPIS } from './constants';
import { Kpi, KpiThresholds, CompositeKpi, HistoricalDataPoint } from './types';
import { calculateIsa, calculateIis, calculateIdt, calculateIgd, getCompositeKpiStatus } from './logic/calculations';
import { getKpiFormulaExplanation, getCompositeKpiFormulaExplanation } from './logic/formulas';

// Import icons for composite KPIs
import { SoilHealthIcon } from './components/icons/SoilHealthIcon';
import { CommunityIcon } from './components/icons/CommunityIcon';
import { TechInvestmentIcon } from './components/icons/TechInvestmentIcon';
import { CogIcon } from './components/icons/CogIcon';


const getDefaultCompositeThresholds = (): Record<string, KpiThresholds> => ({
  'isa': { optimalMin: 0.9, acceptableMin: 0.75, attentionMin: 0.6 },
  'iis': { optimalMin: 0.85, acceptableMin: 0.7, attentionMin: 0.5 },
  'idt': { optimalMin: 0.85, acceptableMin: 0.7, attentionMin: 0.5 },
  'igd': { optimalMin: 0.80, acceptableMin: 0.65, attentionMin: 0.50 },
});


const App: React.FC = () => {
  const [kpis, setKpis] = useState<Kpi[]>(INITIAL_KPIS);
  const [compositeKpiUserThresholds, setCompositeKpiUserThresholds] = useState<Record<string, KpiThresholds>>(
    getDefaultCompositeThresholds()
  );

  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [selectedItemForFormula, setSelectedItemForFormula] = useState<Kpi | CompositeKpi | null>(null);
  
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedItemForConfig, setSelectedItemForConfig] = useState<Kpi | CompositeKpi | null>(null);

  const [isExpandedModalOpen, setIsExpandedModalOpen] = useState(false);
  const [selectedItemForExpansion, setSelectedItemForExpansion] = useState<Kpi | CompositeKpi | null>(null);
  
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);


  const handleSaveThresholds = useCallback((itemId: string, newThresholds: KpiThresholds, itemType: 'kpi' | 'composite') => {
    if (itemType === 'kpi') {
      setKpis(prevKpis =>
        prevKpis.map(kpi =>
          kpi.id === itemId ? { ...kpi, thresholds: newThresholds } : kpi
        )
      );
    } else { // composite
      setCompositeKpiUserThresholds(prev => ({
        ...prev,
        [itemId]: newThresholds,
      }));
    }
  }, []);


  const filteredKpis = useMemo(() => {
    if (!startDate && !endDate) {
      return kpis;
    }
    return kpis.map(kpi => ({
      ...kpi,
      historicalData: kpi.historicalData.filter(dp => {
        const date = new Date(dp.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (start && date < start) return false;
        if (end) {
            const adjustedEnd = new Date(end);
            adjustedEnd.setDate(adjustedEnd.getDate() + 1); // Include the end date itself
            if (date >= adjustedEnd) return false;
        }
        return true;
      }),
    }));
  }, [kpis, startDate, endDate]);


  const compositeKpis = useMemo((): CompositeKpi[] => {
    const allDates = new Set<string>();
    kpis.forEach(kpi => kpi.historicalData.forEach(dp => allDates.add(dp.date)));
    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const isaHistorical: HistoricalDataPoint[] = [];
    const iisHistorical: HistoricalDataPoint[] = [];
    const idtHistorical: HistoricalDataPoint[] = [];
    const igdHistorical: HistoricalDataPoint[] = [];

    for (const date of sortedDates) {
      const kpisAtDate: Kpi[] = kpis.map(baseKpi => {
        const dataPoint = baseKpi.historicalData.find(dp => dp.date === date);
        return {
          ...baseKpi,
          currentValue: dataPoint ? dataPoint.value : NaN,
        };
      });

      const isaValueOnDate = calculateIsa(kpisAtDate);
      if (!isNaN(isaValueOnDate)) {
        isaHistorical.push({ date, value: isaValueOnDate });
      }

      const iisValueOnDate = calculateIis(kpisAtDate);
      if (!isNaN(iisValueOnDate)) {
        iisHistorical.push({ date, value: iisValueOnDate });
      }

      const idtValueOnDate = calculateIdt(kpisAtDate);
      if (!isNaN(idtValueOnDate)) {
        idtHistorical.push({ date, value: idtValueOnDate });
      }
      
      if (!isNaN(isaValueOnDate) && !isNaN(iisValueOnDate) && !isNaN(idtValueOnDate)) {
        const igdValueOnDate = calculateIgd(isaValueOnDate, iisValueOnDate, idtValueOnDate);
        if (!isNaN(igdValueOnDate)) {
          igdHistorical.push({ date, value: igdValueOnDate });
        }
      }
    }

    const getCurrentCompositeValue = (historical: HistoricalDataPoint[], calculationFunc: (k: Kpi[]) => number) => {
      if (historical.length > 0) {
        return historical[historical.length - 1].value;
      }
      const calculatedOverall = calculationFunc(kpis);
      return isNaN(calculatedOverall) ? 0 : calculatedOverall;
    };
    
    const currentIsa = getCurrentCompositeValue(isaHistorical, calculateIsa);
    const currentIis = getCurrentCompositeValue(iisHistorical, calculateIis);
    const currentIdt = getCurrentCompositeValue(idtHistorical, calculateIdt);
    const currentIgd = igdHistorical.length > 0 ? igdHistorical[igdHistorical.length - 1].value : calculateIgd(currentIsa, currentIis, currentIdt);

    const defaultThresholds = getDefaultCompositeThresholds();

    return [
      {
        id: 'isa',
        name: 'Índice de Sostenibilidad Ambiental (ISA)',
        value: currentIsa,
        status: getCompositeKpiStatus(currentIsa, 'standard'),
        description: 'Integra KPIs relacionados con el impacto ambiental directo de las operaciones.',
        // FIX: Apply type assertion for icon
        icon: SoilHealthIcon as React.FC<React.SVGProps<SVGSVGElement>>,
        historicalData: isaHistorical,
        unit: 'Índice',
        thresholds: compositeKpiUserThresholds['isa'] || defaultThresholds['isa'],
        valueInterpretation: 'higherIsBetter',
      },
      {
        id: 'iis',
        name: 'Índice de Impacto Social (IIS)',
        value: currentIis,
        status: getCompositeKpiStatus(currentIis, 'standard'),
        description: 'Integra indicadores relacionados con el beneficio social directo que la granja aporta a su comunidad.',
        // FIX: Apply type assertion for icon
        icon: CommunityIcon as React.FC<React.SVGProps<SVGSVGElement>>,
        historicalData: iisHistorical,
        unit: 'Índice',
        thresholds: compositeKpiUserThresholds['iis'] || defaultThresholds['iis'],
        valueInterpretation: 'higherIsBetter',
      },
      {
        id: 'idt',
        name: 'Índice de Desarrollo Tecnológico (IDT)',
        value: currentIdt,
        status: getCompositeKpiStatus(currentIdt, 'standard'),
        description: 'Evalúa el nivel de implementación, efectividad y actualización de las tecnologías de smart farming.',
        // FIX: Apply type assertion for icon
        icon: TechInvestmentIcon as React.FC<React.SVGProps<SVGSVGElement>>,
        historicalData: idtHistorical,
        unit: 'Índice',
        thresholds: compositeKpiUserThresholds['idt'] || defaultThresholds['idt'],
        valueInterpretation: 'higherIsBetter',
      },
      {
        id: 'igd',
        name: 'Índice Global de Desempeño (IGD)',
        value: isNaN(currentIgd) ? 0 : currentIgd,
        status: getCompositeKpiStatus(currentIgd, 'global'),
        description: 'Integra los tres índices compuestos (ISA, IIS, IDT) para una visión consolidada del rendimiento general.',
        // FIX: Apply type assertion for icon
        icon: CogIcon as React.FC<React.SVGProps<SVGSVGElement>>,
        historicalData: igdHistorical,
        unit: 'Índice',
        thresholds: compositeKpiUserThresholds['igd'] || defaultThresholds['igd'],
        valueInterpretation: 'higherIsBetter',
      }
    ];
  }, [kpis, compositeKpiUserThresholds]); 

  const handleOpenFormulaModal = useCallback((item: Kpi | CompositeKpi) => {
    setSelectedItemForFormula(item);
    setIsFormulaModalOpen(true);
  }, []);

  const handleCloseFormulaModal = useCallback(() => {
    setIsFormulaModalOpen(false);
    setSelectedItemForFormula(null);
  }, []);

  const handleOpenConfigModal = useCallback((item: Kpi | CompositeKpi) => {
    setSelectedItemForConfig(item);
    setIsConfigModalOpen(true);
  }, []);

  const handleCloseConfigModal = useCallback(() => {
    setIsConfigModalOpen(false);
    setSelectedItemForConfig(null);
  }, []);

  const handleOpenExpandedModal = useCallback((item: Kpi | CompositeKpi) => {
    setSelectedItemForExpansion(item);
    setIsExpandedModalOpen(true);
  }, []);

  const handleCloseExpandedModal = useCallback(() => {
    setIsExpandedModalOpen(false);
    setSelectedItemForExpansion(null);
  }, []);


  const getFormulaContent = () => {
    if (!selectedItemForFormula) return '';
    if ('category' in selectedItemForFormula) { 
      return getKpiFormulaExplanation(selectedItemForFormula as Kpi);
    } else { 
      return getCompositeKpiFormulaExplanation(selectedItemForFormula as CompositeKpi, kpis);
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        try {
          const newHistoricalDataMap: { [kpiId: string]: HistoricalDataPoint[] } = {};
          const lines = text.split(/\r\n|\n/).slice(1); 

          lines.forEach(line => {
            const [kpiId, dateStr, valueStr] = line.split(',');
            if (kpiId && dateStr && valueStr) {
              const value = parseFloat(valueStr);
              if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || isNaN(value)) {
                console.warn(`Skipping invalid line: ${line}`);
                return;
              }
              const trimmedKpiId = kpiId.trim();
              if (!newHistoricalDataMap[trimmedKpiId]) {
                newHistoricalDataMap[trimmedKpiId] = [];
              }
              newHistoricalDataMap[trimmedKpiId].push({ date: dateStr.trim(), value });
            }
          });
          
          setKpis(prevKpis =>
            prevKpis.map(kpi => {
              if (newHistoricalDataMap[kpi.id]) {
                const combinedData = [...kpi.historicalData, ...newHistoricalDataMap[kpi.id]];
                combinedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                const uniqueData = Array.from(new Map(combinedData.map(item => [item.date, item])).values());
                const newCurrentValue = uniqueData.length > 0 ? uniqueData[uniqueData.length - 1].value : kpi.currentValue;
                return { ...kpi, historicalData: uniqueData, currentValue: newCurrentValue };
              }
              return kpi;
            })
          );
          alert('Datos CSV cargados exitosamente!');
        } catch (error) {
          console.error("Error parsing CSV:", error);
          alert('Error al procesar el archivo CSV. Verifique el formato y el contenido.');
        }
      };
      reader.readAsText(file);
      event.target.value = ''; 
    }
  };
  
  const generateRandomData = () => {
    setKpis(INITIAL_KPIS.map(initialKpi => {
        const newHistoricalData = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            const baseValue = INITIAL_KPIS.find(ik => ik.id === initialKpi.id)?.currentValue || 50;
            return {
              date: date.toISOString().split('T')[0],
              value: parseFloat((baseValue * (0.8 + Math.random() * 0.4)).toFixed(2)),
            };
          });
        return {
            ...initialKpi, 
            historicalData: newHistoricalData,
            currentValue: newHistoricalData.length > 0 ? newHistoricalData[newHistoricalData.length - 1].value : initialKpi.currentValue,
        };
    }));
    alert('Nuevos datos aleatorios generados.');
  };

  const handleOpenHelpModal = () => setIsHelpModalOpen(true);
  const handleCloseHelpModal = () => setIsHelpModalOpen(false);

  return (
    <div className="min-h-screen bg-slate-900">
      <Dashboard
        kpis={filteredKpis} 
        compositeKpis={compositeKpis}
        onOpenFormulaModal={handleOpenFormulaModal}
        onOpenConfigModal={handleOpenConfigModal} // Pass new handler
        onOpenExpandedModal={handleOpenExpandedModal} // Pass new handler
        onFileUpload={handleFileUpload}
        onGenerateRandomData={generateRandomData}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onOpenHelpModal={handleOpenHelpModal}
      />
      <footer className="text-center py-8 text-slate-500 text-sm">
        <p>Basado en el Proyecto Integrador para la obtención del Título de Grado Ingeniero Electrónico.</p>
        <p>Universidad Nacional de Córdoba.</p>
      </footer>
      {isFormulaModalOpen && selectedItemForFormula && (
        <FormulaModal
          isOpen={isFormulaModalOpen}
          onClose={handleCloseFormulaModal}
          title={`Fórmula de Cálculo: ${selectedItemForFormula.name}`}
          formulaContent={getFormulaContent()}
        />
      )}
      {isConfigModalOpen && selectedItemForConfig && (
        <ThresholdConfigModal
          isOpen={isConfigModalOpen}
          onClose={handleCloseConfigModal}
          item={selectedItemForConfig}
          onSave={handleSaveThresholds}
        />
      )}
      {isExpandedModalOpen && selectedItemForExpansion && (
        <ExpandedKpiModal
          isOpen={isExpandedModalOpen}
          onClose={handleCloseExpandedModal}
          item={selectedItemForExpansion}
        />
      )}
      {isHelpModalOpen && (
        <HelpModal
          isOpen={isHelpModalOpen}
          onClose={handleCloseHelpModal}
        />
      )}
    </div>
  );
};

export default App;