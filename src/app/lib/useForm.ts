import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';

export interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validationSchema?: ZodSchema;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  touched: Set<string>;
  setFieldValue: (field: string, value: any) => void;
  setFieldTouched: (field: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setErrors: (errors: Record<string, string>) => void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validationSchema,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const setFieldValue = useCallback((field: string, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const setFieldTouched = useCallback((field: string) => {
    setTouched(prev => new Set([...prev, field]));
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [values, validationSchema]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setErrors({ _submit: message });
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit, validateForm]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched(new Set());
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    touched,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    resetForm,
    setErrors,
  };
}
