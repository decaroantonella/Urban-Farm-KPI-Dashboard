# Dashboard de KPIs para Granjas Urbanas

## Descripción General

Esta aplicación es un dashboard interactivo diseñado para visualizar y configurar Indicadores Clave de Rendimiento (KPIs) para granjas urbanas, con un enfoque en métricas de sostenibilidad. Permite a los usuarios monitorear KPIs ambientales, sociales y técnico-operacionales, ver sus tendencias históricas, ajustar umbrales de rendimiento y comprender las fórmulas detrás de los cálculos. El objetivo es proporcionar una herramienta para el "Estudio del Impacto de las Granjas Urbanas en Ciudades Inteligentes", basado en el Proyecto Integrador para la obtención del Título de Grado Ingeniero Electrónico de la Universidad Nacional de Córdoba.

## Vista Previa del Dashboard (Demo)

![Demostración del Dashboard](assets/dashboard_demo.gif)


## Documentación y Tesis

Este proyecto fue desarrollado como parte de una tesis. Puedes encontrar el documento completo en formato PDF en el siguiente enlace:

📄 **[Descargar/Ver Proyecto Integrador sobre ESTUDIO DEL IMPACTO DE LAS GRANJAS URBANAS
EN CIUDADES INTELIGENTES MEDIANTE EL USO DE INDICADORES CLAVES DE DESEMPENO (KPI) (PDF)](docs/tesis_proyecto_dashboard.pdf)**

## Características Principales

*   **Visualización de KPIs:** Muestra KPIs base y KPIs compuestos con valores actuales, descripciones y estados de rendimiento codificados por colores.
*   **Tendencias Históricas:** Cada KPI (base y compuesto) presenta un gráfico de líneas mostrando su evolución temporal.
*   **Configuración de Umbrales:** Los usuarios pueden ajustar los umbrales (Óptimo, Aceptable, Requiere Atención) para cada KPI, lo que afecta dinámicamente su estado y las líneas de referencia en los gráficos.
*   **Carga de Datos CSV:** Permite a los usuarios cargar datos históricos para los KPIs base mediante un archivo CSV.
*   **Generación de Datos Aleatorios:** Opción para popular el dashboard con datos de ejemplo generados aleatoriamente.
*   **Filtrado por Fechas:** Los usuarios pueden seleccionar un rango de fechas para analizar las tendencias históricas en un período específico.
*   **Modales Interactivos:**
    *   **Fórmula:** Muestra la fórmula y explicación de cálculo para cada KPI.
    *   **Expandir:** Proporciona una vista detallada de un KPI, incluyendo un gráfico de tendencia más grande.
    *   **Ayuda CSV:** Guía sobre el formato correcto para la carga de archivos CSV.
*   **Diseño Responsivo:** Interfaz adaptable a diferentes tamaños de pantalla.
*   **Índices Compuestos:** Calcula y muestra cuatro índices compuestos clave:
    *   Índice de Sostenibilidad Ambiental (ISA)
    *   Índice de Impacto Social (IIS)
    *   Índice de Desarrollo Tecnológico (IDT)
    *   Índice Global de Desempeño (IGD) - destacado como el más importante.
*   **Categorización de KPIs:** Los KPIs base se agrupan en Sostenibilidad Ambiental, Impacto Social y Desarrollo Tecnológico y Operativo.

## Stack Tecnológico

*   **React:** Biblioteca de JavaScript para construir interfaces de usuario.
*   **TypeScript:** Superset de JavaScript que añade tipado estático.
*   **Tailwind CSS:** Framework de CSS "utility-first" para un diseño rápido y responsivo.
*   **Recharts:** Biblioteca de gráficos para React, utilizada para los gráficos de tendencias.
*   **ESM (ECMAScript Modules):** Uso de módulos nativos de JavaScript importados vía `esm.sh` en `index.html`.

## Estructura de Archivos

```
.
├── README.md                # Este archivo
├── index.html               # Punto de entrada HTML, carga de scripts y estilos
├── index.tsx                # Punto de entrada de la aplicación React, renderiza <App />
├── App.tsx                  # Componente principal, maneja el estado global y la lógica
├── constants.ts             # KPIs iniciales, funciones de generación de datos de ejemplo
├── types.ts                 # Definiciones de tipos y enumeraciones de TypeScript
├── metadata.json            # Metadatos de la aplicación
│
├── components/              # Componentes reutilizables de la UI
│   ├── Dashboard.tsx        # Layout principal del dashboard
│   ├── KpiCard.tsx          # Tarjeta para mostrar un KPI base
│   ├── CompositeKpiCard.tsx # Tarjeta para mostrar un KPI compuesto
│   ├── TrendChart.tsx       # Componente para el gráfico de tendencias
│   ├── FormulaModal.tsx     # Modal para mostrar fórmulas
│   ├── ExpandedKpiModal.tsx # Modal para la vista expandida de un KPI
│   ├── ThresholdConfigModal.tsx # Modal para configurar umbrales
│   ├── HelpModal.tsx        # Modal de ayuda para la carga de CSV
│   │
│   └── icons/               # Componentes de iconos SVG
│       ├── CarbonIcon.tsx
│       ├── CogIcon.tsx
│       ├── CommunityIcon.tsx
│       └── ... (otros iconos)
│
└── logic/                   # Lógica de negocio y cálculos
    ├── calculations.ts      # Funciones para calcular estados de KPIs, normalización y valores de índices compuestos
    └── formulas.ts          # Funciones para generar explicaciones de fórmulas y formatear valores
```

## KPIs y Métricas

### KPIs Base
Los KPIs base se dividen en tres categorías principales:

1.  **Sostenibilidad Ambiental:**
    *   `eua`: Uso Eficiente del Agua (Lts/Kg)
    *   `per`: Porcentaje de Energía Renovable (%)
    *   `irr`: Índice de Reciclaje y Valorización de Residuos (%)
    *   `iic`: Emisiones de Carbono (kgCO2eq/kg)
    *   `ics`: Salud del Suelo/Medio de Cultivo (%)
    *   `ira`: Reducción Uso Pesticidas/Fertilizantes (%)

2.  **Impacto Social:**
    *   `iaal`: Acceso a Alimentos Locales (% cobertura)
    *   `ipca`: Participación Comunitaria (% ocupación)
    *   `isac`: Seguridad Alimentaria y Calidad (% cumplimiento)

3.  **Desarrollo Tecnológico y Operativo:**
    *   `iitsf`: Inversión en Tecnologías Smart Farming (% anual)
    *   `esm`: Eficiencia Sistema de Monitoreo (% uptime)

Cada KPI base tiene un valor actual, datos históricos, umbrales configurables, una interpretación de valor (si más alto es mejor o más bajo es mejor) y un icono representativo.

### KPIs Compuestos
Estos índices se calculan a partir de los KPIs base normalizados:

1.  **ISA (Índice de Sostenibilidad Ambiental):**
    *   `ISA = 0.4 * EUA_norm + 0.3 * PER_norm + 0.3 * IRR_norm`
    *   Integra KPIs de impacto ambiental.

2.  **IIS (Índice de Impacto Social):**
    *   `IIS = 0.5 * IAAL_norm + 0.3 * IPCA_norm + 0.2 * ISAC_norm`
    *   Integra KPIs de beneficio social.

3.  **IDT (Índice de Desarrollo Tecnológico):**
    *   `IDT = 0.4 * IITSF_norm + 0.3 * ESM_norm + 0.3 * EAD_norm`
    *   (EAD_norm es un valor conceptual de Eficiencia en Análisis de Datos, fijado en 0.75).
    *   Evalúa la implementación tecnológica.

4.  **IGD (Índice Global de Desempeño):**
    *   `IGD = 0.35 * ISA + 0.35 * IIS + 0.30 * IDT`
    *   Proporciona una visión consolidada del rendimiento general de la granja urbana. Es el índice más destacado en el dashboard.

Los valores normalizados (`_norm`) de los KPIs base van de 0.25 (Crítico) a 1 (Óptimo), permitiendo su agregación ponderada en los índices compuestos.

## Configuración y Uso

### Carga de Datos (CSV)

1.  Haga clic en el botón "Cargar CSV".
2.  Seleccione un archivo `.csv` de su sistema.
3.  El formato del CSV debe ser:
    *   Cabecera (primera línea, ignorada): `kpi_id,date,value`
    *   Datos:
        *   `kpi_id`: Identificador del KPI (ej. `eua`).
        *   `date`: Fecha en formato `YYYY-MM-DD`.
        *   `value`: Valor numérico del KPI (usar `.` como separador decimal).
    *   Ejemplo:
        ```csv
        kpi_id,date,value
        eua,2024-01-01,3.5
        eua,2024-01-02,3.2
        per,2024-01-01,75.0
        ```
4.  Los datos cargados se añadirán (o actualizarán si la fecha ya existe para ese KPI) a los datos históricos.
5.  Un botón "Ayuda CSV" proporciona esta información en un modal.

### Generación de Datos Aleatorios

*   Haga clic en el botón "Generar Datos Aleatorios" para reemplazar los datos históricos actuales con un nuevo conjunto de datos de ejemplo para todos los KPIs base. Esto es útil para demostraciones rápidas.

### Configuración de Umbrales

1.  En cada tarjeta de KPI (base o compuesto), haga clic en el icono de engranaje (Configurar).
2.  Se abrirá un modal donde podrá ingresar los nuevos valores para los umbrales de rendimiento (Óptimo, Aceptable, Requiere Atención).
3.  Los campos mostrados se adaptan según si para ese KPI "más alto es mejor" o "más bajo es mejor". Los KPIs compuestos siempre son "más alto es mejor".
4.  Haga clic en "Guardar Cambios". Esto actualizará el estado del KPI y las líneas de referencia en su gráfico.

### Filtrado por Fechas

*   Utilice los selectores de "Fecha Inicio" y "Fecha Fin" en la parte superior del dashboard para filtrar los datos históricos mostrados en los gráficos de todos los KPIs.

### Visualización de Detalles y Fórmulas

*   **Fórmula:** Haga clic en el icono de documento en cualquier tarjeta de KPI para ver su fórmula de cálculo y una breve explicación.
*   **Expandir:** Haga clic en el icono de expandir en cualquier tarjeta de KPI para abrir una vista modal más grande con más detalles y un gráfico de tendencia ampliado.

## Flujo de Datos

El flujo de datos en la aplicación sigue un patrón unidireccional típico de React, gestionado principalmente en `App.tsx`. A continuación, se presenta un diagrama simplificado:

```mermaid
graph TD
    subgraph "User Interaction & Display"
        A[UI: Dashboard, Cards, Modals]
        G[TrendChart.tsx]
    end

    subgraph "Application Core"
        B["App.tsx
(State, Core Logic, Derived Data)"]
        C["constants.ts
(Initial KPIs)"]
        D["logic/calculations.ts
(Business Logic)"]
        H["Modal Components
(Formula, Config, Expand, Help)"]
    end

    subgraph "Display Components"
        E["Dashboard.tsx
(Layout & Prop Drilling)"]
        F["KPI Cards
(KpiCard/CompositeKpiCard)"]
    end

    %% Initialization
    C -- Initial KPI Data --> B;

    %% User Actions
    A -- "User Input/Events
(CSV Upload, Config KPI, Date Filters, Open Modals)" --> B;

    %% State Updates & Logic
    B -- "Updates State
(kpis, thresholds, dates)" --> B;
    B -- Uses Functions --> D;
    D -- Provides Calculation Logic --> B;
    B -- "Calculates Derived Data
(filteredKpis, compositeKpis)" --> B;

    %% Data Flow to UI
    B -- Passes Data & Handlers --> E;
    E -- Distributes Data & Handlers --> F;
    F -- Passes Data to --> G;
    G -- Renders Chart --> A;

    %% Modals
    B -- Controls & Passes Data to --> H;
    H -- "User Input from Modals
(e.g., Save Thresholds)" --> B;

    %% Visual Feedback (Implicitly through component rendering)
    F -- Displays KPI Info --> A;
    H -- Displays Modal Info --> A;
```

## Cómo Ejecutar

Esta es una aplicación frontend estática.
1.  Asegúrese de tener todos los archivos (`index.html`, `index.tsx`, `*.ts`, `*.tsx` en sus respectivas carpetas) en la misma estructura de directorios.
2.  Abra el archivo `index.html` directamente en un navegador web moderno que soporte módulos ES6 y las APIs utilizadas.
3.  Alternativamente, puede servir la carpeta raíz del proyecto usando un servidor web simple (ej. `npx serve .` o Live Server en VSCode).

No hay un proceso de compilación complejo involucrado ya que los imports de React/Recharts se manejan a través de `esm.sh` en el `index.html` y Tailwind CSS se incluye vía CDN.

## Notas Adicionales

*   La aplicación está diseñada para ser educativa y demostrativa, mostrando cómo se pueden rastrear y analizar métricas de sostenibilidad en el contexto de las granjas urbanas.
*   Las fórmulas y ponderaciones de los KPIs compuestos se basan en el proyecto de investigación mencionado.
*   La persistencia de los datos (KPIs, umbrales) es solo durante la sesión del navegador. Al recargar la página, se restablecerán los valores iniciales (a menos que se vuelvan a cargar datos desde CSV).

```