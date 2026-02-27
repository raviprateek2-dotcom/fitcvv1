'use client';

import { z } from 'zod';

/**
 * Client-side environment variable validation.
 * Only NEXT_PUBLIC_* variables are available on the client.
 * This validates at import-time and fails fast with a clear error if variables are missing.
 */
const clientEnvSchema = z.object({
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API key is required'),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase auth domain is required'),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase project ID is required'),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase app ID is required'),
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

function validateClientEnv(): ClientEnv {
    const parsed = clientEnvSchema.safeParse({
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    });

    if (!parsed.success) {
        console.error(
            '❌ Missing or invalid environment variables:\n',
            parsed.error.flatten().fieldErrors,
        );
        throw new Error('Invalid environment variables. Check your .env file.');
    }

    return parsed.data;
}

export const clientEnv = validateClientEnv();
