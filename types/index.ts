// types/index.ts

export type Step = 'input' | 'debate' | 'prototypes' | 'continue';
export type Depth = 'quick' | 'full';
export type Lang = 'en' | 'he';
export type ProtoId = 'A' | 'B' | 'C' | null;

export interface Message {
  id: number;
  name: string;
  role: string;
  model: string;
  initials: string;
  avatarBg: string;
  threadColor: string;
  text: string;
  streaming: boolean;
  visible: boolean;
  isConclusion: boolean;
  conclusionTitle?: string;
}