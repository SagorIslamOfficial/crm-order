import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldProps {
    type?:
        | 'text'
        | 'email'
        | 'password'
        | 'number'
        | 'tel'
        | 'url'
        | 'date'
        | 'time'
        | 'datetime-local'
        | 'select'
        | 'textarea';
    id: string;
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    options?: Array<{ value: string; label: string }>;
    rows?: number;
    className?: string;
    description?: string;
}

export function FormField({
    type = 'text',
    id,
    label,
    value,
    onChange,
    error,
    required = false,
    placeholder,
    disabled = false,
    options = [],
    rows = 3,
    className = '',
    description,
}: FormFieldProps) {
    const renderInput = () => {
        if (type === 'select') {
            return (
                <Select
                    value={String(value)}
                    onValueChange={onChange}
                    disabled={disabled}
                >
                    <SelectTrigger
                        id={id}
                        className={error ? 'border-destructive' : ''}
                    >
                        <SelectValue
                            placeholder={placeholder || `Select ${label}`}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        }

        if (type === 'textarea') {
            return (
                <Textarea
                    id={id}
                    value={String(value)}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={rows}
                    className={error ? 'border-destructive' : ''}
                />
            );
        }

        return (
            <Input
                type={type}
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={error ? 'border-destructive' : ''}
            />
        );
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor={id}>
                {label}
                {required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {renderInput()}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
