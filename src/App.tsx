import { useEffect } from 'react';

import { usePlaylistStore } from './features/playlist/store/usePlaylistStore';
import { usePlayerStore } from './features/player/store/usePlayerStore';
import { VideoPlayer } from './features/player';

// Import components
import VisualStream from './features/player/components/VisualStream';
import ErrorOverlay from './features/player/components/ErrorOverlay';
import LoadingOverlay from './features/player/components/LoadingOverlay';
import Sidebar from './features/playlist/components/Sidebar';
import PlaybackBar from './features/playlist/components/PlaybackBar';
import ListsModal from './features/playlist/components/ListsModal';
import SettingsModal from './features/playlist/components/SettingsModal';
import TopBar from './components/TopBar';

// Import hooks
import usePlayerInterface, { MODAL_LISTS, MODAL_SETTINGS } from './hooks/usePlayerInterface';

export default function App() {
  // Zustand Store bindings
  const {
    currentChannel,
    favorites,
    toggleFavorite,
    goToNextChannel,
    goToPreviousChannel,
  } = usePlaylistStore();

  const {
    isPlaying,
    isBuffering,
    errorMsg,
    retryKey,
    setIsPlaying,
    setIsBuffering,
    setErrorMsg,
    togglePlayPause,
    triggerRetry,
  } = usePlayerStore();

  // Player Interface Custom Hook (handles sidebarOpen, showControls, auto-hide logic, and active modal)
  const {
    sidebarOpen,
    setSidebarOpen,
    showControls,
    resetHideTimer,
    modal,
    setModal,
  } = usePlayerInterface();

  // Reset player state and error when channel changes
  useEffect(() => {
    if (currentChannel) {
      setErrorMsg(null);
      setIsPlaying(true);
      setIsBuffering(true);
    }
  }, [currentChannel, setErrorMsg, setIsPlaying, setIsBuffering]);

  const isCurrentChannelFav = currentChannel ? favorites.includes(currentChannel.id) : false;

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black font-sans text-white focus:outline-none select-none"
      onMouseMove={resetHideTimer}
      onClick={resetHideTimer}
    >
      {/* Full-screen video */}
      {currentChannel && !errorMsg && (
        <div className="absolute inset-0 w-full h-full z-10">
          <VideoPlayer
            key={`${currentChannel.id}-${retryKey}`}
            url={currentChannel.url}
            autoplay={isPlaying}
            onPlayStateChange={setIsPlaying}
            onBuffering={setIsBuffering}
            onError={setErrorMsg}
          />
        </div>
      )}

      {/* Particles fallback when there is an error */}
      {currentChannel && errorMsg && (
        <VisualStream
          color={currentChannel.fallbackColor || '#ef4444'}
          name={currentChannel.name}
        />
      )}

      {/* Loading / Connecting Overlay */}
      {isBuffering && currentChannel && !errorMsg && (
        <LoadingOverlay
          channelName={currentChannel.name}
          logo={currentChannel.logo}
          fallbackColor={currentChannel.fallbackColor}
          fallbackText={currentChannel.fallbackText}
        />
      )}

      {/* Channel Unavailable Banner */}
      {errorMsg && currentChannel && (
        <ErrorOverlay
          channelName={currentChannel.name}
          onRetry={triggerRetry}
        />
      )}

      {/* Ambient Overlay Vignette */}
      <div className="pointer-events-none absolute inset-0 z-15 bg-gradient-to-t from-black/75 via-transparent to-black/40" />
      <div className="pointer-events-none absolute inset-0 z-15 bg-gradient-to-r from-black/55 via-transparent to-transparent" />

      {/* Sidebar Overlay and Drawer */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 z-30 bg-black/60 transition-opacity animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`absolute inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <Sidebar
          onClose={() => setSidebarOpen(false)}
          onListClick={() => setModal(MODAL_LISTS)}
          onSettingsClick={() => setModal(MODAL_SETTINGS)}
        />
      </div>

      {/* Top Navigation Bar */}
      <TopBar />

      {/* Bottom Playback & Status Bar */}
      {currentChannel && (showControls || errorMsg) && (
        <PlaybackBar
          channel={currentChannel}
          isPlaying={isPlaying}
          onPlayPauseToggle={togglePlayPause}
          onReload={triggerRetry}
          isFavorite={isCurrentChannelFav}
          onFavoriteToggle={() => toggleFavorite(currentChannel.id)}
          onPrevChannel={goToPreviousChannel}
          onNextChannel={goToNextChannel}
        />
      )}

      {/* Modal overlays */}
      {modal === MODAL_LISTS && <ListsModal onClose={() => setModal(null)} />}
      {modal === MODAL_SETTINGS && <SettingsModal onClose={() => setModal(null)} />}
    </div>
  );
}
