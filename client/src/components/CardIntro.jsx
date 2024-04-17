import { motion, AnimatePresence } from "framer-motion";

export function CardIntro({ children, classNames }) {
  return (
    <AnimatePresence>
      <motion.div className={classNames} initial={{}} whileHover={{}} exit={{}}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export const CardIntroHeader = ({ children, classNames }) => {
  return <div className={classNames}>{children}</div>;
};

export const CardIntroContent = ({ children, classNames }) => {
  return <div className={classNames}>{children}</div>;
};

export const CardIntroFooter = ({ children, classNames }) => {
  return <div className={classNames}>{children}</div>;
};
