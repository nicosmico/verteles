import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-2xl w-full text-center z-10 space-y-8 animate-fade-in">
        {/* Header / Brand */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-950/20 text-violet-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <span>✨</span> Hito 1 Completado
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-violet-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            Verteves IPTV
          </h1>
          <p className="text-neutral-400 text-base md:text-lg max-w-md mx-auto">
            Reproductor IPTV Autónomo de alto rendimiento para Tizen OS y la Web.
          </p>
        </div>

        {/* Logos & Animation Area */}
        <div className="flex justify-center items-center gap-8 py-6">
          <a href="https://vite.dev" target="_blank" rel="noreferrer" className="group">
            <img
              src={viteLogo}
              className="h-16 w-16 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 drop-shadow-[0_0_15px_rgba(100,108,255,0.4)]"
              alt="Vite logo"
            />
          </a>
          <div className="text-neutral-600 text-2xl font-light">+</div>
          <a href="https://react.dev" target="_blank" rel="noreferrer" className="group">
            <img
              src={reactLogo}
              className="h-16 w-16 animate-spin-slow transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(97,218,251,0.4)]"
              alt="React logo"
            />
          </a>
        </div>

        {/* Action / Interaction Card */}
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-md max-w-sm mx-auto space-y-4">
          <p className="text-sm text-neutral-300">
            La pila tecnológica inicial React + Vite + Tailwind CSS v4 está lista.
          </p>
          <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98] cursor-pointer"
          >
            Pulsaciones: {count}
          </button>
        </div>

        {/* Technical Features Checklist */}
        <div className="max-w-md mx-auto text-left border border-neutral-900 bg-neutral-950/40 rounded-2xl p-5 space-y-3 text-xs text-neutral-400">
          <div className="font-semibold text-neutral-300 text-sm mb-2 border-b border-neutral-900 pb-1.5 flex justify-between">
            <span>Configuración de Hito 1</span>
            <span className="text-emerald-400 font-mono">OK</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500">✔</span>
            <span>Estructura de Carpetas Modular (Feature-based)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500">✔</span>
            <span>Soporte Tizen OS (Chrome &gt;= 47 Transpilation)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500">✔</span>
            <span>Entorno de Pruebas Unitarias (Vitest) y E2E (Playwright)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500">✔</span>
            <span>Script de empaquetado para Tizen (.wgt)</span>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-xs text-neutral-600">
          Verteves v0.1.0 • ID: XoHlW9z1dM.Verteves
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
