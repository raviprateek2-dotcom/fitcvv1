'use client';

import { useEffect, useCallback } from 'react';

interface UseUndoRedoKeyboardProps {
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

/**
 * Attaches keyboard shortcuts for undo (Ctrl+Z) and redo (Ctrl+Y / Ctrl+Shift+Z).
 * This hook is safe to use in any client component and automatically cleans up on unmount.
 */
export function useUndoRedoKeyboard({
    onUndo,
    onRedo,
    canUndo,
    canRedo,
}: UseUndoRedoKeyboardProps) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // Ignore if typing in an input, textarea, or contenteditable
            const target = e.target as HTMLElement;
            const isEditing =
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable;

            if (isEditing) return;

            const isCtrlOrCmd = e.ctrlKey || e.metaKey;

            if (isCtrlOrCmd && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                if (canUndo) onUndo();
            } else if (
                isCtrlOrCmd &&
                (e.key === 'y' || (e.key === 'z' && e.shiftKey))
            ) {
                e.preventDefault();
                if (canRedo) onRedo();
            }
        },
        [onUndo, onRedo, canUndo, canRedo]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
