import { useState } from 'react';

interface UseConfirmOptions {
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
}

export function useConfirm() {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<UseConfirmOptions>({});
    const [resolveCallback, setResolveCallback] = useState<
        ((value: boolean) => void) | null
    >(null);

    const confirm = (opts: UseConfirmOptions = {}): Promise<boolean> => {
        setOptions(opts);
        setIsOpen(true);

        return new Promise<boolean>((resolve) => {
            setResolveCallback(() => resolve);
        });
    };

    const handleConfirm = () => {
        if (resolveCallback) {
            resolveCallback(true);
        }
        setIsOpen(false);
        setResolveCallback(null);
    };

    const handleCancel = () => {
        if (resolveCallback) {
            resolveCallback(false);
        }
        setIsOpen(false);
        setResolveCallback(null);
    };

    return {
        isOpen,
        options,
        confirm,
        handleConfirm,
        handleCancel,
    };
}
