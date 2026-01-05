// Validation result interface
interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

const ValidationService = {
  validateEmail(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    return {
      isValid,
      error: isValid ? null : 'Please enter a valid email address',
    };
  },

  validatePassword(password: string): ValidationResult {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < minLength) {
      return {
        isValid: false,
        error: 'Password must be at least 8 characters',
      };
    }

    if (!hasUppercase) {
      return {
        isValid: false,
        error: 'Password must contain at least one uppercase letter',
      };
    }

    if (!hasLowercase) {
      return {
        isValid: false,
        error: 'Password must contain at least one lowercase letter',
      };
    }

    if (!hasNumber) {
      return {
        isValid: false,
        error: 'Password must contain at least one number',
      };
    }

    return {
      isValid: true,
      error: null,
    };
  },

  validateRequired(value: string, fieldName: string): ValidationResult {
    const isValid = value && value.trim().length > 0;
    return {
      isValid: Boolean(isValid),
      error: isValid ? null : `${fieldName} is required`,
    };
  },

  validateFileSize(file: File, maxSizeMB: number): ValidationResult {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const isValid = file.size <= maxSizeBytes;
    return {
      isValid,
      error: isValid ? null : `Image must be smaller than ${maxSizeMB}MB`,
    };
  },

  validateFileType(file: File, allowedTypes: string[]): ValidationResult {
    const isValid = allowedTypes.includes(file.type);
    return {
      isValid,
      error: isValid ? null : 'Only image files are accepted (JPG, PNG, GIF)',
    };
  },
};

export default ValidationService;