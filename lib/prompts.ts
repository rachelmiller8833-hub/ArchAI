// lib/prompts.ts

export interface PreviousMessage {
  name: string;
  role: string;
  text: string;
}

export function buildUserPrompt(topic: string, previousMessages: PreviousMessage[]): string {
  if (previousMessages.length === 0) {
    return `The software idea to analyze: ${topic}`;
  }
  const history = previousMessages
    .map(m => `${m.name} (${m.role}): ${m.text}`)
    .join('\n\n');
  return `The software idea: ${topic}\n\nHere is what the team has said so far:\n${history}\n\nNow share your perspective.`;
}
