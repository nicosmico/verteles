import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorOverlayProps {
  channelName: string;
  onRetry: () => void;
}

export const ErrorOverlay: React.FC<ErrorOverlayProps> = ({ channelName, onRetry }) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90">
      <div className="max-w-lg w-full mx-auto px-8 text-center animate-fade-in">
        <div
          className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl"
          style={{ background: 'rgba(255,69,32,0.12)' }}
        >
          <AlertTriangle className="h-10 w-10 text-accent" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Canal no disponible</h2>
        <p className="mt-3 text-base text-tx-secondary leading-relaxed">
          No se pudo conectar al stream de{' '}
          <span className="font-semibold text-tx-primary">
            {channelName}
          </span>.
          El servicio puede estar temporalmente inactivo o la conexión falló.
        </p>
        <div className="mt-8 flex items-center justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2.5 rounded-xl bg-accent hover:bg-accent-hover px-7 py-3.5 text-base font-semibold text-white outline-none focus:ring-2 focus:ring-accent transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="h-5 w-5" />
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorOverlay;
