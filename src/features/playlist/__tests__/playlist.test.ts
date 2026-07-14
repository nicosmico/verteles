import { describe, it, expect, beforeEach } from 'vitest';
import { usePlaylistStore } from '../store/usePlaylistStore';

describe('Playlist Store (Hito 3 Mock Store)', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    const { channels } = usePlaylistStore.getState();
    usePlaylistStore.setState({
      channels,
      currentChannel: channels[0] || null,
      favorites: [],
    });
  });

  it('should initialize with mock channels and the first channel as active', () => {
    const state = usePlaylistStore.getState();
    expect(state.channels.length).toBeGreaterThan(0);
    expect(state.currentChannel).not.toBeNull();
    expect(state.currentChannel?.id).toBe(state.channels[0].id);
    expect(state.favorites).toEqual([]);
  });

  it('should select a channel successfully', () => {
    const { channels, setCurrentChannel } = usePlaylistStore.getState();
    const secondChannel = channels[1];
    
    expect(secondChannel).toBeDefined();
    
    setCurrentChannel(secondChannel);
    
    const state = usePlaylistStore.getState();
    expect(state.currentChannel?.id).toBe(secondChannel.id);
  });

  it('should toggle favorite channels correctly', () => {
    const { channels, toggleFavorite } = usePlaylistStore.getState();
    const targetChannel = channels[0];
    
    // Toggle active favorite (add)
    toggleFavorite(targetChannel.id);
    expect(usePlaylistStore.getState().favorites).toContain(targetChannel.id);
    
    // Toggle active favorite again (remove)
    toggleFavorite(targetChannel.id);
    expect(usePlaylistStore.getState().favorites).not.toContain(targetChannel.id);
  });

  it('should cycle channels (zapping next and prev) with wrapping support', () => {
    const { channels, goToNextChannel, goToPreviousChannel, setCurrentChannel } = usePlaylistStore.getState();
    expect(channels.length).toBeGreaterThan(1);
    
    // Set to first channel
    setCurrentChannel(channels[0]);
    
    // Cycle next -> should go to second channel
    goToNextChannel();
    expect(usePlaylistStore.getState().currentChannel?.id).toBe(channels[1].id);
    
    // Set to last channel
    setCurrentChannel(channels[channels.length - 1]);
    
    // Cycle next from last -> should wrap to first channel
    goToNextChannel();
    expect(usePlaylistStore.getState().currentChannel?.id).toBe(channels[0].id);
    
    // Cycle prev from first -> should wrap to last channel
    goToPreviousChannel();
    expect(usePlaylistStore.getState().currentChannel?.id).toBe(channels[channels.length - 1].id);
  });
});
