import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the reading prescriptions landing page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /weekly reading assignments for every student/i })).toBeDefined();
});
