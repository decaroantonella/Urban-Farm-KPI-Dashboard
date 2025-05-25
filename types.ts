export type KpiId =
  | 'EUA' | 'PER' | 'IRR' | 'IIC' // Ambiental
  | 'AAL' | 'IPCA' | 'ISAC'      // Social
  | 'ICS' | 'IITSF' | 'IRA' | 'ESM' | 'EAD'; // Tecnológico

export interface KpiRange {
  threshold: number;
  level: string;
  colorClass: string;
  message: string;
  score: number;
}

export interface BaseDefinition {
  id: string;
  name: string;
  description: string;
  ranges: KpiRange[];
  isLowerBetter?: boolean;
  unit?: string;
  targetValueMessage?: string;
  icon?: React.ReactNode; // Added icon property
}

export interface KpiDefinition extends BaseDefinition {
  id: KpiId;
  inputs?: Array<{ key: keyof KpiInputValues; label: string; unit?: string, type?: 'number' | 'percentage' }>;
  calculate?: (inputs: KpiInputValues) => number;
  directInputKey?: keyof KpiDirectInputValues;
}

export interface CompositeIndexDefinition extends BaseDefinition {
  id: 'ISA' | 'IIS' | 'IDT' | 'IGD';
  calculate: (scores: Partial<Record<string, number>>) => number;
}

export interface KpiInputValues {
  // EUA
  aguaUtilizadaTotal?: number;
  produccionTotal?: number;
  // PER
  energiaRenovableGenerada?: number;
  energiaConsumoTotal?: number;
  // IRR
  residuosReciclados?: number;
  residuosGeneradosTotal?: number;
  // IIC (uses produccionTotal from EUA)
  emisionesCO2Eq?: number;
  // AAL
  poblacionConAccesoLocal?: number;
  poblacionTotalAreaInfluencia?: number;
  // IPCA
  participantesActivosMensuales?: number;
  capacidadTotalParticipacion?: number;
  // ICS
  parametrosSueloOptimos?: number;
  parametrosSueloMedidosTotal?: number;
  // IITSF
  inversionTecnologiasSmart?: number;
  presupuestoOperativoAnual?: number;
  // IRA
  usoActualAgroquimicos?: number;
  usoBaseAgroquimicos?: number;
  // ISAC
  lotesCumplenEstandares?: number;
  lotesProducidosTotal?: number;
  // Direct Inputs
  disponibilidadSistemaMonitoreo?: number;
  eficienciaAnalisisDatos?: number;
}

export type KpiDirectInputValues = Pick<KpiInputValues, 'disponibilidadSistemaMonitoreo' | 'eficienciaAnalisisDatos'>;

export interface KpiEvaluationInput {
  [key: string]: number | undefined;
}

export interface KpiStatus {
  level: string;
  colorClass: string;
  message: string;
}

export interface KpiResult extends KpiStatus {
  value: number;
  score: number;
  unit?: string;
}

export interface CompositeIndexResult extends KpiStatus {
  value: number;
  score: number;
}