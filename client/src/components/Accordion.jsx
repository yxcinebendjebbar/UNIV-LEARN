import React from "react";
import { CiSquareChevLeft } from "react-icons/ci";
import { CiSquareChevDown } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";

function Accordion({ children, title, defaultState }) {
  const [isOpen, setIsOpen] =
    defaultState === "opened" ? React.useState(true) : React.useState(false);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className='flex flex-col gap-4 max-w-xl border rounded p-10'>
      <div className='flex items-center justify-between'>
        <h2 className='text-desc text-left text-neutral-900 dark:text-neutral-100'>
          {title}
        </h2>
        <button
          onClick={() => {
            toggleOpen();
          }}
        >
          {isOpen ? (
            <CiSquareChevDown className='scale-150' />
          ) : (
            <CiSquareChevLeft className='scale-150' />
          )}
        </button>
      </div>
      <div className='w-full bg-neutral-900/15 dark:bg-neutral-100/15 h-[1px]' />
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className='pl-8'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Accordion;
