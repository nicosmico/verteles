import { useEffect, useState } from 'react';
import { isTizen } from './utils/platform';

import { usePlaylistStore } from './features/playlist/store/usePlaylistStore';
import { usePlayerStore } from './features/player/store/usePlayerStore';
import { VideoPlayer } from './features/player';

// Import components
import VisualStream from './features/player/components/VisualStream';
import ErrorOverlay from './features/player/components/ErrorOverlay';
import LoadingOverlay from './features/player/components/LoadingOverlay';
import ClickToPlayOverlay from './features/player/components/ClickToPlayOverlay';
import Sidebar from './core/layout/Sidebar';
import PlaybackBar from './features/player/components/PlaybackBar';
import ListsModal from './features/playlist/components/ListsModal';
import SettingsModal from './features/playlist/components/SettingsModal';
import TopBar from './core/layout/TopBar';

// Import hooks
import usePlayerInterface, { MODAL_LISTS, MODAL_SETTINGS } from './features/player/store/usePlayerInterface';

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
    isBuffering,
    errorMsg,
    retryKey,
    setIsBuffering,
    setErrorMsg,
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

  // On web: require an explicit user gesture before initiating playback.
  // Tizen has no autoplay restrictions so we skip this state there.
  const [needsUserGesture, setNeedsUserGesture] = useState(() => !isTizen());

  // Reset player state when channel changes.
  // needsUserGesture is NOT reset here — it only fires once on first app load.
  useEffect(() => {
    if (currentChannel) {
      setErrorMsg(null);
      // Only set buffering if the user has already unlocked playback (or we're on Tizen).
      if (!needsUserGesture) {
        setIsBuffering(true);
      }
    }
  }, [currentChannel, setErrorMsg, setIsBuffering, needsUserGesture]);

  const handleUserPlay = () => {
    setNeedsUserGesture(false);
    setIsBuffering(true);
  };

  const isCurrentChannelFav = currentChannel ? favorites.includes(currentChannel.id) : false;

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black font-sans text-white focus:outline-none select-none"
      onMouseMove={resetHideTimer}
      onClick={resetHideTimer}
    >
      {/* Full-screen video — only mounted after user gesture on web */}
      {currentChannel && !errorMsg && !needsUserGesture && (
        <div className="absolute inset-0 w-full h-full z-10">
          <VideoPlayer
            key={retryKey}
            url={currentChannel.url}
            onBuffering={setIsBuffering}
            onError={setErrorMsg}
          />
        </div>
      )}

      {/* Click-to-Play overlay — only on web, before user triggers playback */}
      {currentChannel && needsUserGesture && !errorMsg && (
        <ClickToPlayOverlay
          channelName={currentChannel.name}
          logo={currentChannel.logo}
          fallbackColor={currentChannel.fallbackColor}
          fallbackText={currentChannel.fallbackText}
          onPlay={handleUserPlay}
        />
      )}

      {/* Particles fallback when there is an error */}
      {currentChannel && errorMsg && (
        <VisualStream
          color={currentChannel.fallbackColor || '#ef4444'}
          name={currentChannel.name}
        />
      )}

      {/* Loading / Connecting Overlay — only shown after user has clicked play */}
      {isBuffering && !needsUserGesture && currentChannel && !errorMsg && (
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
