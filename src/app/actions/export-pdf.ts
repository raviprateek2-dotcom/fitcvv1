'use server';

import type { ResumeData } from '@/components/editor/types';

/**
 * Server-side PDF generation using Puppeteer.
 * 
 * Renders the resume preview page in a headless browser and captures it as PDF.
 * This ensures pixel-perfect output identical to what the user sees in the editor.
 * 
 * SETUP REQUIRED: npm install puppeteer
 * In production, use puppeteer-core with a pre-installed Chrome binary.
 */
export async function generateResumePdf(resumeData: ResumeData, resumeId: string): Promise<{ success: boolean; pdfBase64?: string; error?: string }> {
    try {
        // Dynamic import to keep bundle small — puppeteer is only loaded when export is triggered
        const puppeteer = await import('puppeteer');

        const browser = await puppeteer.default.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--font-render-hinting=none',
            ],
        });

        const page = await browser.newPage();

        // Set viewport to US Letter dimensions at 96 DPI
        await page.setViewport({
            width: 816,  // 8.5 inches * 96 DPI
            height: 1056, // 11 inches * 96 DPI
            deviceScaleFactor: 2, // 2x for crisp text
        });

        // Navigate to the print-optimized view of the resume
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        await page.goto(`${baseUrl}/editor/${resumeId}?print=true`, {
            waitUntil: 'networkidle0',
            timeout: 15000,
        });

        // Wait for fonts and animations to settle
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

        // Generate PDF with US Letter format and proper margins
        const pdfBuffer = await page.pdf({
            format: 'Letter',
            printBackground: true,
            margin: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in',
            },
            preferCSSPageSize: true,
        });

        await browser.close();

        const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

        return { success: true, pdfBase64 };
    } catch (error: unknown) {
        console.error('PDF generation failed:', error);

        const message = error instanceof Error ? error.message : 'Unknown error during PDF generation';

        // Provide helpful fallback message if puppeteer isn't installed
        if (message.includes('Cannot find module') || message.includes('puppeteer')) {
            return {
                success: false,
                error: 'PDF generation requires Puppeteer. Install it with: npm install puppeteer. Falling back to browser print.',
            };
        }

        return { success: false, error: message };
    }
}
