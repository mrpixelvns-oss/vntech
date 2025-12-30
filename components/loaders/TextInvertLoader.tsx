
import React from 'react';

const TextInvertLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-slate-900">
      <style>{`
        .loader-text-wrapper {
          height: fit-content;
          min-width: 3rem;
          width: fit-content;
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: 0.25ch;
          position: relative;
          z-index: 0;
          color: white;
          line-height: 1.2; /* Defines height roughly around 3rem */
          padding: 0 0.5rem;
        }

        .loader-invertbox {
          position: absolute;
          height: 100%;
          aspect-ratio: 1/1;
          left: 0;
          top: 0;
          border-radius: 20%;
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: invert(100%);
          animation: loaderInvertMove 2s ease-in-out infinite;
        }

        @keyframes loaderInvertMove {
          0%, 100% {
            left: 0;
          }
          50% {
            /* Moves to the right edge. Assuming box width is roughly equal to height due to aspect-ratio 1/1 */
            left: calc(100% - 3rem); 
          }
        }
      `}</style>
      <div className="loader-text-wrapper">
        <p style={{ margin: 0 }}>Loading...</p>
        <div className="loader-invertbox" />
      </div>
    </div>
  );
}

export default TextInvertLoader;
