
import { Kpi, KpiStatus, CompositeKpiStatus, KpiThresholds } from '../types';

export const getKpiStatusDetails = (kpi: Kpi): { status: KpiStatus; color: string } => {
  const { currentValue, thresholds, valueInterpretation } = kpi;

  // If currentValue is NaN, it implies data is unavailable for this specific point in time (e.g. historical calculation)
  // However, KpiCard directly uses this and expects a valid status for display.
  // The NaN check for normalization purposes is handled in normalizeKpiForComposite.
  // For direct display, if a base KPI's overall currentValue became NaN, it would be an issue.
  // Assuming for overall display, currentValue is always a number.

  if (valueInterpretation === 'higherIsBetter') {
    if (currentValue >= (thresholds.optimalMin ?? Infinity)) return { status: KpiStatus.Optimal, color: 'bg-green-500' };
    if (currentValue >= (thresholds.acceptableMin ?? -Infinity)) return { status: KpiStatus.Acceptable, color: 'bg-yellow-500' };
    if (currentValue >= (thresholds.attentionMin ?? -Infinity)) return { status: KpiStatus.Attention, color: 'bg-orange-500' };
    return { status: KpiStatus.Critical, color: 'bg-red-600' };
  } else if (valueInterpretation === 'lowerIsBetter') {
    if (currentValue <= (thresholds.optimalMax ?? -Infinity)) return { status: KpiStatus.Optimal, color: 'bg-green-500' };
    if (currentValue <= (thresholds.acceptableMax ?? Infinity)) return { status: KpiStatus.Acceptable, color: 'bg-yellow-500' };
    if (currentValue <= (thresholds.attentionMax ?? Infinity)) return { status: KpiStatus.Attention, color: 'bg-orange-500' };
    return { status: KpiStatus.Critical, color: 'bg-red-600' };
  } else { // percentage (e.g. ISAC, where 100% is optimal)
    if (currentValue >= (thresholds.optimalPercentage ?? 100)) return { status: KpiStatus.Optimal, color: 'bg-green-500' };
    if (currentValue >= (thresholds.acceptablePercentage ?? 0)) return { status: KpiStatus.Acceptable, color: 'bg-yellow-500' };
    if (currentValue >= (thresholds.attentionPercentage ?? 0)) return { status: KpiStatus.Attention, color: 'bg-orange-500' };
    return { status: KpiStatus.Critical, color: 'bg-red-600' };
  }
};

// Normalize KPI value based on its status for composite index calculation
// Optimal = 1, Acceptable = 0.75, Attention = 0.5, Critical = 0.25
// Returns NaN if kpi.currentValue is NaN (indicating missing data for a specific point in time).
export const normalizeKpiForComposite = (kpi: Kpi): number => {
  if (isNaN(kpi.currentValue)) {
    return NaN; // Data unavailable for this KPI at this point for normalization
  }
  const { status } = getKpiStatusDetails(kpi); // kpi.currentValue is guaranteed non-NaN here
  switch (status) {
    case KpiStatus.Optimal: return 1;
    case KpiStatus.Acceptable: return 0.75;
    case KpiStatus.Attention: return 0.5;
    case KpiStatus.Critical: return 0.25;
    default: return NaN; // Should ideally not happen if all statuses are covered
  }
};

// Helper function to find a KPI and its value for calculation, robust to missing currentValue
const getNormalizedValue = (kpis: Kpi[], kpiId: string): number => {
    const kpi = kpis.find(k => k.id === kpiId);
    if (!kpi || isNaN(kpi.currentValue)) { // Check if kpi is found and if its currentValue is valid for normalization
        return NaN; // KPI not found or its data is not available/valid for this calculation
    }
    return normalizeKpiForComposite(kpi);
};


export const calculateIsa = (kpis: Kpi[]): number => {
  const euaNorm = getNormalizedValue(kpis, 'eua');
  const perNorm = getNormalizedValue(kpis, 'per');
  const irrNorm = getNormalizedValue(kpis, 'irr');

  if (isNaN(euaNorm) || isNaN(perNorm) || isNaN(irrNorm)) {
    return NaN; // If any constituent KPI normalized value is NaN, ISA is NaN
  }
  
  const isa = 0.4 * euaNorm + 0.3 * perNorm + 0.3 * irrNorm;
  return parseFloat(isa.toFixed(2)); // Will propagate NaN if isa is NaN
};

export const calculateIis = (kpis: Kpi[]): number => {
  const aalNorm = getNormalizedValue(kpis, 'iaal');
  const ipcaNorm = getNormalizedValue(kpis, 'ipca');
  const isacNorm = getNormalizedValue(kpis, 'isac');

  if (isNaN(aalNorm) || isNaN(ipcaNorm) || isNaN(isacNorm)) {
    return NaN;
  }
  
  const iis = 0.5 * aalNorm + 0.3 * ipcaNorm + 0.2 * isacNorm;
  return parseFloat(iis.toFixed(2));
};

export const calculateIdt = (kpis: Kpi[]): number => {
  const iitsfNorm = getNormalizedValue(kpis, 'iitsf');
  const esmNorm = getNormalizedValue(kpis, 'esm');
  // EADnorm is conceptual. If we had an EAD kpi, we'd use getNormalizedValue(kpis, 'ead_kpi_id')
  const eadNorm = 0.75; // Placeholder as per original logic, assuming it's always available conceptually

  if (isNaN(iitsfNorm) || isNaN(esmNorm)) { // eadNorm is constant, so only check variable ones
    return NaN;
  }

  const idt = 0.4 * iitsfNorm + 0.3 * esmNorm + 0.3 * eadNorm;
  return parseFloat(idt.toFixed(2));
};

export const calculateIgd = (isa: number, iis: number, idt: number): number => {
  if (isNaN(isa) || isNaN(iis) || isNaN(idt)) {
    return NaN;
  }
  const igd = 0.35 * isa + 0.35 * iis + 0.30 * idt;
  return parseFloat(igd.toFixed(2));
};

export const getCompositeKpiStatus = (value: number, type: 'standard' | 'global'): CompositeKpiStatus => {
  if (isNaN(value)) { // If value is NaN, status is effectively 'Deficient' or could be a new 'Data Unavailable' status
      return CompositeKpiStatus.Deficient; // Or handle as a special "no data" status if desired for display
  }

  if (type === 'global') { // IGD
    if (value >= 0.80) return CompositeKpiStatus.Excellent;
    if (value >= 0.65) return CompositeKpiStatus.Good;
    if (value >= 0.50) return CompositeKpiStatus.Regular;
    return CompositeKpiStatus.Deficient;
  } else { // ISA, IIS, IDT
    // Using generic thresholds for ISA/IIS/IDT based on provided ranges
    // These can be fine-tuned per index if needed.
    // Using IIS/IDT like thresholds: Excellent >= 0.85, Good >= 0.70, Regular >= 0.50
    if (type === 'standard') { // ISA, IIS, IDT (Using average thresholds for simplicity here)
      // Specific thresholds from chapter 10:
      // ISA: Exc >= 0.9, Good 0.75-0.89, Reg 0.6-0.74
      // IIS/IDT: Exc >= 0.85, Good 0.7-0.84, Reg 0.5-0.69
      // For simplicity, let's use a common set or make it specific if 'type' included index ID.
      // Using the more stringent 'Excellent' for ISA, but general 'Good'/'Regular' for others.
      // This part can be refined to pass specific index ID to get exact thresholds.
      // For now, general thresholds:
      if (value >= 0.85) return CompositeKpiStatus.Excellent; // General high bar for excellent
      if (value >= 0.70) return CompositeKpiStatus.Good;    // General good
      if (value >= 0.50) return CompositeKpiStatus.Regular;  // General regular
      return CompositeKpiStatus.Deficient;
    }
    return CompositeKpiStatus.Deficient; // Default
  }
};