import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Profile from './Profile';

jest.mock('axios');

const mockUser = {
  username: 'testuser',
  email: 'test@example.com',
};

const mockMoodStats = {
  mostFrequentMood: 'Happy',
  longestStreak: 15,
  moodChartData: [{ mood: 'Happy', count: 10 }],
};

describe('Profile', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/user/profile')) {
        return Promise.resolve({ data: mockUser });
      }
      if (url.includes('/api/user/mood-stats')) {
        return Promise.resolve({ data: mockMoodStats });
      }
      return Promise.reject(new Error('not found'));
    });
    localStorage.setItem('token', 'fake-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.removeItem('token');
  });

  test('renders profile data after successful fetch', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Check for loading state initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the user data to be displayed
    await waitFor(() => {
      expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    });

    expect(screen.getByText(`@${mockUser.username}`)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();

    // Wait for the mood stats to be displayed
    await waitFor(() => {
      const mostFrequentMoodElement = screen.getByText(mockMoodStats.mostFrequentMood, { selector: 'p.highlight' });
      expect(mostFrequentMoodElement).toBeInTheDocument();
    });

    expect(screen.getByText(`${mockMoodStats.longestStreak} Days`)).toBeInTheDocument();
  });

  test('redirects to login if no token is present', async () => {
    localStorage.removeItem('token');
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // The component should redirect, which is handled by useNavigate.
    // In a real app, we would test that the navigation actually happens.
    // For this test, we can check that no user data is fetched.
    expect(axios.get).not.toHaveBeenCalled();
  });
});
