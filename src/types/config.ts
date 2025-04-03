import { Agent } from './agent';
import { Knowledge } from './knowledge';
import { Workflow } from './workflow';
import { Tool } from './tool';

export type DroidConfig = {
  provider: string;
  'voice-agents': Agent[];
  'voice-agents-dir': string;
  tools: Tool[];
  'tools-dir': string;
  knowledge: Knowledge[];
  'knowledge-dir': string;
  workflows: Workflow[];
  'workflows-dir': string;
};
