import React from 'react';

type AnimatedNumberProps = {
  value: number;
  duration?: number;
  formatter?: (value: number) => string;
  className?: string;
};

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 650,
  formatter = (v) => String(v),
  className = '',
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let frameId = 0;
    const start = performance.now();
    const from = displayValue;
    const to = value;

    const step = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (to - from) * eased;
      setDisplayValue(next);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <span className={className}>{formatter(displayValue)}</span>;
};

export default AnimatedNumber;
