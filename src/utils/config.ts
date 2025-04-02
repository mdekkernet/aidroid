import { Agent } from './agent';

export type DroidConfig = {
  provider: string;
  'voice-agents': Agent[];
  'voice-agents-dir': string;
};
