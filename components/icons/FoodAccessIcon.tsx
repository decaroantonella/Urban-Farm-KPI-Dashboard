import React from 'react';

export const FoodAccessIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 10.093s.158-.365.324-.712c.27-.575.626-1.134.912-1.504" /> {/* Simple representation of a leaf/plant */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 10.093s-.158-.365-.324-.712c-.27-.575-.626-1.134-.912-1.504" />
  </svg>
);
