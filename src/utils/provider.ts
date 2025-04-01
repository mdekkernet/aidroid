import { Agent } from './agent';

export interface Provider {
  exportAgents(): Promise<Agent[]>;
  importAgents(agents: Agent[]): Promise<void>;
}
