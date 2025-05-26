import React from 'react';
import { Kpi, CompositeKpi } from '../types';
import { normalizeKpiForComposite, calculateIsa, calculateIis, calculateIdt } from './calculations'; 

// Centralized function for formatting numbers with dot as decimal separator
export const formatValueForDisplay = (value: number | undefined, fractionDigits = 2): string => {
  if (value === undefined || isNaN(value)) return 'N/A';
  // Using 'en-US' locale ensures dot as decimal separator
  return value.toLocaleString('en-US', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
};


export const getKpiFormulaExplanation = (kpi: Kpi): React.ReactNode => {
  switch (kpi.id) {
    case 'eua':
      return React.createElement(React.Fragment, null,
        React.createElement("p", null,
          React.createElement("strong", null, "Fórmula:")
        ),
        React.createElement("p", { className: "italic" }, "EUA = Cantidad Total de Agua Utilizada (Lts) / Producción Total de Alimentos (Kg)"),
        React.createElement("p", { className: "mt-2" },
          React.createElement("strong", null, "Descripción:"),
          " ",
          kpi.description
        ),
        React.createElement("p", null, "Un valor más bajo indica mayor eficiencia.")
      );
    case 'per':
      return React.createElement(React.Fragment, null,
        React.createElement("p", null,
          React.createElement("strong", null, "Fórmula:")
        ),
        React.createElement("p", { className: "italic" }, "PER = (Energía de Fuentes Renovables (kWh) / Consumo Total de Energía (kWh)) * 100"),
        React.createElement("p", { className: "mt-2" },
          React.createElement("strong", null, "Descripción:"),
          " ",
          kpi.description
        ),
        React.createElement("p", null, "Un valor más alto indica mayor uso de energías limpias.")
      );
    case 'irr':
      return React.createElement(React.Fragment, null,
        React.createElement("p", null,
          React.createElement("strong", null, "Fórmula:")
        ),
        React.createElement("p", { className: "italic" }, "IRR = (Residuos Reciclados o Valorizados (Kg) / Total de Residuos Generados (Kg)) * 100"),
        React.createElement("p", { className: "mt-2" },
          React.createElement("strong", null, "Descripción:"),
          " ",
          kpi.description
        ),
        React.createElement("p", null, "Un valor más alto indica mejor gestión de residuos.")
      );
    case 'iic':
      return React.createElement(React.Fragment, null,
        React.createElement("p", null,
          React.createElement("strong", null, "Fórmula:")
        ),
        React.createElement("p", { className: "italic" }, "IIC = Emisiones Totales de CO₂eq (Kg) / Producción Total (Kg)"),
        React.createElement("p", { className: "mt-2" },
          React.createElement("strong", null, "Descripción:"),
          " ",
          kpi.description
        ),
        React.createElement("p", null, "Un valor más bajo indica menor impacto de carbono.")
      );
    case 'ics':
       return React.createElement(React.Fragment, null,
        React.createElement("p", null,
          React.createElement("strong", null, "Fórmula Conceptual:")
        ),
        React.createElement("p", { className: "italic" }, "ICS = (∑ Parámetros de suelo/sustrato dentro del rango óptimo / Total de parámetros medidos) * 100"),
        React.createElement("p", { className: "mt-2" },
          React.createElement("strong", null, "Descripción:"),
          " ",
          kpi.description
        ),
        React.createElement("p", null, "Un valor más alto indica mejor salud del medio de cultivo.")
      );
    case 'ira':
      return React.createElement(React.Fragment, null,
        React.createElement("p", null,
          React.createElement("strong", null, "Interpretación del Valor:")
        ),
        React.createElement("p", { className: "italic" },
          "El valor actual (", formatValueForDisplay(kpi.currentValue), "%) representa el porcentaje de reducción en el uso de agroquímicos en comparación con una línea base (ej. agricultura convencional o uso previo)."
        ),
        React.createElement("p", { className: "mt-2" },
          React.createElement("strong", null, "Descripción:"),
          " ",
          kpi.description
        ),
        React.createElement("p", null, "Un valor más alto indica una mayor reducción y es mejor.")
      );
    case 'iaal':
      return React.createElement(React.Fragment, null,
        React.createElement("p", null,
          React.createElement("strong", null, "Fórmula Conceptual:")
        ),
        React.createElement("p", { className: "italic" }, "IAAL = (Población con acceso a productos locales / Población total del área de influencia objetivo) * 100"),
        React.createElement("p", { className: "mt-2" },
          React.createElement("strong", null, "Descripción:"),
          " ",
          kpi.description,
          " Se considera un objetivo de 50 familias en un radio de 5km."
        ),
        React.createElement("p", null, "Un valor más alto indica mejor acceso para la comunidad.")
      );
    case 'ipca':
      return React.createElement(React.Fragment, null,
        React.createElement("p", null,
          React.createElement("strong", null, "Fórmula Conceptual:")
        ),
        React.createElement("p", { className: "italic" }, "IPCA = (Participantes activos en eventos / Capacidad total de participación en eventos) * 100"),
        React.createElement("p", { className: "mt-2" },
          React.createElement("strong", null, "Descripción:"),
          " ",
          kpi.description,
          " Para una capacidad de referencia de 20 personas por actividad."
        ),
        React.createElement("p", null, "Un valor más alto indica mayor participación.")
      );
    case 'isac':
      return React.createElement(React.Fragment, null,
        React.createElement("p", null,
          React.createElement("strong", null, "Fórmula Conceptual:")
        ),
        React.createElement("p", { className: "italic" }, "ISAC = (Lotes que cumplen estándares de inocuidad / Total de lotes producidos) * 100"),
        React.createElement("p", { className: "mt-2" },
          React.createElement("strong", null, "Descripción:"),
          " ",
          kpi.description
        ),
        React.createElement("p", null, "El objetivo es 100% de cumplimiento.")
      );
    case 'iitsf':
       return React.createElement(React.Fragment, null,
        React.createElement("p", null,
          React.createElement("strong", null, "Fórmula:")
        ),
        React.createElement("p", { className: "italic" }, "IITSF = (Inversión Anual en Tecnologías Smart Farming (€) / Presupuesto Operativo Anual Total (€)) * 100"),
        React.createElement("p", { className: "mt-2" },
          React.createElement("strong", null, "Descripción:"),
          " ",
          kpi.description
        ),
        React.createElement("p", null, "Un valor más alto indica mayor compromiso con la innovación tecnológica.")
      );
    case 'esm':
      return React.createElement(React.Fragment, null,
        React.createElement("p", null,
          React.createElement("strong", null, "Interpretación del Valor:")
        ),
        React.createElement("p", { className: "italic" },
          "El valor actual (", formatValueForDisplay(kpi.currentValue), "%) representa el porcentaje de tiempo de actividad (uptime) y la precisión general del sistema de monitoreo."
        ),
        React.createElement("p", { className: "mt-2" },
          React.createElement("strong", null, "Descripción:"),
          " ",
          kpi.description
        ),
        React.createElement("p", null, "Un valor más alto indica un sistema de monitoreo más fiable y efectivo.")
      );
    default:
      return React.createElement("p", null, kpi.description);
  }
};

export const getCompositeKpiFormulaExplanation = (ckpi: CompositeKpi, kpis: Kpi[]): React.ReactNode => {
  const getNormValueText = (id: string) => {
    const kpi = kpis.find(k => k.id === id);
    return kpi ? formatValueForDisplay(normalizeKpiForComposite(kpi)) : 'N/A';
  };

  switch (ckpi.id) {
    case 'isa':
      return React.createElement(React.Fragment, null,
        React.createElement("p", null,
          React.createElement("strong", null, "Fórmula:")
        ),
        React.createElement("p", { className: "italic" },
          "ISA = 0.4 * EUA", React.createElement("sub", null, "norm"), " + 0.3 * PER", React.createElement("sub", null, "norm"), " + 0.3 * IRR", React.createElement("sub", null, "norm")
        ),
        React.createElement("p", { className: "mt-2" }, "Donde:"),
        React.createElement("ul", { className: "list-disc list-inside ml-4" },
          React.createElement("li", null, "EUA", React.createElement("sub", null, "norm"), ": Uso Eficiente del Agua (normalizado) = ", getNormValueText('eua')),
          React.createElement("li", null, "PER", React.createElement("sub", null, "norm"), ": Porcentaje Energía Renovable (normalizado) = ", getNormValueText('per')),
          React.createElement("li", null, "IRR", React.createElement("sub", null, "norm"), ": Índice Reciclaje Residuos (normalizado) = ", getNormValueText('irr'))
        ),
        React.createElement("p", { className: "mt-2 text-xs" }, "Nota: Los valores normalizados (", React.createElement("sub", null, "norm"), ") van de 0.25 (Crítico) a 1 (Óptimo).")
      );
    case 'iis':
      return React.createElement(React.Fragment, null,
        React.createElement("p", null,
          React.createElement("strong", null, "Fórmula:")
        ),
        React.createElement("p", { className: "italic" },
          "IIS = 0.5 * IAAL", React.createElement("sub", null, "norm"), " + 0.3 * IPCA", React.createElement("sub", null, "norm"), " + 0.2 * ISAC", React.createElement("sub", null, "norm")
        ),
        React.createElement("p", { className: "mt-2" }, "Donde:"),
        React.createElement("ul", { className: "list-disc list-inside ml-4" },
          React.createElement("li", null, "IAAL", React.createElement("sub", null, "norm"), ": Acceso Alimentos Locales (normalizado) = ", getNormValueText('iaal')),
          React.createElement("li", null, "IPCA", React.createElement("sub", null, "norm"), ": Participación Comunitaria (normalizado) = ", getNormValueText('ipca')),
          React.createElement("li", null, "ISAC", React.createElement("sub", null, "norm"), ": Seguridad Alimentaria y Calidad (normalizado) = ", getNormValueText('isac'))
        ),
        React.createElement("p", { className: "mt-2 text-xs" }, "Nota: Los valores normalizados (", React.createElement("sub", null, "norm"), ") van de 0.25 (Crítico) a 1 (Óptimo).")
      );
    case 'idt':
      return React.createElement(React.Fragment, null,
        React.createElement("p", null,
          React.createElement("strong", null, "Fórmula:")
        ),
        React.createElement("p", { className: "italic" },
          "IDT = 0.4 * IITSF", React.createElement("sub", null, "norm"), " + 0.3 * ESM", React.createElement("sub", null, "norm"), " + 0.3 * EAD", React.createElement("sub", null, "norm")
        ),
        React.createElement("p", { className: "mt-2" }, "Donde:"),
        React.createElement("ul", { className: "list-disc list-inside ml-4" },
          React.createElement("li", null, "IITSF", React.createElement("sub", null, "norm"), ": Inversión Tecnologías Smart Farming (normalizado) = ", getNormValueText('iitsf')),
          React.createElement("li", null, "ESM", React.createElement("sub", null, "norm"), ": Eficiencia Sistema Monitoreo (normalizado) = ", getNormValueText('esm')),
          React.createElement("li", null, "EAD", React.createElement("sub", null, "norm"), ": Eficiencia en Análisis de Datos (valor conceptual = 0.75)")
        ),
        React.createElement("p", { className: "mt-2 text-xs" }, "Nota: Los valores normalizados (", React.createElement("sub", null, "norm"), ") van de 0.25 (Crítico) a 1 (Óptimo). EAD", React.createElement("sub", null, "norm"), " es un valor conceptual según Cap. 10.")
      );
    case 'igd':
      const isaValue = calculateIsa(kpis);
      const iisValue = calculateIis(kpis);
      const idtValue = calculateIdt(kpis);
      
      return React.createElement(React.Fragment, null,
        React.createElement("p", null,
          React.createElement("strong", null, "Fórmula:")
        ),
        React.createElement("p", { className: "italic" },
          "IGD = 0.35 * ISA + 0.35 * IIS + 0.30 * IDT"
        ),
        React.createElement("p", { className: "mt-2" }, "Donde:"),
        React.createElement("ul", { className: "list-disc list-inside ml-4" },
          React.createElement("li", null, "ISA (Índice de Sostenibilidad Ambiental) = ", formatValueForDisplay(isaValue)),
          React.createElement("li", null, "IIS (Índice de Impacto Social) = ", formatValueForDisplay(iisValue)),
          React.createElement("li", null, "IDT (Índice de Desarrollo Tecnológico) = ", formatValueForDisplay(idtValue))
        ),
        React.createElement("p", { className: "mt-2" }, "Los valores de ISA, IIS, e IDT son calculados a partir de los KPIs base y sus valores normalizados.")
      );
    default:
      return React.createElement("p", null, ckpi.description);
  }
};
