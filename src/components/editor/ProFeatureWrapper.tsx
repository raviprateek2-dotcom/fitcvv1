'use client';

import React from 'react';

interface ProFeatureWrapperProps {
    isPro?: boolean;
    children: React.ReactNode;
}

/**
 * FitCV: Pro features are now free for everyone.
 * This wrapper is kept for layout consistency but effectively grants access to all children.
 */
export const ProFeatureWrapper: React.FC<ProFeatureWrapperProps> = ({ children }) => {
    return <>{children}</>;
};
