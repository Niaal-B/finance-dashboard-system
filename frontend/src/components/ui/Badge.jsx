import { clsx } from 'clsx';

const Badge = ({ children, variant = 'viewer', className }) => {
  const variants = {
    admin: 'badge-admin',
    analyst: 'badge-analyst', 
    viewer: 'badge-viewer',
    income: 'badge-income',
    expense: 'badge-expense',
  };

  return (
    <span className={clsx(variants[variant?.toLowerCase()] || variants.viewer, className)}>
      {children}
    </span>
  );
};

export default Badge;
