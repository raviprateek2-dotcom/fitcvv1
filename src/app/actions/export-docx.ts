'use server';

import type { ResumeData } from '@/components/editor/types';

/**
 * Server-side DOCX generation for ATS-friendly resume export.
 * 
 * Uses the `docx` npm package to build a properly structured Word document
 * with headings, bullet points, and basic styling. ATS systems parse DOCX
 * more reliably than PDF.
 * 
 * SETUP REQUIRED: npm install docx
 */
export async function generateResumeDocx(resumeData: ResumeData): Promise<{ success: boolean; docxBase64?: string; error?: string }> {
    try {
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = await import('docx');

        const { personalInfo, summary, experience, education, skills, projects } = resumeData;

        const children: InstanceType<typeof Paragraph>[] = [];

        // ── Header: Name ──
        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
                children: [
                    new TextRun({
                        text: personalInfo.name,
                        bold: true,
                        size: 32, // 16pt
                        font: 'Calibri',
                    }),
                ],
            })
        );

        // ── Header: Title ──
        if (personalInfo.title) {
            children.push(
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 80 },
                    children: [
                        new TextRun({
                            text: personalInfo.title,
                            size: 24, // 12pt
                            font: 'Calibri',
                            color: '555555',
                        }),
                    ],
                })
            );
        }

        // ── Contact Info ──
        const contactParts = [
            personalInfo.email,
            personalInfo.phone,
            personalInfo.location,
            personalInfo.website,
        ].filter(Boolean);

        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [
                    new TextRun({
                        text: contactParts.join(' | '),
                        size: 18, // 9pt
                        font: 'Calibri',
                        color: '777777',
                    }),
                ],
            })
        );

        // ── Divider ──
        children.push(
            new Paragraph({
                border: {
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                },
                spacing: { after: 200 },
            })
        );

        // ── Summary ──
        if (summary) {
            children.push(
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                    children: [
                        new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, size: 22, font: 'Calibri' }),
                    ],
                }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [
                        new TextRun({ text: summary, size: 20, font: 'Calibri' }),
                    ],
                })
            );
        }

        // ── Experience ──
        if (experience.length > 0) {
            children.push(
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                    children: [
                        new TextRun({ text: 'EXPERIENCE', bold: true, size: 22, font: 'Calibri' }),
                    ],
                })
            );

            for (const exp of experience) {
                children.push(
                    new Paragraph({
                        spacing: { before: 100 },
                        children: [
                            new TextRun({ text: exp.role, bold: true, size: 21, font: 'Calibri' }),
                            new TextRun({ text: `  |  ${exp.company}`, size: 20, font: 'Calibri', italics: true }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { after: 60 },
                        children: [
                            new TextRun({ text: exp.date, size: 18, font: 'Calibri', color: '888888' }),
                        ],
                    })
                );

                // Split description into bullet points
                const bullets = exp.description
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);

                for (const bullet of bullets) {
                    children.push(
                        new Paragraph({
                            bullet: { level: 0 },
                            spacing: { after: 40 },
                            children: [
                                new TextRun({
                                    text: bullet.replace(/^[-*•]\s*/, ''),
                                    size: 20,
                                    font: 'Calibri',
                                }),
                            ],
                        })
                    );
                }
            }
        }

        // ── Education ──
        if (education.length > 0) {
            children.push(
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                    children: [
                        new TextRun({ text: 'EDUCATION', bold: true, size: 22, font: 'Calibri' }),
                    ],
                })
            );

            for (const edu of education) {
                children.push(
                    new Paragraph({
                        spacing: { before: 60 },
                        children: [
                            new TextRun({ text: edu.degree, bold: true, size: 21, font: 'Calibri' }),
                            new TextRun({ text: `  |  ${edu.institution}`, size: 20, font: 'Calibri', italics: true }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { after: 80 },
                        children: [
                            new TextRun({ text: edu.date, size: 18, font: 'Calibri', color: '888888' }),
                        ],
                    })
                );
            }
        }

        // ── Skills ──
        if (skills && skills.length > 0) {
            children.push(
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                    children: [
                        new TextRun({ text: 'SKILLS', bold: true, size: 22, font: 'Calibri' }),
                    ],
                }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: skills.map(s => `${s.name} (${s.level})`).join('  •  '),
                            size: 20,
                            font: 'Calibri',
                        }),
                    ],
                })
            );
        }

        // ── Projects ──
        if (projects && projects.length > 0) {
            children.push(
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                    children: [
                        new TextRun({ text: 'PROJECTS', bold: true, size: 22, font: 'Calibri' }),
                    ],
                })
            );

            for (const project of projects) {
                children.push(
                    new Paragraph({
                        spacing: { before: 60 },
                        children: [
                            new TextRun({ text: project.name, bold: true, size: 21, font: 'Calibri' }),
                            ...(project.link
                                ? [new TextRun({ text: `  |  ${project.link}`, size: 18, font: 'Calibri', color: '0066CC' })]
                                : []),
                        ],
                    }),
                    new Paragraph({
                        spacing: { after: 80 },
                        children: [
                            new TextRun({ text: project.description, size: 20, font: 'Calibri' }),
                        ],
                    })
                );
            }
        }

        const doc = new Document({
            creator: 'FitCV Resume Builder',
            title: resumeData.title || `${personalInfo.name}'s Resume`,
            description: `Resume of ${personalInfo.name} — ${personalInfo.title}`,
            sections: [
                {
                    properties: {
                        page: {
                            margin: {
                                top: 720,    // 0.5 inch in twips
                                right: 720,
                                bottom: 720,
                                left: 720,
                            },
                        },
                    },
                    children,
                },
            ],
        });

        const buffer = await Packer.toBuffer(doc);
        const docxBase64 = Buffer.from(buffer).toString('base64');

        return { success: true, docxBase64 };
    } catch (error: unknown) {
        console.error('DOCX generation failed:', error);

        const message = error instanceof Error ? error.message : 'Unknown error during DOCX generation';

        if (message.includes('Cannot find module') || message.includes('docx')) {
            return {
                success: false,
                error: 'DOCX export requires the docx package. Install it with: npm install docx',
            };
        }

        return { success: false, error: message };
    }
}
