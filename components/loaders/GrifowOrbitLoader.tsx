
import React from 'react';

const GrifowOrbitLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-slate-900">
      <style>{`
        .g-loader {
            position: relative;
            width: 80px;
            height: 80px;
        }
        
        /* The G logo core */
        .g-core {
            position: absolute;
            inset: 10px;
            background: linear-gradient(135deg, #00c4b4, #3b82f6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 900;
            font-size: 32px;
            color: white;
            z-index: 10;
            box-shadow: 0 0 30px rgba(0, 196, 180, 0.4);
            animation: gPulse 2s ease-in-out infinite;
        }

        /* Orbit Ring 1 (Inner) */
        .g-orbit {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            border: 2px solid transparent;
            border-top-color: #00c4b4;
            border-right-color: #3b82f6;
            animation: gSpin 1.5s linear infinite;
        }
        
        .g-orbit::before {
            content: '';
            position: absolute;
            top: 10px;
            right: 8px;
            width: 6px;
            height: 6px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 0 10px #fff;
        }

        /* Orbit Ring 2 (Outer) */
        .g-orbit-2 {
            position: absolute;
            inset: -15px;
            border-radius: 50%;
            border: 1px solid transparent;
            border-bottom-color: #8b5cf6;
            border-left-color: #fff;
            opacity: 0.4;
            animation: gSpin 3s linear infinite reverse;
        }

        @keyframes gSpin {
            to { transform: rotate(360deg); }
        }

        @keyframes gPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(0, 196, 180, 0.4); }
            50% { transform: scale(0.95); box-shadow: 0 0 15px rgba(0, 196, 180, 0.2); }
        }
      `}</style>
      
      <div className="g-loader">
         <div className="g-orbit"></div>
         <div className="g-orbit-2"></div>
         <div className="g-core">G</div>
      </div>
    </div>
  );
};

export default GrifowOrbitLoader;
