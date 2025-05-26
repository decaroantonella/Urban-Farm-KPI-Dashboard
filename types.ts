
// FIX: Import React to ensure consistent type resolution for React.FC and React.SVGProps.
import React from 'react';

export interface HistoricalDataPoint {
  date: string; // Ideally should be a proper date format, e.g., 'YYYY-MM-DD'
  value: number;
}

export enum KpiStatus {
  Optimal = "ÓPTIMO",
  Acceptable = "ACEPTABLE",
  Attention = "REQUIERE ATENCIÓN",
  Critical = "CRÍTICO",
  DataUnavailable = "DATA UNAVAILABLE", // Added for clarity, though not explicitly returned by getKpiStatusDetails yet
}

export enum CompositeKpiStatus {
  Excellent = "EXCELENTE",
  Good = "BUENO",
  Regular = "REGULAR",
  Deficient = "DEFICIENTE",
}

export interface KpiThresholds {
  // For higherIsBetter KPIs
  optimalMin?: number;
  acceptableMin?: number;
  attentionMin?: number;

  // For lowerIsBetter KPIs
  optimalMax?: number;
  acceptableMax?: number;
  attentionMax?: number;
  
  // For percentage-based compliance (e.g. ISAC)
  optimalPercentage?: number;
  acceptablePercentage?: number;
  attentionPercentage?: number;
}

export interface Kpi {
  id: string;
  name: string;
  description: string;
  unit: string;
  currentValue: number; // This will represent the latest value for a base KPI
  historicalData: HistoricalDataPoint[];
  thresholds: KpiThresholds;
  valueInterpretation: 'lowerIsBetter' | 'higherIsBetter' | 'percentage';
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  category: 'environmental' | 'social' | 'technological_operational';
}

export interface CompositeKpi {
  id: string;
  name: string;
  value: number; // This will be the latest value from its historicalData or calculated overall
  status: CompositeKpiStatus;
  description: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>; // Icon is now part of the interface
  historicalData: HistoricalDataPoint[];
  unit: string; // e.g., "Índice" or ""
  thresholds: KpiThresholds; // For chart display, e.g., { optimalMin: 0.85, ... }
  valueInterpretation: 'higherIsBetter'; // Composite KPIs are always higher is better for charting
}