import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import useNetworkStatus from '../hooks/useNetworkStatus';

export const NetworkStatus: React.FC = () => {
  const { online, downlink } = useNetworkStatus();

  return (
    <div className="flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-3.5 py-2 backdrop-blur-sm text-sm text-white/70">
      {online ? (
        downlink !== null ? (
          downlink >= 5 ? (
            <>
              <Wifi className="h-4 w-4 text-emerald-500" />
              <span className="hidden sm:inline">Excelente</span>
            </>
          ) : downlink >= 1.5 ? (
            <>
              <Wifi className="h-4 w-4 text-amber-500" />
              <span className="hidden sm:inline">Buena</span>
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4 text-orange-500" />
              <span className="hidden sm:inline">Lenta</span>
            </>
          )
        ) : (
          <>
            <Wifi className="h-4 w-4 text-emerald-500" />
            <span className="hidden sm:inline">Conectado</span>
          </>
        )
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500 animate-pulse" />
          <span className="text-red-400 hidden sm:inline">Sin red</span>
        </>
      )}
    </div>
  );
};

export default NetworkStatus;
