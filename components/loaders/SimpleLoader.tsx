
import React from 'react';

const SimpleLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-slate-900">
      <style>{`
        .simple-loader {
          position: relative;
          width: 33px;
          height: 33px;
          perspective: 67px;
        }

        .simple-loader div {
          width: 100%;
          height: 100%;
          background: #fff;
          position: absolute;
          left: 50%;
          transform-origin: left;
          animation: simpleLoaderAnim 2s infinite;
        }

        .simple-loader div:nth-child(1) { animation-delay: 0.15s; }
        .simple-loader div:nth-child(2) { animation-delay: 0.3s; }
        .simple-loader div:nth-child(3) { animation-delay: 0.45s; }
        .simple-loader div:nth-child(4) { animation-delay: 0.6s; }
        .simple-loader div:nth-child(5) { animation-delay: 0.75s; }

        @keyframes simpleLoaderAnim {
          0% { transform: rotateY(0deg); }
          50%, 80% { transform: rotateY(-180deg); }
          90%, 100% { opacity: 0; transform: rotateY(-180deg); }
        }
      `}</style>
      <div className="simple-loader">
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default SimpleLoader;
