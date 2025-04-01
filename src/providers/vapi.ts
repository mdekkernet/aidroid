import { Provider } from '../utils/provider';
import { MissingEnvironmentVariableError } from '../utils/errors';
import { Agent, AgentFunction, Language } from '../utils/agent';
import { VapiClient } from '@vapi-ai/server-sdk';

const createClient = () => {
  if (!process.env.VAPI_API_KEY) {
    throw new MissingEnvironmentVariableError('VAPI_API_KEY');
  }

  return new VapiClient({
    token: process.env.VAPI_API_KEY!,
  });
};

export const VapiProvider: Provider = {
  exportAgents: async () => {
    const client = createClient();

    const agentsResponse = await client.assistants.list();
    const tools = await client.tools.list();

    const agents = agentsResponse.map(agent => {
      const language: Language = 'en-US';
      const voice_id = (agent.voice as any)!.voiceId;

      const functions = agent.model!.tools?.map(toolId => {
        const tool = tools.find(tool => tool.id === (toolId as unknown as string));

        if (!tool) {
          throw new Error(`Tool not found for agent ${agent.name}`);
        }

        if (tool.type === 'function') {
          return {
            type: 'custom',
            name: tool.function?.name,
            description: tool.function?.description,
            speak_after_execution: true,
            speak_during_execution: true,
            url: tool.server?.url,
          } as AgentFunction;
        }
      });

      return {
        name: agent.name,
        model: agent.model!.model,
        prompt: agent.model!.messages![0].content,
        begin_message: agent.firstMessage,
        language,
        voice_provider: agent.voice?.provider,
        voice_id,
        functions: functions,
      } as Agent;
    });

    return agents;
  },

  importAgents: async (agents: Agent[]) => {
    const client = createClient();

    return [];
  },
};
