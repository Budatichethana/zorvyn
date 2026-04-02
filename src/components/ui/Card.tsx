import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`card ${className}`.trim()}>{children}</div>;
};

export default Card;
