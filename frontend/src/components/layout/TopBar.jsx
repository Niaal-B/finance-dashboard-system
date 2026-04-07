import { motion } from 'framer-motion';

const TopBar = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold font-outfit">{title}</h1>
      {subtitle && <p className="text-white/40 mt-1 text-sm">{subtitle}</p>}
    </motion.div>
  );
};

export default TopBar;
