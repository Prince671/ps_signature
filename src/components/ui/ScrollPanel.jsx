/**
 * ScrollPanel — a single full-viewport panel for use inside HorizontalScroll.
 * Each panel is exactly 100vw × 100vh and flex-shrink-0 to prevent collapsing.
 */
const ScrollPanel = ({ children, className = '' }) => (
  <div
    className={`portfolio-project-panel w-screen h-screen flex-shrink-0 flex items-center justify-center overflow-x-hidden overflow-y-auto ${className}`}
  >
    {children}
  </div>
);

export default ScrollPanel;
