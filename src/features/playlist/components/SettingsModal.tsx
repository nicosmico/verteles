import React from 'react';
import { Settings, X } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const settingsOptions = [
    { label: 'Calidad de reproducción', value: 'Automática' },
    { label: 'Reproductor por defecto', value: 'Interno' },
    { label: 'Tema', value: 'Oscuro' },
    { label: 'Idioma', value: 'Español' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 focus:outline-none animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-[#111] border border-bg-border p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-semibold text-white">Configuración (Visual)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-tx-secondary hover:bg-bg-hover hover:text-white transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Options list */}
        <div className="space-y-2.5">
          {settingsOptions.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between rounded-xl bg-[#1a1a1a] px-4 py-3.5 border border-bg-border/40 hover:border-bg-border transition-all"
            >
              <p className="text-sm font-medium text-white">{s.label}</p>
              <span className="text-sm font-semibold text-tx-secondary bg-[#222] px-3 py-1 rounded-md">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
