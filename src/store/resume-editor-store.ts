/**
 * Zustand store for centralized resume editor state.
 *
 * Centralising state here:
 *  1. Allows undo/redo to be layered on top of a single atom
 *  2. Decouples child components from prop-drilling / context nesting
 *  3. Makes it easy to add derived selectors (hiring readiness, word count, etc.)
 *
 * SETUP REQUIRED: npm install zustand
 */

import { create } from 'zustand';
import { temporal } from 'zundo';
import type { ResumeData } from '@/components/editor/types';
import { calcHiringReadiness } from '@/lib/resume-scoring';

// ── Types ────────────────────────────────────────────────────────────────────

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
export type EditorTab = 'content' | 'ai-review' | 'cover-letter' | 'design' | 'history';
export type MobileMode = 'edit' | 'preview';

interface ResumeEditorState {
    // Core data
    resumeData: ResumeData | null;
    resumeId: string;

    // UI state
    saveStatus: SaveStatus;
    activeTab: EditorTab;
    mobileMode: MobileMode;
    isParsing: boolean;
    isExporting: boolean;
    isAiLoading: boolean;
    isAnalyzing: boolean;
    isReviewing: boolean;
    isPredictingQuestions: boolean;
    isCopied: boolean;
    isAtsMode: boolean;
    clTone: 'professional' | 'bold' | 'friendly';

    // Derived (computed from resumeData)
    hiringReadiness: number;

    // Actions
    setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
    setResumeId: (id: string) => void;
    setSaveStatus: (status: SaveStatus) => void;
    setActiveTab: (tab: EditorTab) => void;
    setMobileMode: (mode: MobileMode) => void;
    setIsParsing: (v: boolean) => void;
    setIsExporting: (v: boolean) => void;
    setIsAiLoading: (v: boolean) => void;
    setIsAnalyzing: (v: boolean) => void;
    setIsReviewing: (v: boolean) => void;
    setIsPredictingQuestions: (v: boolean) => void;
    setIsCopied: (v: boolean) => void;
    setClTone: (tone: 'professional' | 'bold' | 'friendly') => void;
    setIsAtsMode: (v: boolean) => void;

    /** Convenience: update a top-level field on resumeData */
    updateField: <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => void;

    /** Reset UI state (keep resumeId) */
    resetUiState: () => void;
}

// ── Store ────────────────────────────────────────────────────────────────────

const DEFAULT_UI = {
    saveStatus: 'idle' as SaveStatus,
    activeTab: 'content' as EditorTab,
    mobileMode: 'edit' as MobileMode,
    isParsing: false,
    isExporting: false,
    isAiLoading: false,
    isAnalyzing: false,
    isReviewing: false,
    isPredictingQuestions: false,
    isCopied: false,
    isAtsMode: false,
    clTone: 'professional' as const,
};

/**
 * Export the store with temporal middleware enabled for undo/redo.
 *
 * Usage in a component:
 *   const { resumeData, updateField } = useResumeEditorStore();
 *   const { undo, redo, canUndo, canRedo } = useTemporalStore(state => state);
 */
export const useResumeEditorStore = create<ResumeEditorState>()(
    temporal(
        (set, get) => ({
            resumeData: null,
            resumeId: '',
            hiringReadiness: 0,
            ...DEFAULT_UI,

            setResumeData: (data) => {
                set((state) => {
                    const next = typeof data === 'function'
                        ? data(state.resumeData as ResumeData)
                        : data;
                    return {
                        resumeData: next,
                        hiringReadiness: calcHiringReadiness(next),
                    };
                });
            },

            setResumeId: (id) => set({ resumeId: id }),
            setSaveStatus: (status) => set({ saveStatus: status }),
            setActiveTab: (tab) => set({ activeTab: tab }),
            setMobileMode: (mode) => set({ mobileMode: mode }),
            setIsParsing: (v) => set({ isParsing: v }),
            setIsExporting: (v) => set({ isExporting: v }),
            setIsAiLoading: (v) => set({ isAiLoading: v }),
            setIsAnalyzing: (v) => set({ isAnalyzing: v }),
            setIsReviewing: (v) => set({ isReviewing: v }),
            setIsPredictingQuestions: (v) => set({ isPredictingQuestions: v }),
            setIsCopied: (v) => set({ isCopied: v }),
            setClTone: (tone) => set({ clTone: tone }),
            setIsAtsMode: (v) => set({ isAtsMode: v }),

            updateField: (field, value) => {
                const current = get().resumeData;
                if (!current) return;
                const next = { ...current, [field]: value };
                set({
                    resumeData: next,
                    hiringReadiness: calcHiringReadiness(next),
                });
            },

            resetUiState: () => set({ ...DEFAULT_UI }),
        }),
        {
            // Only track resumeData in undo history — not UI state
            partialize: (state) => ({ resumeData: state.resumeData }),
            limit: 50, // Keep last 50 snapshots
        }
    )
);
