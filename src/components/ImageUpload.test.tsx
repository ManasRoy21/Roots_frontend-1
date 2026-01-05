import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageUpload from './ImageUpload';

describe('ImageUpload Component', () => {
  it('renders upload placeholder when no preview', () => {
    render(<ImageUpload onUpload={() => {}} />);
    expect(screen.getByRole('button', { name: 'Upload profile photo' })).toBeInTheDocument();
  });

  it('displays preview when preview prop is provided', () => {
    render(<ImageUpload onUpload={() => {}} preview="https://example.com/photo.jpg" />);
    const img = screen.getByAltText('Profile preview');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('validates file size and calls onUpload with error for large files', async () => {
    const handleUpload = vi.fn();
    const user = userEvent.setup();
    render(<ImageUpload onUpload={handleUpload} maxSize={5} />);
    
    // Create a large file (6MB)
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, largeFile);
    
    expect(handleUpload).toHaveBeenCalledWith(null, 'Image must be smaller than 5MB');
  });

  it('validates file type and calls onUpload with error for non-image files', () => {
    const handleUpload = vi.fn();
    render(<ImageUpload onUpload={handleUpload} />);
    
    const textFile = new File(['content'], 'document.txt', { type: 'text/plain' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Manually trigger the change event to bypass browser file type filtering
    const changeEvent = new Event('change', { bubbles: true });
    Object.defineProperty(input, 'files', {
      value: [textFile],
      writable: false,
    });
    input.dispatchEvent(changeEvent);
    
    expect(handleUpload).toHaveBeenCalledWith(null, 'Only image files are accepted (JPG, PNG, GIF)');
  });

  it('calls onUpload with file for valid image', async () => {
    const handleUpload = vi.fn();
    const user = userEvent.setup();
    render(<ImageUpload onUpload={handleUpload} maxSize={5} />);
    
    const validFile = new File(['image'], 'photo.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, validFile);
    
    expect(handleUpload).toHaveBeenCalledWith(validFile, null);
  });

  it('displays error message when error prop is provided', () => {
    render(<ImageUpload onUpload={() => {}} error="File too large" />);
    expect(screen.getByText('File too large')).toBeInTheDocument();
  });

  it('opens file picker when clicked', async () => {
    const user = userEvent.setup();
    render(<ImageUpload onUpload={() => {}} />);
    
    const button = screen.getByRole('button', { name: 'Upload profile photo' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    const clickSpy = vi.spyOn(input, 'click');
    await user.click(button);
    
    expect(clickSpy).toHaveBeenCalled();
  });
});