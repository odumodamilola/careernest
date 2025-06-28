import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreatePostCard } from '../components/feed/CreatePostCard';
import { useAuthStore } from '../stores/authStore';
import { useFeedStore } from '../stores/feedStore';

jest.mock('../stores/authStore');
jest.mock('../stores/feedStore');

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
const mockUseFeedStore = useFeedStore as jest.MockedFunction<typeof useFeedStore>;

const mockUser = {
  id: 'user1',
  fullName: 'John Doe',
  email: 'john@example.com',
  role: 'mentee' as const,
  avatar: 'https://example.com/avatar.jpg'
};

describe('CreatePostCard Component', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser
    });

    mockUseFeedStore.mockReturnValue({
      createPost: jest.fn()
    });
  });

  const renderCreatePostCard = (props = {}) => {
    return render(<CreatePostCard {...props} />);
  };

  it('renders create post form correctly', () => {
    renderCreatePostCard();
    
    expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument();
    expect(screen.getByText('Post')).toBeInTheDocument();
    expect(screen.getByDisplayValue('🌍 Public')).toBeInTheDocument();
  });

  it('does not render when user is not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      user: null
    });

    const { container } = renderCreatePostCard();
    expect(container.firstChild).toBeNull();
  });

  it('handles text input and character count', () => {
    renderCreatePostCard();
    
    const textarea = screen.getByPlaceholderText("What's on your mind?");
    const testContent = 'This is a test post';
    
    fireEvent.change(textarea, { target: { value: testContent } });
    
    expect(textarea).toHaveValue(testContent);
    expect(screen.getByText(`${testContent.length}/2000`)).toBeInTheDocument();
  });

  it('shows error for content over limit', () => {
    renderCreatePostCard();
    
    const textarea = screen.getByPlaceholderText("What's on your mind?");
    const longContent = 'a'.repeat(2001);
    
    fireEvent.change(textarea, { target: { value: longContent } });
    
    expect(screen.getByText('2001/2000')).toHaveClass('text-red-500');
  });

  it('validates empty content', async () => {
    renderCreatePostCard();
    
    const postButton = screen.getByText('Post');
    fireEvent.click(postButton);

    await waitFor(() => {
      expect(screen.getByText('Please add some content or media to your post.')).toBeInTheDocument();
    });
  });

  it('handles file selection', () => {
    renderCreatePostCard();
    
    const fileInput = screen.getByRole('button', { name: /add images/i }).querySelector('input');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(fileInput!);
    
    // Should show preview
    expect(screen.getByAltText('Preview 1')).toBeInTheDocument();
  });

  it('validates file types', async () => {
    renderCreatePostCard();
    
    const fileInput = screen.getByRole('button', { name: /add images/i }).querySelector('input');
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    Object.defineProperty(fileInput, 'files', {
      value: [invalidFile],
      writable: false,
    });
    
    fireEvent.change(fileInput!);

    await waitFor(() => {
      expect(screen.getByText(/File type text\/plain is not supported/)).toBeInTheDocument();
    });
  });

  it('validates file size', async () => {
    renderCreatePostCard();
    
    const fileInput = screen.getByRole('button', { name: /add images/i }).querySelector('input');
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    
    Object.defineProperty(fileInput, 'files', {
      value: [largeFile],
      writable: false,
    });
    
    fireEvent.change(fileInput!);

    await waitFor(() => {
      expect(screen.getByText(/File size must be less than 10MB/)).toBeInTheDocument();
    });
  });

  it('removes media files', () => {
    renderCreatePostCard();
    
    const fileInput = screen.getByRole('button', { name: /add images/i }).querySelector('input');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(fileInput!);
    
    const removeButton = screen.getByLabelText('Remove image 1');
    fireEvent.click(removeButton);
    
    expect(screen.queryByAltText('Preview 1')).not.toBeInTheDocument();
  });

  it('handles post submission', async () => {
    const mockCreatePost = jest.fn();
    mockUseFeedStore.mockReturnValue({
      createPost: mockCreatePost
    });

    renderCreatePostCard();
    
    const textarea = screen.getByPlaceholderText("What's on your mind?");
    const postButton = screen.getByText('Post');
    
    fireEvent.change(textarea, { target: { value: 'Test post content' } });
    fireEvent.click(postButton);

    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalledWith({
        content: 'Test post content',
        visibility: 'public',
        mediaUrls: [],
        authorId: 'user1',
        type: 'text'
      });
    });
  });

  it('changes visibility setting', () => {
    renderCreatePostCard();
    
    const visibilitySelect = screen.getByLabelText('Post visibility');
    fireEvent.change(visibilitySelect, { target: { value: 'followers' } });
    
    expect(visibilitySelect).toHaveValue('followers');
  });

  it('prevents XSS in content', async () => {
    renderCreatePostCard();
    
    const textarea = screen.getByPlaceholderText("What's on your mind?");
    const postButton = screen.getByText('Post');
    
    fireEvent.change(textarea, { target: { value: '<script>alert("xss")</script>' } });
    fireEvent.click(postButton);

    await waitFor(() => {
      expect(screen.getByText('Content contains potentially harmful code.')).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    const mockCreatePost = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    mockUseFeedStore.mockReturnValue({
      createPost: mockCreatePost
    });

    renderCreatePostCard();
    
    const textarea = screen.getByPlaceholderText("What's on your mind?");
    const postButton = screen.getByText('Post');
    
    fireEvent.change(textarea, { target: { value: 'Test post' } });
    fireEvent.click(postButton);

    expect(screen.getByText('Posting...')).toBeInTheDocument();
    expect(postButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText('Post')).toBeInTheDocument();
    });
  });
});