import { motion, AnimatePresence } from "framer-motion";

export function Card({ children, classNames }) {
  return (
    <AnimatePresence>
      <motion.div
        className={classNames}
        initial={{ scale: 0.98 }}
        whileHover={{ scale: 1 }}
        exit={{ scale: 0.98 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export const CardHeader = ({ children, classNames }) => {
  return <div className={classNames}>{children}</div>;
};

export const CardContent = ({ children, classNames }) => {
  return <div className={classNames}>{children}</div>;
};

export const CardFooter = ({ children, classNames }) => {
  return <div className={classNames}>{children}</div>;
};
