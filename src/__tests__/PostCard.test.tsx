import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PostCard } from '../components/feed/PostCard';
import { useAuthStore } from '../stores/authStore';
import { useFeedStore } from '../stores/feedStore';

jest.mock('../stores/authStore');
jest.mock('../stores/feedStore');

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
const mockUseFeedStore = useFeedStore as jest.MockedFunction<typeof useFeedStore>;

const mockPost = {
  id: '1',
  content: 'Test post content',
  author: {
    id: 'user1',
    fullName: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
    headline: 'Software Engineer',
    isVerified: true
  },
  type: 'text' as const,
  likesCount: 5,
  commentsCount: 2,
  sharesCount: 1,
  hasLiked: false,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  visibility: 'public' as const,
  isPinned: false
};

const mockUser = {
  id: 'user1',
  fullName: 'John Doe',
  email: 'john@example.com',
  role: 'mentee' as const
};

describe('PostCard Component', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser
    });

    mockUseFeedStore.mockReturnValue({
      likePost: jest.fn(),
      fetchComments: jest.fn(),
      addComment: jest.fn(),
      comments: {}
    });
  });

  const renderPostCard = (props = {}) => {
    return render(
      <BrowserRouter>
        <PostCard post={mockPost} {...props} />
      </BrowserRouter>
    );
  };

  it('renders post content correctly', () => {
    renderPostCard();
    
    expect(screen.getByText('Test post content')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // likes count
  });

  it('shows verified badge for verified users', () => {
    renderPostCard();
    
    expect(screen.getByLabelText('Verified user')).toBeInTheDocument();
  });

  it('handles like action', async () => {
    const mockLikePost = jest.fn();
    mockUseFeedStore.mockReturnValue({
      likePost: mockLikePost,
      fetchComments: jest.fn(),
      addComment: jest.fn(),
      comments: {}
    });

    renderPostCard();
    
    const likeButton = screen.getByLabelText('Like post');
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(mockLikePost).toHaveBeenCalledWith('1');
    });
  });

  it('handles comment toggle', async () => {
    const mockFetchComments = jest.fn();
    mockUseFeedStore.mockReturnValue({
      likePost: jest.fn(),
      fetchComments: mockFetchComments,
      addComment: jest.fn(),
      comments: {}
    });

    renderPostCard();
    
    const commentButton = screen.getByLabelText('Comment on post');
    fireEvent.click(commentButton);

    await waitFor(() => {
      expect(mockFetchComments).toHaveBeenCalledWith('1');
    });
  });

  it('handles comment submission', async () => {
    const mockAddComment = jest.fn();
    mockUseFeedStore.mockReturnValue({
      likePost: jest.fn(),
      fetchComments: jest.fn(),
      addComment: mockAddComment,
      comments: { '1': [] }
    });

    renderPostCard();
    
    // Open comments section
    const commentButton = screen.getByLabelText('Comment on post');
    fireEvent.click(commentButton);

    await waitFor(() => {
      const commentInput = screen.getByLabelText('Add a comment');
      const submitButton = screen.getByLabelText('Post comment');

      fireEvent.change(commentInput, { target: { value: 'Test comment' } });
      fireEvent.click(submitButton);

      expect(mockAddComment).toHaveBeenCalledWith('1', 'Test comment');
    });
  });

  it('shows post menu for post author', () => {
    renderPostCard();
    
    const menuButton = screen.getByLabelText('Post options');
    fireEvent.click(menuButton);

    expect(screen.getByText('Edit Post')).toBeInTheDocument();
    expect(screen.getByText('Delete Post')).toBeInTheDocument();
  });

  it('handles image error gracefully', () => {
    const postWithImage = {
      ...mockPost,
      images: ['https://invalid-image-url.jpg']
    };

    renderPostCard({ post: postWithImage });
    
    const image = screen.getByAltText('Post attachment');
    fireEvent.error(image);

    // Image should be hidden after error
    expect(image).not.toBeVisible();
  });

  it('sanitizes content to prevent XSS', () => {
    const postWithScript = {
      ...mockPost,
      content: 'Test content <script>alert("xss")</script>'
    };

    renderPostCard({ post: postWithScript });
    
    // Script tag should be removed
    expect(screen.queryByText('<script>alert("xss")</script>')).not.toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('handles share functionality', () => {
    // Mock navigator.share
    Object.assign(navigator, {
      share: jest.fn()
    });

    renderPostCard();
    
    const shareButton = screen.getByLabelText('Share post');
    fireEvent.click(shareButton);

    expect(navigator.share).toHaveBeenCalledWith({
      title: 'Post by John Doe',
      text: 'Test post content',
      url: window.location.href
    });
  });

  it('shows appropriate badges for different post types', () => {
    const jobPost = { ...mockPost, type: 'job' as const };
    const { rerender } = renderPostCard({ post: jobPost });
    
    expect(screen.getByText('Job Opportunity')).toBeInTheDocument();

    const certificatePost = { ...mockPost, type: 'certificate' as const };
    rerender(
      <BrowserRouter>
        <PostCard post={certificatePost} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Certificate Earned')).toBeInTheDocument();
  });
});