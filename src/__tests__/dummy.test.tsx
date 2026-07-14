import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  beforeEach(() => {
    // Mock canvas getContext to avoid JSDOM warnings during particle simulation
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      fillRect: vi.fn(),
      createRadialGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      }),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillText: vi.fn(),
    });
  });

  it('renders default application layout with mock list title', async () => {
    await act(async () => {
      render(<App />);
    });
    // Should render the visual list header title
    expect(screen.getByText(/Mi lista principal/i)).toBeInTheDocument();
  });
});
