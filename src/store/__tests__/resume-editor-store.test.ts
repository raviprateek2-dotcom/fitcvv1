import { renderHook, act } from '@testing-library/react';
import { useResumeEditorStore } from '../resume-editor-store';
import type { ResumeData } from '@/components/editor/types';

describe('useResumeEditorStore', () => {
  const emptyResume: ResumeData = {
    personalInfo: {
      name: 'Test Name',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    jobDescription: ''
  };

  beforeEach(() => {
    act(() => {
      useResumeEditorStore.getState().setResumeData(emptyResume);
      useResumeEditorStore.getState().setResumeId('');
      useResumeEditorStore.getState().resetUiState();
    });
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useResumeEditorStore());
    expect(result.current.saveStatus).toBe('idle');
    expect(result.current.activeTab).toBe('content');
    expect(result.current.mobileMode).toBe('edit');
    expect(result.current.isParsing).toBe(false);
  });

  it('updates resumeData and calculates hiringReadiness', () => {
    const { result } = renderHook(() => useResumeEditorStore());
    
    act(() => {
      result.current.setResumeData({ ...emptyResume, personalInfo: { ...emptyResume.personalInfo, name: 'John Doe' }});
    });

    expect(result.current.resumeData?.personalInfo.name).toBe('John Doe');
    expect(result.current.hiringReadiness).toBeGreaterThan(0); // Name gives points
  });

  it('updates individual fields via updateField', () => {
    const { result } = renderHook(() => useResumeEditorStore());
    
    act(() => {
      // Must set initial state first
      result.current.setResumeData(emptyResume);
    });

    act(() => {
      result.current.updateField('summary', 'A professional developer.');
    });

    expect(result.current.resumeData?.summary).toBe('A professional developer.');
  });

  it('handles UI state updates', () => {
    const { result } = renderHook(() => useResumeEditorStore());
    
    act(() => {
      result.current.setSaveStatus('saving');
      result.current.setActiveTab('design');
      result.current.setMobileMode('preview');
    });

    expect(result.current.saveStatus).toBe('saving');
    expect(result.current.activeTab).toBe('design');
    expect(result.current.mobileMode).toBe('preview');
  });

  it('resets UI state via resetUiState', () => {
    const { result } = renderHook(() => useResumeEditorStore());
    
    act(() => {
      result.current.setActiveTab('design');
      result.current.setSaveStatus('error');
      result.current.resetUiState();
    });

    expect(result.current.activeTab).toBe('content');
    expect(result.current.saveStatus).toBe('idle');
  });
});
