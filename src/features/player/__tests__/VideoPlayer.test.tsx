import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { VideoPlayer } from '../components/VideoPlayer';

// Mock WebPlayer and TizenPlayer to verify which one is mounted
vi.mock('../components/WebPlayer', () => ({
  WebPlayer: () => <div data-testid="web-player">Web Player Mocked</div>,
}));

vi.mock('../components/TizenPlayer', () => ({
  TizenPlayer: () => <div data-testid="tizen-player">Tizen Player Mocked</div>,
}));

describe('VideoPlayer Component', () => {
  const originalWebapis = (window as any).webapis;
  const originalTizen = (window as any).tizen;

  beforeEach(() => {
    // Reset window objects
    delete (window as any).webapis;
    delete (window as any).tizen;
    vi.resetModules();
  });

  afterEach(() => {
    (window as any).webapis = originalWebapis;
    (window as any).tizen = originalTizen;
  });

  it('renders WebPlayer on browser environment', () => {
    const { getByTestId, queryByTestId } = render(
      <VideoPlayer url="https://example.com/stream.m3u8" />
    );

    expect(getByTestId('web-player')).toBeInTheDocument();
    expect(queryByTestId('tizen-player')).not.toBeInTheDocument();
  });

  it('renders TizenPlayer on Tizen OS environment (webapis defined)', () => {
    // Mock webapis on window
    (window as any).webapis = {
      avplay: {
        open: vi.fn(),
        prepareAsync: vi.fn(),
        setDisplayRect: vi.fn(),
        setListener: vi.fn(),
        play: vi.fn(),
        stop: vi.fn(),
        close: vi.fn(),
      },
    };

    const { getByTestId, queryByTestId } = render(
      <VideoPlayer url="https://example.com/stream.m3u8" />
    );

    expect(getByTestId('tizen-player')).toBeInTheDocument();
    expect(queryByTestId('web-player')).not.toBeInTheDocument();
  });

  it('renders TizenPlayer on Tizen OS environment (tizen defined)', () => {
    // Mock tizen on window
    (window as any).tizen = {};

    const { getByTestId, queryByTestId } = render(
      <VideoPlayer url="https://example.com/stream.m3u8" />
    );

    expect(getByTestId('tizen-player')).toBeInTheDocument();
    expect(queryByTestId('web-player')).not.toBeInTheDocument();
  });
});
