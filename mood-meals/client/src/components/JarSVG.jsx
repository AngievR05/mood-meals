import React, { useState, useEffect } from 'react';
import '../styles/MoodJar.css';

const POP_DURATION = 500;

const JarSVG = ({ width = 280, height = 340, bubblesData = [] }) => {
  const [bubblesInJar, setBubblesInJar] = useState([]);

  useEffect(() => {
    bubblesData.forEach((bubble) => {
      if (!bubblesInJar.find((b) => b.id === bubble.id)) {
        setBubblesInJar((old) => [...old, { ...bubble, isPopping: true }]);
        setTimeout(() => {
          setBubblesInJar((old) =>
            old.map((b) =>
              b.id === bubble.id ? { ...b, isPopping: false } : b
            )
          );
        }, POP_DURATION);
      }
    });
  }, [bubblesData]);

  const bubbleRadius = 16;
  const bubbleDiameter = bubbleRadius * 2;
  const jarPaddingX = 24; // horizontal padding inside jar
  const jarPaddingY = 30; // vertical padding inside jar
  const maxCols = 3;

  // For flat jar, jar width is basically width - 2 * padding
  const jarInnerWidth = width - jarPaddingX * 2;
  const maxRows = Math.floor((height - jarPaddingY * 2) / bubbleDiameter);
  const maxBubbles = maxCols * maxRows;

  const visibleBubbles = bubblesInJar.slice(0, maxBubbles);

  // Position bubbles in neat grid inside jar
  const bubblesWithPositions = visibleBubbles.map((bubble, index) => {
    const row = Math.floor(index / maxCols);
    const col = index % maxCols;

    const cx = jarPaddingX + bubbleRadius + col * ((jarInnerWidth - bubbleDiameter) / (maxCols - 1));
    const cy = height - jarPaddingY - bubbleRadius - row * bubbleDiameter;

    return {
      ...bubble,
      cx,
      cy,
    };
  });

  return (
    <div className="mood-jar-wrapper" style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Mood jar"
        role="img"
        className="jar-svg"
        style={{ pointerEvents: 'auto' }} // enable pointer events for hover
      >
        <defs>
          <linearGradient id="glassGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cce7f8" />
            <stop offset="100%" stopColor="#a0cfff" />
          </linearGradient>

          <radialGradient id="glassHighlight" cx="0.3" cy="0.3" r="0.6">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="bubbleGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6ed1e1" />
            <stop offset="100%" stopColor="#2581a6" />
          </radialGradient>

          {/* Rectangular clipPath */}
          <clipPath id="jarClip">
            <rect
              x={jarPaddingX}
              y={jarPaddingY}
              width={jarInnerWidth}
              height={height - jarPaddingY * 2}
              rx="20" // rounded corners
              ry="20"
            />
          </clipPath>

          <filter id="bubbleGlow" height="150%" width="150%" x="-25%" y="-25%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00aacc" floodOpacity="0.7" />
          </filter>

          <filter id="jarShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#2b6794" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Jar Body - rectangle with rounded corners */}
        <rect
          x={jarPaddingX}
          y={jarPaddingY}
          width={jarInnerWidth}
          height={height - jarPaddingY * 2}
          rx="20"
          ry="20"
          fill="url(#glassGradient)"
          stroke="#3d7db4"
          strokeWidth="4"
          filter="url(#jarShadow)"
          className="jar-body"
        />

        {/* Glass Highlight */}
        <ellipse cx={jarPaddingX + jarInnerWidth * 0.3} cy={jarPaddingY + (height - jarPaddingY * 2) * 0.3} rx="70" ry="120" fill="url(#glassHighlight)" pointerEvents="none" />

        {/* Bubbles inside jar */}
        <g clipPath="url(#jarClip)">
          {bubblesWithPositions.map((bubble) => (
            <g
              key={bubble.id}
              className={`jar-bubble-group ${bubble.isPopping ? 'popping' : ''}`}
              transform={`translate(${bubble.cx}, ${bubble.cy})`}
              style={{
                animationDuration: `${POP_DURATION}ms`,
              }}
              tabIndex={0}
              role="img"
              aria-label={`${bubble.mood} mood bubble. ${bubble.note ? 'Note: ' + bubble.note : 'No note'}`}
            >
              <title>{bubble.mood}</title>
              <circle
                r={bubbleRadius}
                fill="url(#bubbleGradient)"
                stroke={bubble.color}
                strokeWidth="2"
                className="jar-bubble"
                filter="url(#bubbleGlow)"
              />
              <image
                href={bubble.image}
                x={-bubbleRadius * 0.7}
                y={-bubbleRadius * 0.7}
                width={bubbleRadius * 1.4}
                height={bubbleRadius * 1.4}
                pointerEvents="none"
                alt={bubble.mood}
                draggable="false"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default JarSVG;
