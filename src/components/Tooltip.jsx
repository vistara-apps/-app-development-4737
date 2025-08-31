import React, { useState, useRef, useEffect } from 'react';

/**
 * Tooltip component for displaying additional information on hover
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The element that triggers the tooltip
 * @param {string} props.content - The tooltip content
 * @param {string} [props.position='top'] - Tooltip position (top, bottom, left, right)
 * @param {string} [props.className] - Additional CSS classes for the tooltip
 * @param {number} [props.delay=300] - Delay before showing tooltip (ms)
 * @returns {JSX.Element} - Rendered component
 */
const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  className = '',
  delay = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timerRef = useRef(null);

  const showTooltip = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        y = triggerRect.top - tooltipRect.height - 8;
        break;
      case 'bottom':
        x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        y = triggerRect.bottom + 8;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8;
        y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        break;
      case 'right':
        x = triggerRect.right + 8;
        y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        break;
      default:
        x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        y = triggerRect.top - tooltipRect.height - 8;
    }

    // Ensure tooltip stays within viewport
    const padding = 10;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding));

    setCoords({ x, y });
  };

  // Update position when window is resized
  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isVisible]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  // Get arrow position class
  const getArrowClass = () => {
    switch (position) {
      case 'top': return 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent dark:border-t-gray-700';
      case 'bottom': return 'top-[-6px] left-1/2 transform -translate-x-1/2 border-b-gray-800 border-l-transparent border-r-transparent border-t-transparent dark:border-b-gray-700';
      case 'left': return 'right-[-6px] top-1/2 transform -translate-y-1/2 border-l-gray-800 border-t-transparent border-b-transparent border-r-transparent dark:border-l-gray-700';
      case 'right': return 'left-[-6px] top-1/2 transform -translate-y-1/2 border-r-gray-800 border-t-transparent border-b-transparent border-l-transparent dark:border-r-gray-700';
      default: return 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent dark:border-t-gray-700';
    }
  };

  return (
    <div className="inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded shadow-lg dark:bg-gray-700 ${className}`}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
          }}
          role="tooltip"
        >
          {content}
          <div className={`absolute w-0 h-0 border-4 ${getArrowClass()}`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;

