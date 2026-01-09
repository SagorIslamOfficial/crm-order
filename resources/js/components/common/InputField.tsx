import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea, TextareaProps } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import React, { forwardRef, useId } from 'react';

export interface InputFieldProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: React.ReactNode;
    containerClassName?: string;
    textarea?: boolean;
    rows?: number;
}

export const InputField = forwardRef<
    HTMLInputElement | HTMLTextAreaElement,
    InputFieldProps
>(
    (
        {
            label,
            error,
            helperText,
            className,
            containerClassName,
            id,
            required,
            textarea = false,
            rows,
            ...props
        },
        ref,
    ) => {
        const generatedId = useId();
        const inputId = id || generatedId;

        const commonProps = {
            id: inputId,
            className: cn(error && 'border-destructive', className),
            'aria-invalid': !!error,
            'aria-describedby': error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined,
            required,
        };

        return (
            <div className={cn('space-y-2', containerClassName)}>
                {label && (
                    <Label
                        htmlFor={inputId}
                        className={cn(error && 'text-destructive')}
                    >
                        {label}
                        {required && (
                            <span className="ml-1 text-destructive">*</span>
                        )}
                    </Label>
                )}

                {textarea ? (
                    <Textarea
                        {...(props as TextareaProps)}
                        {...commonProps}
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        rows={rows}
                    />
                ) : (
                    <Input
                        {...props}
                        {...commonProps}
                        ref={ref as React.Ref<HTMLInputElement>}
                    />
                )}

                {helperText && !error && (
                    <div
                        id={`${inputId}-helper`}
                        className="text-xs text-muted-foreground"
                    >
                        {helperText}
                    </div>
                )}

                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="text-xs font-medium text-destructive"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

InputField.displayName = 'InputField';
