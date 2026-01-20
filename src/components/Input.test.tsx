import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input Component', () => {
  it('renders with label', () => {
    render(<Input label="Email" value="" onChange={() => {}} />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter email" value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('displays required indicator when required', () => {
    render(<Input label="Email" required value="" onChange={() => {}} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('calls onChange when value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'test');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays error message when error prop is provided', () => {
    render(<Input label="Email" value="" onChange={() => {}} error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('adds error class when error is present', () => {
    render(<Input value="" onChange={() => {}} error="Error message" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('input-error');
  });

  it('renders different input types', () => {
    const { rerender } = render(<Input type="email" value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    
    rerender(<Input type="password" value="" onChange={() => {}} />);
    const passwordInput = document.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();
  });

  it('sets aria-invalid when error is present', () => {
    render(<Input value="" onChange={() => {}} error="Error" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
});