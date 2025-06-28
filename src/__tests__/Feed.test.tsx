import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Feed } from '../pages/Feed';
import { useFeedStore } from '../stores/feedStore';
import { useAuthStore } from '../stores/authStore';

// Mock the stores
jest.mock('../stores/feedStore');
jest.mock('../stores/authStore');

const mockUseFeedStore = useFeedStore as jest.MockedFunction<typeof useFeedStore>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

const mockPosts = [
  {
    id: '1',
    content: 'Test post content',
    author: {
      id: 'user1',
      fullName: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
      headline: 'Software Engineer'
    },
    type: 'text',
    likesCount: 5,
    commentsCount: 2,
    sharesCount: 1,
    hasLiked: false,
    createdAt: '2023-01-01T00:00:00Z',
    visibility: 'public'
  }
];

const mockUser = {
  id: 'user1',
  fullName: 'John Doe',
  email: 'john@example.com',
  role: 'mentee'
};

describe('Feed Component', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      loading: false,
      error: null
    });

    mockUseFeedStore.mockReturnValue({
      posts: mockPosts,
      loading: false,
      hasMore: true,
      filters: {},
      fetchPosts: jest.fn(),
      setFilters: jest.fn(),
      clearFilters: jest.fn(),
      refreshFeed: jest.fn()
    });
  });

  const renderFeed = () => {
    return render(
      <BrowserRouter>
        <Feed />
      </BrowserRouter>
    );
  };

  it('renders feed correctly', () => {
    renderFeed();
    
    expect(screen.getByText('Your Feed')).toBeInTheDocument();
    expect(screen.getByText('Test post content')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseFeedStore.mockReturnValue({
      posts: [],
      loading: true,
      hasMore: true,
      filters: {},
      fetchPosts: jest.fn(),
      setFilters: jest.fn(),
      clearFilters: jest.fn(),
      refreshFeed: jest.fn()
    });

    renderFeed();
    
    expect(screen.getByText('Loading posts...')).toBeInTheDocument();
  });

  it('shows empty state when no posts', () => {
    mockUseFeedStore.mockReturnValue({
      posts: [],
      loading: false,
      hasMore: false,
      filters: {},
      fetchPosts: jest.fn(),
      setFilters: jest.fn(),
      clearFilters: jest.fn(),
      refreshFeed: jest.fn()
    });

    renderFeed();
    
    expect(screen.getByText('No posts yet')).toBeInTheDocument();
  });

  it('handles filter changes', async () => {
    const mockSetFilters = jest.fn();
    const mockFetchPosts = jest.fn();

    mockUseFeedStore.mockReturnValue({
      posts: mockPosts,
      loading: false,
      hasMore: true,
      filters: {},
      fetchPosts: mockFetchPosts,
      setFilters: mockSetFilters,
      clearFilters: jest.fn(),
      refreshFeed: jest.fn()
    });

    renderFeed();
    
    const jobsFilter = screen.getByText('Jobs');
    fireEvent.click(jobsFilter);

    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith({ type: 'job' });
      expect(mockFetchPosts).toHaveBeenCalledWith({ 
        page: 0, 
        refresh: true, 
        filters: { type: 'job' } 
      });
    });
  });

  it('handles refresh', async () => {
    const mockRefreshFeed = jest.fn();

    mockUseFeedStore.mockReturnValue({
      posts: mockPosts,
      loading: false,
      hasMore: true,
      filters: {},
      fetchPosts: jest.fn(),
      setFilters: jest.fn(),
      clearFilters: jest.fn(),
      refreshFeed: mockRefreshFeed
    });

    renderFeed();
    
    const refreshButton = screen.getByLabelText('Refresh feed');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockRefreshFeed).toHaveBeenCalled();
    });
  });

  it('redirects to login when user is not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      loading: false,
      error: null
    });

    renderFeed();
    
    expect(screen.getByText('Welcome to CareerNest')).toBeInTheDocument();
    expect(screen.getByText('Please log in to view your feed')).toBeInTheDocument();
  });
});