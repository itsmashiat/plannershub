import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <span>
        &copy; {currentYear} PlannersHub. Pabna University of Science and Technology.
      </span>
      <span>
        Department of Urban &amp; Regional Planning (PUST URP).
      </span>
    </footer>
  );
};
