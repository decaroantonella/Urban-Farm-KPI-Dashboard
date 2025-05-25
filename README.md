
# Urban Farm KPI Dashboard

## 1. Project Overview

The Urban Farm KPI Dashboard is a web application designed to visualize Key Performance Indicators (KPIs) for an intelligent urban farm. It allows users to input data related to various operational aspects of the farm and dynamically displays the performance levels, alerts, and insights based on predefined thresholds and calculation logic. The dashboard also calculates and displays composite indices to provide a holistic view of the farm's sustainability, social impact, and technological development.

**Key Features:**

*   **Dynamic KPI Calculation:** Real-time calculation of KPIs based on user inputs.
*   **Visual Feedback:** Color-coded status indicators, icons, and progress bars for intuitive understanding of performance.
*   **Composite Indices:** Aggregation of individual KPIs into higher-level indices (Environmental Sustainability, Social Impact, Technological Development, Global Performance).
*   **Interactive Data Input:** Easy-to-use input fields for each relevant metric.
*   **Initial Prototype Data:** Pre-filled with data representing a "Unidad de Trabajo" prototype for immediate visualization.
*   **Responsive Design:** Adapts to different screen sizes.
*   **Dark Mode:** Toggle between light and dark themes for user comfort.
*   **User-Friendly Interface:** Enhanced with icons and clear visual hierarchy.

**Target Audience:**

*   Urban farm operators and managers.
*   Researchers and students in agriculture, sustainability, and smart city development.
*   Stakeholders interested in the performance and impact of urban farming initiatives.

## 2. Data Flow

The data flow within the Urban Farm KPI Dashboard is designed to be reactive, updating visualizations and calculations automatically as users modify input values.

```mermaid
graph TD
    A[User Input in KpiCard] --onChange--> B(handleInputChange in App.tsx);
    B --updates--> C{inputValues State};
    C --triggers useEffect in App.tsx--> D{KPI Calculation Loop};
    D --uses KPI_DEFINITIONS & inputValues--> E[Individual KPI Values & Scores];
    E --evaluateKpi()--> F[KPI Results (value, level, message, score)];
    F --updates--> G{kpiResults State};
    G --data for--> H[Render KpiCard for KPIs];

    D --prepares kpiScoresForComposites--> I{Composite Index Calculation - Stage 1 (ISA, IIS, IDT)};
    I --uses COMPOSITE_INDEX_DEFINITIONS & kpiScoresForComposites & scoresForIdt--> J[ISA, IIS, IDT Values & Scores];
    J --evaluateCompositeIndex()--> K[ISA, IIS, IDT Results];
    K --updates partial--> L{compositeIndexResults State};

    J --prepares computedCompositeScores--> M{Composite Index Calculation - Stage 2 (IGD)};
    M --uses COMPOSITE_INDEX_DEFINITIONS & computedCompositeScores--> N[IGD Value & Score];
    N --evaluateCompositeIndex()--> O[IGD Result];
    O --updates final--> L;
    L --data for--> P[Render KpiCard for Composite Indices];
```

**Detailed Steps:**

1.  **User Input:**
    *   The user interacts with input fields within individual `KpiCard` components.
    *   When an input value changes, the `onInputChange` callback (passed from `App.tsx`) is triggered.

2.  **State Update (Input Values):**
    *   `App.tsx`'s `handleInputChange` function updates the `inputValues` state with the new data. This state object holds all raw values entered by the user or the initial prototype data.

3.  **Effect Hook Trigger & KPI Calculation:**
    *   The `useEffect` hook in `App.tsx` listens for changes in the `inputValues` state.
    *   When `inputValues` changes, the effect hook executes:
        *   **Individual KPIs:** It iterates through `KPI_DEFINITIONS`.
            *   For each KPI, if a `calculate` function is defined, it's called with the current `inputValues` to compute the KPI's raw value.
            *   If a `directInputKey` is defined, the value is taken directly from `inputValues`.
            *   The raw value is then passed to `evaluateKpi` (from `utils/evaluationHelpers.ts`) along with its definition. `evaluateKpi` determines the performance `level`, `colorClass`, `message`, and a normalized `score` (0-1) based on the predefined `ranges`.
            *   The results for all individual KPIs are collected and stored in the `kpiResults` state.

4.  **Composite Index Score Preparation:**
    *   Normalized scores (`score` property, 0-1) from the `kpiResults` are extracted to be used as inputs for composite indices.
    *   Special scores like `ESM_norm` (from the ESM KPI's score) and `EAD_norm` (directly from `inputValues.eficienciaAnalisisDatos`) are prepared specifically for the IDT (Technological Development Index).

5.  **Composite Index Calculation (Staged):**
    *   **Stage 1 (ISA, IIS, IDT):**
        *   The dashboard iterates through `COMPOSITE_INDEX_DEFINITIONS`.
        *   For ISA (Environmental Sustainability Index) and IIS (Social Impact Index), `calculateCompositeIndexValue` is called. This function, in turn, calls the respective `calculate` function from the index definition, passing the normalized KPI scores.
        *   For IDT, `calculateCompositeIndexValue` is called, passing the specially prepared `scoresForIdt` (which includes IITSF score, ESM_norm, and EAD_norm).
        *   The raw calculated value for each of these composite indices is then passed to `evaluateCompositeIndex`. This function determines the `level`, `colorClass`, and `message` based on the index's predefined `ranges`. The calculated value itself is used as the `score` for composite indices.
        *   These results (ISA, IIS, IDT) are temporarily stored.
    *   **Stage 2 (IGD):**
        *   The IGD (Global Performance Index) definition is retrieved.
        *   `calculateCompositeIndexValue` is called for IGD. Crucially, for IGD, the `kpiScores` argument is empty, and the `computedCompositeScores` argument is populated with the results (values) of ISA, IIS, and IDT calculated in Stage 1.
        *   The IGD's `calculate` function then uses these pre-calculated composite index values.
        *   The result of IGD is evaluated using `evaluateCompositeIndex`.
    *   All composite index results (ISA, IIS, IDT, IGD) are then stored in the `compositeIndexResults` state.

6.  **Rendering:**
    *   React re-renders `App.tsx` and its children due to state changes (`kpiResults`, `compositeIndexResults`).
    *   `KpiCard` components receive their respective `definition` and `result` (either from `kpiResults` or `compositeIndexResults`).
    *   `KpiCard` then displays the KPI/index name, description, icon, calculated value, unit, performance level, message, and the visual progress bar (for percentage KPIs). Input fields within `KpiCard` (if applicable) reflect the current `inputValues`.

7.  **Dark Mode Toggling:**
    *   The `toggleDarkMode` function updates the `darkMode` state and toggles the 'dark' class on the `<html>` element, allowing Tailwind CSS to apply dark mode styles.

## 3. File Structure

```
.
├── README.md
├── index.html                # HTML entry point, Tailwind CSS setup, ES module imports
├── index.tsx                 # Main React application entry (ReactDOM.createRoot)
├── App.tsx                   # Main application component, state management, layout
├── types.ts                  # TypeScript type definitions
├── metadata.json             # Application metadata
├── components/               # Reusable UI components
│   ├── Icons.tsx             # SVG icon components
│   ├── KpiCard.tsx           # Displays individual KPI/Composite Index cards
│   ├── KpiInputGroup.tsx     # Renders input fields for a KPI
│   └── SectionTitle.tsx      # Component for section titles
├── constants/                # Definitions for KPIs and indices
│   ├── kpiDefinitions.ts     # Definitions for all individual KPIs
│   └── compositeIndexDefinitions.ts # Definitions for composite indices
└── utils/                    # Helper functions
    └── evaluationHelpers.ts  # Logic for calculating and evaluating KPIs/Indices
```

## 4. KPIs and Composite Indices

The dashboard tracks a range of KPIs categorized into:

*   **Sostenibilidad Ambiental (Environmental Sustainability):**
    *   `EUA`: Uso Eficiente del Agua (Water Use Efficiency)
    *   `PER`: Porcentaje de Energía Renovable (Renewable Energy Percentage)
    *   `IRR`: Índice de Reciclaje de Residuos (Waste Recycling Index)
    *   `IIC`: Índice de Intensidad de Carbono (Carbon Intensity Index)
*   **Impacto Social (Social Impact):**
    *   `AAL`: Acceso a Alimentos Locales (Access to Local Food)
    *   `IPCA`: Participación Comunitaria (Community Participation)
    *   `ISAC`: Seguridad Alimentaria y Calidad (Food Safety and Quality)
*   **Desarrollo y Operación Tecnológica (Technological Development & Operation):**
    *   `ICS`: Salud del Suelo/Sustrato (Soil/Substrate Health)
    *   `IITSF`: Inversión en Tecnologías Smart (Investment in Smart Technologies)
    *   `IRA`: Reducción Uso de Agroquímicos (Agrochemical Use Reduction)
    *   `ESM`: Eficiencia Sistema de Monitoreo (Monitoring System Efficiency)
    *   `EAD`: Eficiencia en Análisis de Datos (Data Analysis Efficiency)

**Composite Indices:**

These provide a higher-level overview:

*   **ISA (Índice de Sostenibilidad Ambiental):** Aggregates EUA, PER, IRR, IIC.
*   **IIS (Índice de Impacto Social):** Aggregates AAL, IPCA, ISAC.
*   **IDT (Índice de Desarrollo Tecnológico):** Aggregates IITSF, ESM (normalized score), EAD (normalized value).
*   **IGD (Índice Global de Desempeño):** Aggregates ISA, IIS, IDT to give an overall performance score.

**Unidad de Trabajo Prototipo:**
The application initializes with sample data in `App.tsx` (`initialInputValues`) representing a hypothetical urban farm prototype performing at an "Aceptable" or "Bueno" level across most KPIs. This allows users to immediately see the dashboard in action.

## 5. Technical Stack

*   **React 19:** For building the user interface.
*   **TypeScript:** For static typing and improved code quality.
*   **Tailwind CSS:** For utility-first styling, configured directly in `index.html`.
*   **ES Modules (ESM):** Imported directly in `index.html` via `esm.sh` for React and ReactDOM, enabling a buildless development experience for this simple setup.
*   **Heroicons (via custom SVG components):** Used for iconography.

## 6. Setup and Running Locally

This project is set up to run directly from the `index.html` file without a separate build step or development server, thanks to the use of ES Modules via `esm.sh`.

**Prerequisites:**

*   A modern web browser that supports ES Modules (e.g., Chrome, Firefox, Edge, Safari).

**Running the Application:**

1.  **Clone the repository (if applicable) or ensure all files are in the same directory structure.**
2.  **Open `index.html` directly in your web browser.**
    *   Navigate to the project directory in your file explorer.
    *   Double-click `index.html`, or right-click and choose "Open with" your preferred browser.
3.  **(Alternative) Using a simple HTTP server:**
    If you encounter issues with direct file access (e.g., CORS for certain local operations, though not expected here), or prefer a server environment:
    *   Make sure you have Node.js installed (which includes `npx`).
    *   Navigate to the project's root directory in your terminal.
    *   Run a simple HTTP server. For example:
        ```bash
        npx serve .
        ```
        Or, if you have Python installed:
        ```bash
        python -m http.server
        ```
    *   The terminal will output a local URL (e.g., `http://localhost:3000` or `http://localhost:8000`). Open this URL in your browser. The prompt specifically asked for `http://localhost:8080`, so if using `serve`, you can specify the port: `npx serve . -l 8080`.

The application should now be running, displaying the Urban Farm KPI Dashboard.

## 7. UI Features

*   **Real-time Updates:** KPI cards and messages update instantly as input values are changed.
*   **Clear Visual Hierarchy:** Sections are clearly delineated with titles and icons.
*   **Performance Levels:** Each KPI and composite index displays its current level (e.g., Óptimo, Aceptable, Crítico) with corresponding color coding.
*   **Descriptive Messages:** Actionable messages and insights are provided for each performance level.
*   **Icons:** Each KPI, composite index, and section title is accompanied by a relevant icon for quick visual identification.
*   **Progress Bars:** Percentage-based KPIs (like PER, IRR) include a simple visual bar indicating their value, also color-coded by performance.
*   **Dark Mode:** A toggle button allows users to switch between light and dark themes. The theme preference is also detected from the operating system's settings on initial load.
*   **Responsive Design:** The layout adjusts for optimal viewing on various devices (desktops, tablets, mobiles) using Tailwind CSS.

## 8. Potential Future Enhancements

*   **Data Persistence:** Store user inputs locally (e.g., using `localStorage`) or connect to a backend database.
*   **Historical Data & Charting:** Allow users to track KPI performance over time and visualize trends using charts.
*   **User Authentication:** For multi-user or personalized dashboard experiences.
*   **Advanced Alert System:** Implement more sophisticated notifications (e.g., email alerts for critical KPI levels).
*   **More Granular KPI Inputs:** Allow for more detailed data entry for complex KPIs.
*   **Customizable Thresholds:** Enable users to adjust KPI performance thresholds based on specific farm goals.
*   **Export/Import Data:** Allow users to export their KPI data or import data from other sources.
---
```

This README should provide a thorough understanding of the project.
</content>
  </change>
</changes>
```