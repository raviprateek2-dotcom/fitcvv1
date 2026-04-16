import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

type InterviewMessage = {
  role: 'ai' | 'user' | 'feedback';
  content: string;
};

type InterviewRequest = {
  role: string;
  questionType: string;
  difficulty: string;
  messages: InterviewMessage[];
  mode: 'ask' | 'feedback';
};

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5';

function buildConversation(messages: InterviewMessage[]): string {
  return messages
    .map((message) => {
      if (message.role === 'ai') return `Interviewer: ${message.content}`;
      if (message.role === 'user') return `Candidate: ${message.content}`;
      return `Feedback: ${message.content}`;
    })
    .join('\n\n');
}

function extractJson(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text;
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Missing ANTHROPIC_API_KEY.' }, { status: 500 });
  }

  const body = (await request.json()) as InterviewRequest;
  const { role, questionType, difficulty, messages, mode } = body;

  if (!role || !questionType || !difficulty || !Array.isArray(messages) || !mode) {
    return NextResponse.json({ error: 'Invalid interview payload.' }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const conversation = buildConversation(messages);

  const system =
    mode === 'ask'
      ? `You are a senior hiring manager conducting a real job interview for a ${role} position. Ask ONE sharp, specific interview question based on the question type ${questionType} at ${difficulty} difficulty. Do not explain. Do not number it. Just ask the question naturally, like a real interviewer would. If this is not the first question, make it a follow-up or a new angle based on conversation history.`
      : `You are a senior hiring coach evaluating a candidate's interview answer. The role is ${role}, question type is ${questionType}. Respond in this exact JSON format (no markdown, no extra text):
{
  "score": <number 1-10>,
  "clarity": <number 1-10>,
  "depth": <number 1-10>,
  "relevance": <number 1-10>,
  "summary": "<2 sentence verdict>",
  "strength": "<what they did well>",
  "improvement": "<specific thing to fix>",
  "betterAnswer": "<a 2-3 sentence example of a stronger answer>"
}`;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: mode === 'ask' ? 180 : 500,
      system,
      messages: [
        {
          role: 'user',
          content:
            conversation.trim().length > 0
              ? `Conversation so far:\n\n${conversation}`
              : 'This is the first turn of the interview.',
        },
      ],
    });

    const text = response.content
      .filter((item) => item.type === 'text')
      .map((item) => item.text)
      .join('\n')
      .trim();

    if (mode === 'feedback') {
      const parsed = JSON.parse(extractJson(text));
      return NextResponse.json({ mode, data: parsed });
    }

    return NextResponse.json({ mode, data: { question: text } });
  } catch (error) {
    console.error('Interview route error', error);
    return NextResponse.json({ error: 'Interview request failed.' }, { status: 500 });
  }
}

