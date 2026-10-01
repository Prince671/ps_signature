import { forwardRef, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import './VariableProximity.css';

function useAnimationFrame(callback, disabled) {
  useEffect(() => {
    if (disabled) return;
    let frameId;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback, disabled]);
}

function useMousePositionRef(containerRef, disabled) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (disabled) return;
    const updatePosition = (x, y) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = ev => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = ev => {
      const touch = ev.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef, disabled]);

  return positionRef;
}

const VariableProximity = forwardRef((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 50,
    falloff = 'linear',
    className = '',
    onClick,
    style,
    ...restProps
  } = props;

  const { isLowPerf } = useTheme();

  const letterRefs = useRef([]);
  const letterPositionsRef = useRef([]);
  const interpolatedSettingsRef = useRef([]);
  const mousePositionRef = useMousePositionRef(containerRef, isLowPerf);
  const lastPositionRef = useRef({ x: null, y: null });

  // Pre-calculate positions of letters relative to the container to prevent layout thrashing
  const updateLetterPositions = () => {
    if (isLowPerf || !containerRef?.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    letterPositionsRef.current = letterRefs.current.map(letterRef => {
      if (!letterRef) return null;
      const rect = letterRef.getBoundingClientRect();
      return {
        centerX: rect.left + rect.width / 2 - containerRect.left,
        centerY: rect.top + rect.height / 2 - containerRect.top
      };
    });
  };

  useEffect(() => {
    if (isLowPerf) return;
    const timer = setTimeout(updateLetterPositions, 200);
    window.addEventListener('resize', updateLetterPositions, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateLetterPositions);
    };
  }, [containerRef, isLowPerf]);

  const parsedSettings = useMemo(() => {
    const parseSettings = settingsStr =>
      new Map(
        settingsStr
          .split(',')
          .map(s => s.trim())
          .map(s => {
            const [name, value] = s.split(' ');
            return [name.replace(/['"]/g, ''), parseFloat(value)];
          })
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = distance => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case 'exponential':
        return norm ** 2;
      case 'gaussian':
        return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      case 'linear':
      default:
        return norm;
    }
  };

  useAnimationFrame(() => {
    if (isLowPerf || !containerRef?.current) return;
    const { x, y } = mousePositionRef.current;
    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {
      return;
    }
    lastPositionRef.current = { x, y };

    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return;
      const pos = letterPositionsRef.current[index];
      if (!pos) return;

      const distance = calculateDistance(
        x,
        y,
        pos.centerX,
        pos.centerY
      );

      if (distance >= radius) {
        letterRef.style.fontVariationSettings = fromFontVariationSettings;
        return;
      }

      const falloffValue = calculateFalloff(distance);
      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(', ');

      interpolatedSettingsRef.current[index] = newSettings;
      letterRef.style.fontVariationSettings = newSettings;
    });
  }, isLowPerf);

  const words = label.split(' ');
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      className={`${className} variable-proximity`}
      onClick={onClick}
      style={{ display: 'inline', ...style }}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map(letter => {
            const currentLetterIndex = letterIndex++;
            return (
              <motion.span
                key={currentLetterIndex}
                ref={el => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                style={{
                  display: 'inline-block',
                  fontVariationSettings: isLowPerf ? fromFontVariationSettings : interpolatedSettingsRef.current[currentLetterIndex]
                }}
                aria-hidden="true"
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;
