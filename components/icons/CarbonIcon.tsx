import React from 'react';

export const CarbonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.002-1.853 4.5 4.5 0 011.41 8.775" />
    <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fontSize="8px" fontWeight="bold" fill="currentColor">CO₂</text>
  </svg>
);
