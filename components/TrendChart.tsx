import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { HistoricalDataPoint, KpiThresholds, Kpi } from '../types';
import { formatValueForDisplay } from '../logic/formulas';

interface TrendChartProps {
  data: HistoricalDataPoint[];
  unit: string;
  thresholds: KpiThresholds;
  valueInterpretation: Kpi['valueInterpretation'];
  isExpanded?: boolean; // Optional prop for styling expanded chart
}

const TrendChart: React.FC<TrendChartProps> = ({ data, unit, thresholds, valueInterpretation, isExpanded = false }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-sm text-slate-400">No historical data available.</div>;
  }

  const dataValues = data.map(p => p.value);
  let minY = Math.min(...dataValues);
  let maxY = Math.max(...dataValues);

  const thresholdLines: JSX.Element[] = [];
  const labelFontSize = isExpanded ? 11 : 9;
  const labelOffset = isExpanded ? 5 : 0;


  if (valueInterpretation === 'higherIsBetter' || valueInterpretation === 'percentage') {
    const optimalKey = valueInterpretation === 'percentage' ? 'optimalPercentage' : 'optimalMin';
    const acceptableKey = valueInterpretation === 'percentage' ? 'acceptablePercentage' : 'acceptableMin';
    const attentionKey = valueInterpretation === 'percentage' ? 'attentionPercentage' : 'attentionMin';

    if (thresholds[optimalKey] !== undefined) {
      thresholdLines.push(<ReferenceLine key="optimal" y={thresholds[optimalKey]} label={{ value: "Óptimo", fontSize: labelFontSize, fill: '#10B981', position: 'insideTopRight', dy: -labelOffset }} stroke="#10B981" strokeDasharray="3 3" />);
      maxY = Math.max(maxY, thresholds[optimalKey]!);
      minY = Math.min(minY, thresholds[optimalKey]!);
    }
    if (thresholds[acceptableKey] !== undefined) {
      thresholdLines.push(<ReferenceLine key="acceptable" y={thresholds[acceptableKey]} label={{ value: "Aceptable", fontSize: labelFontSize, fill: '#F59E0B', position: 'insideTopRight', dy: labelOffset*2 }} stroke="#F59E0B" strokeDasharray="3 3" />);
      maxY = Math.max(maxY, thresholds[acceptableKey]!);
      minY = Math.min(minY, thresholds[acceptableKey]!);
    }
    if (thresholds[attentionKey] !== undefined) {
      thresholdLines.push(<ReferenceLine key="attention" y={thresholds[attentionKey]} label={{ value: "Atención", fontSize: labelFontSize, fill: '#EF4444', position: 'insideTopRight', dy: labelOffset*3 }} stroke="#EF4444" strokeDasharray="3 3" />);
      maxY = Math.max(maxY, thresholds[attentionKey]!);
      minY = Math.min(minY, thresholds[attentionKey]!);
    }
  } else { // lowerIsBetter
    if (thresholds.optimalMax !== undefined) {
      thresholdLines.push(<ReferenceLine key="optimal" y={thresholds.optimalMax} label={{ value: "Óptimo", fontSize: labelFontSize, fill: '#10B981', position: 'insideTopRight', dy: -labelOffset }} stroke="#10B981" strokeDasharray="3 3" />);
      maxY = Math.max(maxY, thresholds.optimalMax);
      minY = Math.min(minY, thresholds.optimalMax);
    }
    if (thresholds.acceptableMax !== undefined) {
      thresholdLines.push(<ReferenceLine key="acceptable" y={thresholds.acceptableMax} label={{ value: "Aceptable", fontSize: labelFontSize, fill: '#F59E0B', position: 'insideTopRight', dy: labelOffset*2 }} stroke="#F59E0B" strokeDasharray="3 3" />);
      maxY = Math.max(maxY, thresholds.acceptableMax);
      minY = Math.min(minY, thresholds.acceptableMax);
    }
    if (thresholds.attentionMax !== undefined) {
      thresholdLines.push(<ReferenceLine key="attention" y={thresholds.attentionMax} label={{ value: "Atención", fontSize: labelFontSize, fill: '#EF4444', position: 'insideTopRight', dy: labelOffset*3 }} stroke="#EF4444" strokeDasharray="3 3" />);
      maxY = Math.max(maxY, thresholds.attentionMax);
      minY = Math.min(minY, thresholds.attentionMax);
    }
  }
  
  const yAxisPadding = (maxY - minY) * 0.1 || 1; // Ensure padding isn't 0 if min=max
  const domainMin = Math.max(0, minY - yAxisPadding);
  const domainMax = maxY + yAxisPadding;


  return (
    <div className={isExpanded ? "h-96 w-full mt-4" : "h-40 w-full mt-4"}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: isExpanded ? 40: 30, left: isExpanded ? 0 : -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(tick) => new Date(tick).toLocaleDateString('es-AR', { month: 'short', day: 'numeric', year: isExpanded ? 'numeric': undefined })}
            fontSize={isExpanded ? 11 : 10}
            stroke="rgb(100 116 139)" // slate-500
          />
          <YAxis 
            fontSize={isExpanded ? 11 : 10}
            stroke="rgb(100 116 139)" // slate-500
            label={{ value: unit, angle: -90, position: 'insideLeft', offset: isExpanded ? 20: 10, fontSize: isExpanded ? 11: 10, fill: 'rgb(100 116 139)' }}
            domain={[domainMin, domainMax]}
            allowDataOverflow={true}
            tickFormatter={(tick) => formatValueForDisplay(tick)}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgb(51 65 85)', borderRadius: '0.25rem', outline: 'none' }}
            labelStyle={{ color: 'rgb(203 213 225)', fontSize: isExpanded ? '0.85rem':'0.75rem' }} // slate-300
            itemStyle={{ color: 'rgb(148 163 184)', fontSize: isExpanded ? '0.85rem':'0.75rem' }} // slate-400
            formatter={(value: number) => [formatValueForDisplay(value), 'Valor']}
          />
          {thresholdLines}
          <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} name="Valor" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
