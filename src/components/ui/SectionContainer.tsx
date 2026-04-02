import React from 'react';

type SectionContainerProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const SectionContainer: React.FC<SectionContainerProps> = ({ title, children, className = '' }) => {
  return (
    <section className={`py-2 md:py-4 ${className}`.trim()}>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-5 md:mb-7 tracking-tight">{title}</h1>
      {children}
    </section>
  );
};

export default SectionContainer;
