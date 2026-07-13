import { useState } from 'react';
import { VideoPlayer } from './features/player';

// Default IPTV stream for testing (Chilevisión [CL])
const TEST_CHANNEL = {
  name: 'Chilevisión [CL]',
  url: 'https://redirector.rudo.video/hls-video/10b92cafdf3646cbc1e727f3dc76863621a327fd/chv/chv.smil/playlist.m3u8',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Emblema_de_Chilevisi%C3%B3n.svg',
  group: 'General',
};

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0); // Used to reload the VideoPlayer on retry

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleRetry = () => {
    setErrorMsg(null);
    setIsPlaying(true);
    setIsBuffering(true);
    setRetryKey((k) => k + 1);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-neutral-950 font-sans text-neutral-100">
      {/* Background Gradients (decorations on top of black, behind video when transparent/loading) */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-neutral-950 via-neutral-950/90 to-violet-950/20 pointer-events-none z-0" />

      {/* Video Player Core */}
      {!errorMsg && (
        <div className="absolute inset-0 w-full h-full z-10">
          <VideoPlayer
            key={retryKey}
            url={TEST_CHANNEL.url}
            autoplay={isPlaying}
            onPlayStateChange={setIsPlaying}
            onBuffering={setIsBuffering}
            onError={setErrorMsg}
          />
        </div>
      )}

      {/* UI Overlay Plane */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-8 pointer-events-none">
        
        {/* Top Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <span className="text-xl md:text-2xl font-black tracking-wider bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              VERTELES
            </span>
            <div className="px-2.5 py-0.5 text-[10px] md:text-xs font-semibold uppercase tracking-wider rounded-full border border-violet-500/20 bg-violet-950/40 text-violet-400 backdrop-blur-sm">
              Hito 2 • MVP Dual
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="pointer-events-auto">
            {errorMsg ? (
              <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/20 border border-rose-500/30 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                ERROR
              </span>
            ) : isBuffering ? (
              <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                CARGANDO
              </span>
            ) : isPlaying ? (
              <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                EN VIVO
              </span>
            ) : (
              <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                PAUSADO
              </span>
            )}
          </div>
        </div>

        {/* Center States (Error Banner / Buffering Spinner) */}
        <div className="flex-1 flex items-center justify-center">
          {errorMsg ? (
            <div className="max-w-md p-8 rounded-2xl border border-rose-500/30 bg-neutral-950/90 backdrop-blur-xl text-center space-y-4 pointer-events-auto animate-fade-in shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-500 text-3xl">
                ⚠️
              </div>
              <h2 className="text-xl font-bold text-neutral-100">Canal no disponible</h2>
              <p className="text-xs text-neutral-400 line-clamp-3">
                {errorMsg}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="px-6 py-2 rounded-xl text-sm font-medium transition-all bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white cursor-pointer active:scale-95 shadow-lg shadow-rose-900/35"
              >
                Reintentar
              </button>
            </div>
          ) : (
            isBuffering && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.2)]" />
                <span className="text-xs tracking-wider text-indigo-400 font-medium bg-neutral-950/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
                  Conectando...
                </span>
              </div>
            )
          )}
        </div>

        {/* Bottom Channel Info Panel */}
        <div className="w-full max-w-4xl mx-auto pointer-events-auto">
          <div className="p-4 md:p-6 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-md shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between transition-all duration-300 hover:border-white/15">
            
            {/* Channel Details */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-16 h-16 rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                <img
                  src={TEST_CHANNEL.logo}
                  alt={TEST_CHANNEL.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/Alplox/json-teles/refs/heads/main/favicon.png';
                  }}
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
                    {TEST_CHANNEL.group}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">Stream HLS</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-white">
                  {TEST_CHANNEL.name}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-1 truncate max-w-sm">
                  {TEST_CHANNEL.url}
                </p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-end border-t border-white/5 pt-4 md:pt-0 md:border-none">
              <button
                type="button"
                onClick={togglePlay}
                disabled={!!errorMsg}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white hover:bg-neutral-200 text-neutral-950 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95 shrink-0"
                title={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  // Pause SVG
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  // Play SVG
                  <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>
            
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

export default App;
