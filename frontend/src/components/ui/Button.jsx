import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = ({ children, variant = 'primary', loading = false, className, ...props }) => {
  const variants = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };

  return (
    <button
      className={clsx(variants[variant], loading && 'opacity-70 pointer-events-none', className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
};

export default Button;
