import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import type { ITabs } from "../types";

const buttonStyles: { [key: string]: string } = {
  base: "text-neutral-600 border-neutral-300 border-b",
  selected: "text-indigo-700 border-0 mb-[0.5px]"
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

const TabsComponent = ({ tabs }: { tabs: ITabs }) => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    const firstTab = Object.values(tabs)[0];
    return firstTab?.id ?? "";
  });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const tabsArray = Object.values(tabs);
  const activeIndex = tabsArray.findIndex(tab => tab.id === activeTab);

  useEffect(() => {
    if (activeIndex !== -1 && tabsRef.current[activeIndex]) {
      tabsRef.current[activeIndex]?.focus();
    }
  }, [activeTab, activeIndex]);

  const setTabRef = useCallback((el: HTMLButtonElement | null, index: number) => {
    if (el) {
      tabsRef.current[index] = el;
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, index: number) => {
      const total = tabsArray.length;
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
          setActiveTab(tabsArray[index].id);
          return;
      }

      if (newIndex !== undefined && newIndex !== index) {
        e.preventDefault();
        tabsRef.current[newIndex]?.focus();
        setActiveTab(tabsArray[newIndex].id);
      }
    },
    [tabsArray]
  );

  const handleClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  return (
    <div
      role='tablist'
      aria-label='Account settings'
      aria-orientation='horizontal'
      className='w-75'
    >
      <div className='relative flex w-full flex-row items-center justify-between'>
        {tabsArray.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => setTabRef(el, index)}
            id={`tab-${tab.id}`}
            role='tab'
            tabIndex={index === activeIndex ? 0 : -1}
            aria-selected={tab.id === activeTab}
            aria-controls={`tabpanel-${tab.id}`}
            className={`relative w-full cursor-pointer px-2 pb-3 text-center text-base font-medium transition-colors duration-200 ease-in-out hover:border-indigo-800 hover:text-indigo-800 focus:text-indigo-800 ${tab.id === activeTab ? "active" : ""} ${buttonStyles[tab.id === activeTab ? "selected" : "base"]}`}
            onClick={() => handleClick(tab.id)}
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

      <div className='relative mt-4'>
        <AnimatePresence mode='wait'>
          {tabsArray.map(
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
