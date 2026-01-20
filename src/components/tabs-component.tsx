import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import type { ITab } from "../types";

const buttonStyles: { [key: string]: string } = {
  base: "text-neutral-600 border-neutral-300 border-b",
  selected: "text-indigo-700 border-b border-transparent"
};

const panelVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
};

const TabsComponent = ({ tabs, className }: { tabs: ITab[]; className?: string }) => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    return tabs[0]?.id ?? "";
  });

  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  useEffect(() => {
    if (activeIndex !== -1 && tabsRef.current[activeIndex]) {
      tabsRef.current[activeIndex]?.focus();
    }
  }, [activeTab, activeIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, index: number) => {
      const total = tabs.length;
      let newIndex: number | undefined;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          newIndex = (index + 1) % total;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          newIndex = (index - 1 + total) % total;
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = total - 1;
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          setActiveTab(tabs[index].id);
          return;
      }

      if (newIndex !== undefined && newIndex !== index) {
        e.preventDefault();
        tabsRef.current[newIndex]?.focus();
        setActiveTab(tabs[newIndex].id);
      }
    },
    [tabs]
  );

  return (
    <div className={className}>
      <div
        role='tablist'
        aria-label='Account settings'
        aria-orientation='horizontal'
        className='relative flex flex-row items-center justify-between'
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => {
              if (el) {
                tabsRef.current[index] = el;
              }
            }}
            id={`tab-${tab.id}`}
            role='tab'
            tabIndex={index === activeIndex ? 0 : -1}
            aria-selected={tab.id === activeTab}
            aria-controls={`tabpanel-${tab.id}`}
            className={`relative w-full cursor-pointer px-2 pb-3 text-left text-base font-medium transition-colors duration-200 ease-in-out hover:border-indigo-800 hover:text-indigo-800 focus:text-indigo-800 focus:outline-none ${tab.id === activeTab ? "active" : ""} ${buttonStyles[tab.id === activeTab ? "selected" : "base"]}`}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={e => handleKeyDown(e, index)}
          >
            {tab.label}

            {tab.id === activeTab && (
              <motion.div
                layoutId='activeTabIndicator'
                className='absolute right-0 -bottom-px left-0 h-px bg-indigo-600'
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <div className='relative mt-6'>
        <AnimatePresence mode='wait'>
          {tabs.map(
            tab =>
              tab.id === activeTab && (
                <motion.div
                  key={tab.id}
                  id={`tabpanel-${tab.id}`}
                  role='tabpanel'
                  aria-labelledby={`tab-${tab.id}`}
                  variants={panelVariants}
                  initial='hidden'
                  animate='visible'
                  exit='exit'
                  className='text-base font-medium text-black'
                >
                  {tab.content}
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TabsComponent;
