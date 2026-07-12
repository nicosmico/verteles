import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders Verteves IPTV title', () => {
    render(<App />);
    expect(screen.getByText(/Verteves IPTV/i)).toBeInTheDocument();
  });
});
