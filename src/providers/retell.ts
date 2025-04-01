import Retell from 'retell-sdk';
import { Provider } from '../utils/provider';
import { MissingEnvironmentVariableError } from '../utils/errors';
import { Agent } from '../utils/agent';

const createClient = () => {
  if (!process.env.RETELL_API_KEY) {
    throw new MissingEnvironmentVariableError('RETELL_API_KEY');
  }

  return new Retell({
    apiKey: process.env.RETELL_API_KEY!,
  });
};

export const RetellProvider: Provider = {
  exportAgents: async () => {
    const client = createClient();

    const agentsResponse = await client.agent.list();

    const llmsResponse = await client.llm.list();

    const agents = agentsResponse.map(agent => {
      const llm = llmsResponse.find(llm => llm.llm_id === (agent.response_engine as any).llm_id);

      if (!llm) {
        throw new Error(`LLM not found for agent ${agent.agent_name}`);
      }

      return {
        name: agent.agent_name,
        model: llm.model,
        prompt: llm.general_prompt,
        begin_message: llm.begin_message,
        language: agent.language,
        temperature: llm.model_temperature,
        functions: llm.general_tools?.map(tool => ({
          type: tool.type,
          name: tool.name,
          description: tool.description,
          url: tool.type === 'custom' ? tool.url : undefined,
        })),
      } as Agent;
    });

    return agents;
  },

  importAgents: async (agents: Agent[]) => {
    const client = createClient();

    for (const agent of agents) {
      const llm = await client.llm.create({
        model: agent.model as any,
        general_prompt: agent.prompt,
        begin_message: agent.begin_message,
        model_temperature: agent.temperature,
        general_tools: agent.functions.map(aFunction => ({
          type: aFunction.type as any,
          name: aFunction.name,
          description: aFunction.description,
          url: aFunction.url,
          speak_after_execution: aFunction.speak_after_execution,
          speak_during_execution: aFunction.speak_during_execution,
        })),
      });

      await client.agent.create({
        agent_name: agent.name,
        response_engine: {
          type: 'retell-llm',
          llm_id: llm.llm_id,
        },
        language: agent.language,
        voice_id: 'default',
      });
    }
  },
};
