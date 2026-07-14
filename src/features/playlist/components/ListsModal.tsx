import React from 'react';
import { List, Plus, Heart, Trash2, X } from 'lucide-react';

interface ListsModalProps {
  onClose: () => void;
}

export const ListsModal: React.FC<ListsModalProps> = ({ onClose }) => {
  const mockLists = [
    { id: 'l1', name: 'Mi lista principal', count: 10, active: true },
    { id: 'l2', name: 'Deportes HD', count: 5, active: false },
    { id: 'l3', name: 'Familia', count: 7, active: false },
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
            <List className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-semibold text-white">Gestionar listas (Visual)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-tx-secondary hover:bg-bg-hover hover:text-white transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Playlist list */}
        <div className="space-y-2">
          {mockLists.map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between rounded-xl bg-[#1a1a1a] px-4 py-3.5 border border-bg-border/40 hover:border-bg-border transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent shrink-0">
                  <List className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{l.name}</p>
                  <p className="text-xs text-tx-secondary">{l.count} canales</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {l.active && (
                  <span className="rounded bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
                    Activa
                  </span>
                )}
                <button
                  type="button"
                  className="rounded-lg p-2 text-tx-secondary hover:bg-[#222] hover:text-white transition-all cursor-pointer"
                  title="Marcar favorita"
                >
                  <Heart className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-lg p-2 text-tx-secondary hover:bg-[#222] hover:text-rose-500 transition-all cursor-pointer"
                  title="Eliminar lista"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-bg-border hover:border-accent hover:text-accent py-3 text-sm text-tx-secondary transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Añadir nueva lista
        </button>
      </div>
    </div>
  );
};

export default ListsModal;
