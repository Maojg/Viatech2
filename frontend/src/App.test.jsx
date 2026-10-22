import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('muestra el inicio de sesión', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /inicio de sesión/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /regístrate aquí/i })).toHaveAttribute('href', '/registro');
  });
});
