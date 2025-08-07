import React, { useState, useEffect } from 'react';

const POP_DURATION = 500;

const JarSVG = ({ width = 280, height = 340, bubblesData = [] }) => {
  const [bubblesInJar, setBubblesInJar] = useState([]);
  const [hoveredBubble, setHoveredBubble] = useState(null);

  useEffect(() => {
    // Add new bubbles that aren't already in jar
    bubblesData.forEach((bubble) => {
      if (!bubblesInJar.find((b) => b.id === bubble.id)) {
        // Hide bubble initially
        setBubblesInJar((old) => [...old, { ...bubble, isPopping: false, isHidden: true }]);
        
        // Show bubble after 10 seconds with pop animation
        setTimeout(() => {
          setBubblesInJar((old) =>
            old.map((b) =>
              b.id === bubble.id ? { ...b, isPopping: true, isHidden: false } : b
            )
          );
          
          // Remove pop animation after it finishes
          setTimeout(() => {
            setBubblesInJar((old) =>
              old.map((b) =>
                b.id === bubble.id ? { ...b, isPopping: false } : b
              )
            );
          }, POP_DURATION);
        }, 10000); // 10 seconds delay
      }
    });

    // Remove bubbles that are no longer in bubblesData
    setBubblesInJar((old) => 
      old.filter(bubble => bubblesData.find(b => b.id === bubble.id))
    );
  }, [bubblesData]);

  const bubbleRadius = 18;
  
  // Define jar dimensions and shape
  const jarTop = 60;
  const jarBottom = height - 40;
  const jarHeight = jarBottom - jarTop;
  const neckWidth = width * 0.3;
  const bodyWidth = width * 0.8;
  const neckHeight = 40;

  // Position bubbles to fit jar shape
  const positionBubblesInJar = (bubbles) => {
    return bubbles.map((bubble, index) => {
      // Calculate jar width at different heights
      const getJarWidthAtHeight = (y) => {
        if (y < jarTop + neckHeight) {
          // In the neck area
          return neckWidth;
        } else {
          // In the body area - slightly tapered
          const bodyProgress = (y - (jarTop + neckHeight)) / (jarHeight - neckHeight);
          return bodyWidth * (0.9 + 0.1 * (1 - bodyProgress));
        }
      };

      // Try to place bubbles in rows, adjusting for jar shape
      const row = Math.floor(index / 3);
      const col = index % 3;
      const baseY = jarBottom - bubbleRadius - (row * bubbleRadius * 1.6) - 20;
      
      if (baseY < jarTop + bubbleRadius) return { ...bubble, cx: -1000, cy: -1000 }; // Hide if doesn't fit
      
      const jarWidthAtY = getJarWidthAtHeight(baseY);
      const leftEdge = (width - jarWidthAtY) / 2;
      const rightEdge = leftEdge + jarWidthAtY;
      
      // Position within available width
      const bubbleX = col === 0 ? leftEdge + bubbleRadius + 10 :
                     col === 1 ? width / 2 :
                     rightEdge - bubbleRadius - 10;
      
      // Add some randomness for natural look
      const randomOffsetX = (Math.random() - 0.5) * 15;
      const randomOffsetY = (Math.random() - 0.5) * 10;
      
      return {
        ...bubble,
        cx: Math.max(leftEdge + bubbleRadius, Math.min(rightEdge - bubbleRadius, bubbleX + randomOffsetX)),
        cy: baseY + randomOffsetY,
      };
    });
  };

  const bubblesWithPositions = positionBubblesInJar(bubblesInJar).filter(b => b.cx > 0 && !b.isHidden);

  return (
    <div style={{ 
      margin: '2rem auto',
      position: 'relative',
      userSelect: 'none',
      filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15))',
      background: 'linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      borderRadius: '40px',
      padding: '1.5rem',
      maxWidth: '350px',
      boxShadow: `
        inset 0 4px 8px rgba(255, 255, 255, 0.8), 
        inset 0 -2px 4px rgba(0, 0, 0, 0.05),
        0 8px 32px rgba(59, 130, 246, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.2)
      `,
      width, 
      height,
      transition: 'all 0.3s ease',
    }}>
      {/* Jar count indicator */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '15px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        color: 'white',
        borderRadius: '20px',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: '600',
        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {bubblesWithPositions.length} mood{bubblesWithPositions.length !== 1 ? 's' : ''}
      </div>

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Mood jar"
        role="img"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          outline: 'none',
          pointerEvents: 'auto'
        }}
      >
        <defs>
          {/* Jar body gradient */}
          <linearGradient id="jarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fafafa" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#f8fafc" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.95" />
          </linearGradient>

          {/* Glass highlight */}
          <radialGradient id="glassHighlight" cx="0.25" cy="0.2" r="0.3">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="70%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Enhanced bubble glow filter */}
          <filter id="bubbleGlow" height="200%" width="200%" x="-50%" y="-50%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Jar shadow */}
          <filter id="jarShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#1e40af" floodOpacity="0.12" />
          </filter>

          {/* Enhanced hover glow */}
          <filter id="hoverGlow" height="300%" width="300%" x="-100%" y="-100%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Clip path for jar interior */}
          <clipPath id="jarInterior">
            <path d={`
              M ${(width - neckWidth) / 2 + 4} ${jarTop + 2}
              L ${(width + neckWidth) / 2 - 4} ${jarTop + 2}
              L ${(width + neckWidth) / 2 - 4} ${jarTop + neckHeight}
              Q ${(width + neckWidth) / 2 - 4} ${jarTop + neckHeight + 8} ${(width + bodyWidth) / 2 - 4} ${jarTop + neckHeight + 16}
              L ${(width + bodyWidth) / 2 - 4} ${jarBottom - 16}
              Q ${(width + bodyWidth) / 2 - 4} ${jarBottom - 4} ${(width + bodyWidth) / 2 - 16} ${jarBottom - 4}
              L ${(width - bodyWidth) / 2 + 16} ${jarBottom - 4}
              Q ${(width - bodyWidth) / 2 + 4} ${jarBottom - 4} ${(width - bodyWidth) / 2 + 4} ${jarBottom - 16}
              L ${(width - bodyWidth) / 2 + 4} ${jarTop + neckHeight + 16}
              Q ${(width - neckWidth) / 2 + 4} ${jarTop + neckHeight + 8} ${(width - neckWidth) / 2 + 4} ${jarTop + neckHeight}
              Z
            `} />
          </clipPath>
        </defs>

        {/* Main jar body */}
        <path
          d={`
            M ${(width - neckWidth) / 2} ${jarTop}
            L ${(width + neckWidth) / 2} ${jarTop}
            L ${(width + neckWidth) / 2} ${jarTop + neckHeight}
            Q ${(width + neckWidth) / 2} ${jarTop + neckHeight + 10} ${(width + bodyWidth) / 2} ${jarTop + neckHeight + 20}
            L ${(width + bodyWidth) / 2} ${jarBottom - 20}
            Q ${(width + bodyWidth) / 2} ${jarBottom} ${(width + bodyWidth) / 2 - 20} ${jarBottom}
            L ${(width - bodyWidth) / 2 + 20} ${jarBottom}
            Q ${(width - bodyWidth) / 2} ${jarBottom} ${(width - bodyWidth) / 2} ${jarBottom - 20}
            L ${(width - bodyWidth) / 2} ${jarTop + neckHeight + 20}
            Q ${(width - neckWidth) / 2} ${jarTop + neckHeight + 10} ${(width - neckWidth) / 2} ${jarTop + neckHeight}
            Z
          `}
          fill="url(#jarGradient)"
          stroke="#cbd5e1"
          strokeWidth="3"
          filter="url(#jarShadow)"
        />

        {/* Inner jar rim highlight */}
        <path
          d={`
            M ${(width - neckWidth) / 2 + 2} ${jarTop + 2}
            L ${(width + neckWidth) / 2 - 2} ${jarTop + 2}
          `}
          stroke="white"
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Glass highlight on jar */}
        <ellipse 
          cx={width * 0.3} 
          cy={height * 0.35} 
          rx="25" 
          ry="80" 
          fill="url(#glassHighlight)" 
          pointerEvents="none" 
        />

        {/* Bubbles inside jar */}
        <g clipPath="url(#jarInterior)">
          {bubblesWithPositions.map((bubble, index) => (
            <g
              key={bubble.id}
              className={`jar-bubble-group ${bubble.isPopping ? 'popping' : ''}`}
              transform={`translate(${bubble.cx}, ${bubble.cy})`}
              style={{
                animation: bubble.isPopping ? 'bubblePopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
                transition: 'all 5s cubic-bezier(0.2, 0, 0.2, 1)',
                transformOrigin: 'center center',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `scale(1.4)`;
                e.currentTarget.style.filter = 'url(#hoverGlow)';
                e.currentTarget.style.zIndex = '100';
                setHoveredBubble(bubble);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `scale(1)`;
                e.currentTarget.style.filter = 'url(#bubbleGlow)';
                e.currentTarget.style.zIndex = '1';
                setHoveredBubble(null);
              }}
              tabIndex={0}
              role="img"
              aria-label={`${bubble.mood} mood bubble`}
            >
              <title>{bubble.mood} - {bubble.note}</title>
              
              {/* Bubble shadow */}
              <circle
                r={bubbleRadius + 2}
                fill="rgba(0, 0, 0, 0.1)"
                cx="2"
                cy="3"
              />
              
              {/* Main bubble */}
              <circle
                r={bubbleRadius}
                fill={bubble.color}
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="3"
                filter="url(#bubbleGlow)"
                opacity="0.95"
              />
              
              {/* Inner highlight */}
              <circle
                r={bubbleRadius - 4}
                fill="url(#glassHighlight)"
                opacity="0.3"
              />
              
              {/* Emotion image */}
              <image
                href={bubble.image}
                x={-bubbleRadius * 0.55}
                y={-bubbleRadius * 0.55}
                width={bubbleRadius * 1.1}
                height={bubbleRadius * 1.1}
                pointerEvents="none"
                alt={bubble.mood}
                style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' }}
              />
            </g>
          ))}
        </g>
        
        {/* Emotion tooltip */}
        {hoveredBubble && (
          <g>
            {/* Tooltip background */}
            <rect
              x={width / 2 - 60}
              y={15}
              width="120"
              height="35"
              rx="18"
              ry="18"
              fill="rgba(30, 64, 175, 0.95)"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
              filter="url(#jarShadow)"
            />
            {/* Mood name */}
            <text
              x={width / 2}
              y={28}
              textAnchor="middle"
              fill="white"
              fontSize="13"
              fontWeight="600"
              style={{ 
                pointerEvents: 'none',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
              }}
            >
              {hoveredBubble.mood}
            </text>
            {/* Note preview */}
            {hoveredBubble.note && (
              <text
                x={width / 2}
                y={42}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.9)"
                fontSize="10"
                style={{ pointerEvents: 'none' }}
              >
                {hoveredBubble.note.length > 15 ? hoveredBubble.note.substring(0, 15) + '...' : hoveredBubble.note}
              </text>
            )}
          </g>
        )}

        <style>
          {`
            @keyframes bubblePopIn {
              0% {
                transform: scale(0) rotate(-180deg);
                opacity: 0;
              }
              50% {
                transform: scale(1.3) rotate(-90deg);
                opacity: 0.8;
              }
              100% {
                transform: scale(1) rotate(0deg);
                opacity: 1;
              }
            }
            
            .jar-bubble-group:focus-visible {
              outline: 3px solid #3b82f6;
              outline-offset: 4px;
              border-radius: 50%;
            }
          `}
        </style>
      </svg>
    </div>
  );
};

export default JarSVG;