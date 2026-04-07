import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

const StatCard = ({ label, value, icon: Icon, trend, color = 'blue', delay = 0, prefix = '$' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = parseFloat(value) || 0;

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const step = numericValue / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [numericValue]);

  const colorMap = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', glow: 'shadow-blue-glow' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'shadow-emerald-glow' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400', glow: '' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', glow: '' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass glass-hover rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-radial from-white/[0.02] to-transparent" />
      <div className="relative flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-white/50 font-medium mb-1">{label}</p>
          <h3 className={clsx('text-3xl font-bold font-outfit', c.text)}>
            {prefix}{displayValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
        <div className={clsx('p-3 rounded-2xl', c.bg)}>
          <Icon className={clsx('w-5 h-5', c.text)} />
        </div>
      </div>
      {trend && (
        <p className="text-xs text-white/40">
          <span className={trend > 0 ? 'text-emerald-400' : 'text-red-400'}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>{' '}vs last month
        </p>
      )}
    </motion.div>
  );
};

export default StatCard;
