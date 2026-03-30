// Error handling utilities

export class ValidationError extends Error {
  constructor(public errors: Record<string, string>) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleError(error: unknown): { message: string; errors?: Record<string, string> } {
  if (error instanceof ValidationError) {
    return {
      message: 'Validation failed',
      errors: error.errors,
    };
  }

  if (error instanceof ApiError) {
    return {
      message: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unexpected error occurred',
  };
}

// Form-specific error utilities
export function getFieldError(errors: Record<string, string> | undefined, fieldName: string): string | undefined {
  if (!errors) return undefined;
  return errors[fieldName];
}

export function hasErrors(errors: Record<string, string> | undefined): boolean {
  return !!(errors && Object.keys(errors).length > 0);
}
