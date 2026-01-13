# Tabs Component

React + TypeScript + Vite + Tailwind CSS + Framer Motion implementation of a tabs component with animated transitions.

## Tech stack and approach

- React with TypeScript
- Framer Motion for animations
- Tailwind CSS for styling
- React Hooks: useState, useRef, useEffect, useCallback
- ARIA: Accessibility attributes and roles
- Vite (build tool)

  I approached this tabs component by first implementing the core accessibility features following the W3C ARIA tabs pattern. I used useState to manage the active tab state with lazy initialization for performance, and useRef to store button references for programmatic focus management.

  For keyboard navigation, I implemented a comprehensive handleKeyDown handler supporting arrow keys (with wrapping behavior using modulo operator), Home/End keys, and Enter/Space for activation. Focus management was handled through useEffect, which automatically focuses the active tab whenever it changes.

  I used useCallback to memoize event handlers and prevent unnecessary re-renders of child components. For accessibility, I implemented proper ARIA attributes (role, tabIndex, aria-selected, aria-controls, aria-labelledby) to ensure screen reader compatibility.

  Finally, I enhanced the UX with Framer Motion.
