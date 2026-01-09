import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useId, useMemo, useState } from 'react';

export interface SelectOption {
    label: string;
    value: string;
}

export interface SelectFieldProps {
    label?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    options: SelectOption[];
    error?: string;
    helperText?: React.ReactNode;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    containerClassName?: string;
    id?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    value,
    onValueChange,
    placeholder = 'Select an option',
    options,
    error,
    helperText,
    disabled,
    required,
    className,
    containerClassName,
    id,
}) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAll, setShowAll] = useState(false);

    const filteredOptions = useMemo(() => {
        return options.filter((option) =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [options, searchQuery]);

    const displayedOptions = useMemo(() => {
        if (searchQuery || showAll) return filteredOptions;
        return filteredOptions.slice(0, 10);
    }, [filteredOptions, searchQuery, showAll]);

    const hasMore = filteredOptions.length > 10;

    return (
        <div className={cn('space-y-2', containerClassName)}>
            {label && (
                <Label
                    htmlFor={selectId}
                    className={cn(error && 'text-destructive')}
                >
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </Label>
            )}

            <Popover
                open={open}
                onOpenChange={(newOpen) => {
                    setOpen(newOpen);
                    if (!newOpen) {
                        setSearchQuery('');
                        setShowAll(false);
                    }
                }}
            >
                <PopoverTrigger asChild>
                    <Button
                        id={selectId}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            'w-full justify-between font-normal hover:bg-transparent',
                            !value && 'text-muted-foreground',
                            error &&
                                'border-destructive focus-visible:ring-destructive/20',
                            className,
                        )}
                    >
                        <span className="truncate">
                            {value
                                ? options.find(
                                      (option) => option.value === value,
                                  )?.label
                                : placeholder}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                >
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={placeholder}
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                        />
                        <CommandList>
                            {displayedOptions.length === 0 && (
                                <CommandEmpty>No results found.</CommandEmpty>
                            )}
                            <CommandGroup>
                                {displayedOptions.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() => {
                                            onValueChange?.(option.value);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value === option.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        {hasMore && !showAll && !searchQuery && (
                            <div
                                className="border-t bg-muted/20 p-2 text-center"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onClick={() => setShowAll(true)}
                            >
                                <button
                                    type="button"
                                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Show all {filteredOptions.length} results
                                </button>
                            </div>
                        )}
                    </Command>
                </PopoverContent>
            </Popover>

            {helperText && !error && (
                <p className="text-xs text-muted-foreground">{helperText}</p>
            )}
            {error && (
                <p className="text-xs font-medium text-destructive">{error}</p>
            )}
        </div>
    );
};

SelectField.displayName = 'SelectField';
