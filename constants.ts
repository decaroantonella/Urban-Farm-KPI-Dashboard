

import { Kpi, HistoricalDataPoint } from './types';
import { WaterDropIcon } from './components/icons/WaterDropIcon';
import { EnergyIcon } from './components/icons/EnergyIcon';
import { RecycleIcon } from './components/icons/RecycleIcon';
import { CarbonIcon } from './components/icons/CarbonIcon';
import { FoodAccessIcon } from './components/icons/FoodAccessIcon';
import { CommunityIcon } from './components/icons/CommunityIcon';
import { SoilHealthIcon } from './components/icons/SoilHealthIcon';
import { TechInvestmentIcon } from './components/icons/TechInvestmentIcon';
import { PesticideReductionIcon } from './components/icons/PesticideReductionIcon';
import { FoodSafetyIcon } from './components/icons/FoodSafetyIcon';
// FIX: Import CogIcon
import { CogIcon } from './components/icons/CogIcon';

const generateHistoricalData = (baseValue: number, points: number, variation: number, trend: 'up' | 'down' | 'stable', positiveOnly: boolean = true): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  let currentValue = baseValue;
  for (let i = 0; i < points; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (points - 1 - i));
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(currentValue.toFixed(2)),
    });
    let change = (Math.random() - 0.5) * variation;
    if (trend === 'up') currentValue += Math.abs(change);
    else if (trend === 'down') currentValue -= Math.abs(change);
    else currentValue += change;
    
    if (positiveOnly && currentValue < 0) currentValue = 0;
  }
  return data;
};


export const INITIAL_KPIS: Kpi[] = [
  // Environmental KPIs
  {
    id: 'eua',
    name: 'Uso Eficiente del Agua',
    description: 'Mide la cantidad de agua utilizada por kg de producto.',
    unit: 'Lts/Kg',
    currentValue: 2.8,
    historicalData: generateHistoricalData(3.5, 30, 0.5, 'down'),
    thresholds: { 
      optimalMax: 2,
      acceptableMax: 3,
      attentionMax: 4,
    },
    valueInterpretation: 'lowerIsBetter',
    // FIX: Applied type assertion for icon
    icon: WaterDropIcon as React.FC<React.SVGProps<SVGSVGElement>>,
    category: 'environmental',
  },
  {
    id: 'per',
    name: 'Porcentaje de Energía Renovable',
    description: 'Mide la proporción de energía renovable utilizada.',
    unit: '%',
    currentValue: 85,
    historicalData: generateHistoricalData(75, 30, 5, 'up'),
    thresholds: { 
      optimalMin: 95,
      acceptableMin: 80,
      attentionMin: 60,
    },
    valueInterpretation: 'higherIsBetter',
    // FIX: Applied type assertion for icon
    icon: EnergyIcon as React.FC<React.SVGProps<SVGSVGElement>>,
    category: 'environmental',
  },
  {
    id: 'irr',
    name: 'Índice de Reciclaje y Valorización de Residuos',
    description: 'Mide la eficiencia en la gestión de residuos y su valorización.',
    unit: '%',
    currentValue: 92,
    historicalData: generateHistoricalData(80, 30, 3, 'up'),
    thresholds: { 
      optimalMin: 95,
      acceptableMin: 85,
      attentionMin: 70,
    },
    valueInterpretation: 'higherIsBetter',
    // FIX: Applied type assertion for icon
    icon: RecycleIcon as React.FC<React.SVGProps<SVGSVGElement>>,
    category: 'environmental',
  },
  {
    id: 'iic',
    name: 'Emisiones de Carbono',
    description: 'Emisiones de CO2eq por kg de producto.',
    unit: 'kgCO2eq/kg',
    currentValue: 0.8,
    historicalData: generateHistoricalData(1.2, 30, 0.1, 'down'),
    thresholds: {
      optimalMax: 0.5,
      acceptableMax: 1.0,
      attentionMax: 1.5,
    },
    valueInterpretation: 'lowerIsBetter',
    // FIX: Applied type assertion for icon
    icon: CarbonIcon as React.FC<React.SVGProps<SVGSVGElement>>,
    category: 'environmental',
  },
   {
    id: 'ics',
    name: 'Salud del Suelo/Medio de Cultivo',
    description: 'Porcentaje de parámetros de salud del suelo/sustrato en rangos óptimos.',
    unit: '%',
    currentValue: 90,
    historicalData: generateHistoricalData(82, 30, 2, 'up'),
    thresholds: {
      optimalMin: 95, // Chapter 10: 95-100%
      acceptableMin: 85, // Chapter 10: 85-95%
      attentionMin: 75, // Chapter 10: 75-85%
    },
    valueInterpretation: 'higherIsBetter',
    // FIX: Applied type assertion for icon
    icon: SoilHealthIcon as React.FC<React.SVGProps<SVGSVGElement>>,
    category: 'environmental',
  },
  {
    id: 'ira',
    name: 'Reducción Uso Pesticidas/Fertilizantes',
    description: 'Porcentaje de reducción en el uso de agroquímicos vs. agricultura convencional o línea base.',
    unit: '%',
    currentValue: 85, // Aiming for optimal
    historicalData: generateHistoricalData(70, 30, 5, 'up'),
    thresholds: {
      optimalMin: 80,
      acceptableMin: 60,
      attentionMin: 40,
    },
    valueInterpretation: 'higherIsBetter',
    // FIX: Applied type assertion for icon
    icon: PesticideReductionIcon as React.FC<React.SVGProps<SVGSVGElement>>,
    category: 'environmental',
  },
  // Social KPIs
  {
    id: 'iaal',
    name: 'Acceso a Alimentos Locales',
    description: 'Cobertura de familias en radio de 5km.',
    unit: '% (50 fam)',
    currentValue: 75,
    historicalData: generateHistoricalData(65, 30, 3, 'up'),
    thresholds: {
      optimalMin: 80,
      acceptableMin: 60,
      attentionMin: 40,
    },
    valueInterpretation: 'higherIsBetter',
    // FIX: Applied type assertion for icon
    icon: FoodAccessIcon as React.FC<React.SVGProps<SVGSVGElement>>,
    category: 'social',
  },
  {
    id: 'ipca',
    name: 'Participación Comunitaria',
    description: 'Nivel de involucramiento y participación de la comunidad local.',
    unit: '% ocupación', // (para capacidad de 20 personas/actividad)
    currentValue: 80,
    historicalData: generateHistoricalData(70, 30, 4, 'up'),
    thresholds: {
      optimalMin: 90,
      acceptableMin: 70,
      attentionMin: 50,
    },
    valueInterpretation: 'higherIsBetter',
    // FIX: Applied type assertion for icon
    icon: CommunityIcon as React.FC<React.SVGProps<SVGSVGElement>>,
    category: 'social',
  },
  {
    id: 'isac',
    name: 'Seguridad Alimentaria y Calidad',
    description: 'Cumplimiento de estándares de inocuidad alimentaria.',
    unit: '% cumplimiento',
    currentValue: 98, // Aiming for acceptable/optimal
    historicalData: generateHistoricalData(96, 30, 1, 'up'),
     thresholds: { // Using new percentage type for clarity
      optimalPercentage: 100, // Chapter 10: 100%
      acceptablePercentage: 95, // Chapter 10: 95-99%
      attentionPercentage: 90, // Chapter 10: 90-95%
    },
    valueInterpretation: 'percentage', // Special case, 100% is optimal, lower is worse.
    // FIX: Applied type assertion for icon
    icon: FoodSafetyIcon as React.FC<React.SVGProps<SVGSVGElement>>,
    category: 'social',
  },
  // Technological & Operational KPIs
  {
    id: 'iitsf',
    name: 'Inversión en Tecnologías Smart Farming',
    description: 'Porcentaje del presupuesto operativo anual invertido en tecnologías inteligentes.',
    unit: '% anual',
    currentValue: 18,
    historicalData: generateHistoricalData(12, 30, 1, 'up'),
    thresholds: {
      optimalMin: 20,
      acceptableMin: 15,
      attentionMin: 10,
    },
    valueInterpretation: 'higherIsBetter',
    // FIX: Applied type assertion for icon
    icon: TechInvestmentIcon as React.FC<React.SVGProps<SVGSVGElement>>,
    category: 'technological_operational',
  },
  // ESM - Eficiencia del Sistema de Monitoreo is more qualitative or based on uptime,
  // For simplicity, we'll represent it as a % uptime.
  {
    id: 'esm',
    name: 'Eficiencia Sistema de Monitoreo',
    description: 'Disponibilidad y precisión del sistema de monitoreo.',
    unit: '% uptime',
    currentValue: 99.5,
    historicalData: generateHistoricalData(98, 30, 0.2, 'up'),
     thresholds: {
      optimalMin: 99,
      acceptableMin: 95,
      attentionMin: 90,
    },
    valueInterpretation: 'higherIsBetter',
    // FIX: Applied type assertion for icon
    icon: CogIcon as React.FC<React.SVGProps<SVGSVGElement>>, // Placeholder, could be a server/data icon
    category: 'technological_operational',
  }
];