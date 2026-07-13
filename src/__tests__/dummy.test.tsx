import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders Verteles IPTV title', () => {
    render(<App />);
    expect(screen.getByText(/VERTELES/i)).toBeInTheDocument();
  });
});
