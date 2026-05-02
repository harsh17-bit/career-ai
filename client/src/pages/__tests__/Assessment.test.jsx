import React from 'react';
import { render, screen } from '@testing-library/react';
import Assessment from '../Assessment';

// Mock auth store and API to allow render without network
jest.mock('../../store/authStore', () => () => ({
  user: { profile: {} },
  updateUser: jest.fn(),
  token: null,
}));

jest.mock('../../services/api', () => ({
  careerAPI: {
    getRecommendations: jest.fn(() =>
      Promise.resolve({ data: { careers: [] } })
    ),
  },
}));

describe('Assessment page', () => {
  it('renders without crashing and shows step counter', () => {
    render(<Assessment />);
    expect(screen.getByText(/\/ 05/)).toBeInTheDocument();
  });
});
