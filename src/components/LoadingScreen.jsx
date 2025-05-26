import React, { useState, useEffect, useRef, useCallback } from 'react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [pathD, setPathD] = useState('');
  const pathRef = useRef(null);
  const animationFrameId = useRef(null);
  const startTimeRef = useRef(null);
  const duration = 6000; // Animation duration in milliseconds (4 seconds)

  // Function to generate a random wavy SVG path
  const generateWavyPath = useCallback(() => {
    const width = 800; // SVG viewBox width
    const height = 200; // SVG viewBox height
    const startX = 0;
    const startY = height / 2; // Start from the middle vertically

    let d = `M ${startX},${startY}`; // Move to the starting point

    const numSegments = 5; // Number of wavy segments
    const segmentWidth = width / numSegments; // Width of each segment

    // Generate quadratic Bezier curves for each segment
    for (let i = 0; i < numSegments; i++) {
      const currentX = startX + i * segmentWidth;
      const nextX = startX + (i + 1) * segmentWidth;

      // Control point for the quadratic Bezier curve (Q cx,cy, x,y)
      // cx: Midpoint of current and next X, with some randomness
      const controlX = currentX + segmentWidth / 2 + (Math.random() - 0.5) * segmentWidth * 0.4;
      // cy: Y position for the control point, varying significantly to create waves
      const controlY = height * 0.2 + Math.random() * height * 0.6;

      // End point of the current segment
      const endX = nextX;
      // endY: Y position for the end point, slightly varied to keep the curve interesting
      const endY = height / 2 + (Math.random() - 0.5) * height * 0.2;

      d += ` Q ${controlX},${controlY} ${endX},${endY}`;
    }
    setPathD(d); // Update the SVG path data
  }, []);

  // Effect to generate the path on component mount
  useEffect(() => {
    generateWavyPath();
  }, [generateWavyPath]);

  // Effect to handle the SVG path drawing animation
  useEffect(() => {
    // Ensure the path element is rendered before attempting to get its length
    if (!pathRef.current) {
      return;
    }

    const pathElement = pathRef.current;
    const length = pathElement.getTotalLength(); // Get the total length of the SVG path

    // Initialize stroke-dasharray and stroke-dashoffset for the drawing effect
    pathElement.style.strokeDasharray = length;
    pathElement.style.strokeDashoffset = length;

    // Animation function using requestAnimationFrame
    const animateProgress = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp; // Record the start time of the animation
      }

      const elapsed = timestamp - startTimeRef.current; // Time elapsed since animation started
      const currentProgressRatio = Math.min(elapsed / duration, 1); // Progress ratio (0 to 1)

      // Calculate the new stroke-dashoffset to reveal the path
      const newOffset = length - (length * currentProgressRatio);

      if (pathElement) {
        pathElement.style.strokeDashoffset = newOffset; // Apply the new offset
      }
      // Update the progress percentage displayed to the user
      setProgress(Math.round(currentProgressRatio * 99));

      // Continue animation if not yet complete
      if (currentProgressRatio < 1) {
        animationFrameId.current = requestAnimationFrame(animateProgress);
      } else {
        // Animation complete, reset start time for potential re-triggering
        startTimeRef.current = null;
        // You could add logic here for when loading is complete, e.g., navigate away
      }
    };

    // Start the animation if the path has a valid length
    if (length > 0) {
      animationFrameId.current = requestAnimationFrame(animateProgress);
    }

    // Cleanup function: cancel the animation frame on component unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [pathD, duration]); // Re-run effect if path data or duration changes

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 font-inter z-50 px-2 pb-60">
      {/* Tailwind CSS is assumed to be available. */}
      {/* Import Inter font for a clean, modern look */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
          /* Custom style for the animated stroke to ensure smooth drawing */
          .sketch-pen-stroke {
            stroke-linecap: round; /* Rounded ends for the stroke */
            stroke-linejoin: round; /* Rounded joins for path segments */
            transition: stroke-dashoffset 0.1s linear; /* Smooth transition for progress updates */
          }
        `}
      </style>
      <div className="relative w-full max-w-5xl p-8 rounded-2xl shadow-xl bg-white dark:bg-gray-800 text-center flex flex-col items-center justify-center overflow-hidden">
        {/* Loading title with a subtle pulse animation */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 animate-pulse">
          Loading...
        </h1>

        {/* Container for the SVG and percentage text */}
        <div className="relative w-full h-48 flex items-center justify-center mb-8">
          <svg
            viewBox="0 0 800 200" // Define the SVG coordinate system
            className="w-full h-full" // Make SVG responsive to its container
            preserveAspectRatio="xMidYMid meet" // Maintain aspect ratio
          >
            {/* Background path: a faded version of the curve for context */}
            <path
              d={pathD}
              fill="none"
              stroke="currentColor" // Uses current text color for dark mode support
              strokeWidth="4"
              className="text-gray-300 dark:text-gray-700 opacity-50"
            />
            {/* Animated foreground path: the "sketch pen" drawing */}
            <path
              ref={pathRef} // Ref to access the SVG path element for animation
              d={pathD}
              fill="none"
              stroke="url(#gradient)" // Apply a vibrant gradient for the sketch pen effect
              strokeWidth="8" // Thicker stroke for the drawing
              className="sketch-pen-stroke"
              // Inline styles for initial stroke-dasharray and stroke-dashoffset,
              // these will be dynamically updated by JavaScript
              style={{
                strokeDasharray: 0, // Will be set by JS
                strokeDashoffset: 0, // Will be set by JS
              }}
            />
            {/* SVG Definitions for the linear gradient */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#84e7f8" /> {/* Light blue */}
                <stop offset="50%" stopColor="#4ade80" /> {/* Green */}
                <stop offset="100%" stopColor="#fde047" /> {/* Yellow */}
              </linearGradient>
            </defs>
          </svg>
          {/* Percentage text, absolutely positioned over the SVG */}
          <div className="absolute text-3xl font-extrabold text-gray-800 dark:text-gray-200 mt-35">
            <div>
               {progress}% 
            </div>
            
          </div>
        </div>

        {/* Sub-text for the loading screen */}
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Preparing your experience...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
