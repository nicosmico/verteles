import React from 'react';
import { PanelLeftOpen, Clock } from 'lucide-react';
import { usePlayerStore } from '../../features/player/store/usePlayerStore';
import usePlayerInterface from '../../features/player/store/usePlayerInterface';
import useClock from '../../shared/clock/useClock';
import NetworkStatus from '../../shared/network/NetworkStatus';

const fmtTime = (d: Date) =>
  d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

export const TopBar: React.FC = () => {
  const { errorMsg, isBuffering } = usePlayerStore();
  const { showControls, setSidebarOpen } = usePlayerInterface();
  const now = useClock();

  return (
    <div
      className={`absolute inset-x-0 top-0 z-20 flex items-center justify-between px-8 pt-6 transition-all duration-300 ${
        showControls || errorMsg
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <div className="flex-1 flex justify-start">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="grid h-11 w-11 place-items-center rounded-xl bg-black/50 border border-white/10 text-white/80 hover:bg-black/75 hover:text-white backdrop-blur-sm transition-all outline-none cursor-pointer"
          title="Abrir menú"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2">
          {errorMsg ? (
            <span className="flex items-center gap-1.5 rounded-md bg-red-900/60 border border-red-500/30 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              No Disponible
            </span>
          ) : isBuffering ? (
            <span className="flex items-center gap-1.5 rounded-md bg-[#111]/80 border border-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white/60">
              <span className="h-1.5 w-1.5 animate-spin rounded-full border border-t-white/80 border-r-white/20 border-b-white/20 border-l-white/20" />
              Cargando
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              En Vivo
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center gap-3 justify-end">
        <NetworkStatus />
        <div className="flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-3.5 py-2 backdrop-blur-sm text-sm text-white/70">
          <Clock className="h-4 w-4" />
          <span>{fmtTime(now)}</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
