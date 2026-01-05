import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormError from './FormError';

describe('FormError Component', () => {
  it('renders error message', () => {
    render(<FormError message="This is an error" />);
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });

  it('has alert role for accessibility', () => {
    render(<FormError message="Error message" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('does not render when message is null', () => {
    const { container } = render(<FormError message={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('does not render when message is empty string', () => {
    const { container } = render(<FormError message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders with custom className', () => {
    const { container } = render(<FormError message="Error" className="custom-class" />);
    expect(container.firstChild).toHaveClass('form-error', 'custom-class');
  });
});