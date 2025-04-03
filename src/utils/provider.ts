import { Agent } from '../types/agent';

export interface Provider {
  listAgents(): Promise<Agent[]>;
  updateAgent(id: string, agent: Agent): Promise<void>;
  createAgent(agent: Agent): Promise<void>;
}
