import { Provider } from '../utils/provider';
import { MissingEnvironmentVariableError } from '../utils/errors';
import { Agent, AgentFunction, Language } from '../utils/agent';
import { VapiClient } from '@vapi-ai/server-sdk';
import { Vapi } from '@vapi-ai/server-sdk';

type VoiceProvider =
  | 'azure'
  | 'cartesia'
  | 'deepgram'
  | '11labs'
  | 'lmnt'
  | 'neets'
  | 'playht'
  | 'rime-ai'
  | 'smallest-ai'
  | 'tavus';

const mapAgentToVapi = (agent: Agent): Vapi.CreateAssistantDto => {
  return {
    name: agent.name,
    model: {
      model: agent.model,
      provider: 'vapi',
      messages: [{ role: Vapi.OpenAiMessageRole.Assistant, content: agent.prompt }],
    },
    voice: { voiceId: agent.voice_id, provider: agent.voice_provider as VoiceProvider },
    firstMessage: agent.begin_message,
  };
};

const createClient = () => {
  if (!process.env.VAPI_API_KEY) {
    throw new MissingEnvironmentVariableError('VAPI_API_KEY');
  }

  return new VapiClient({
    token: process.env.VAPI_API_KEY!,
  });
};

export const VapiProvider: Provider = {
  listAgents: async () => {
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
        id: agent.id,
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

  createAgent: async (agent: Agent) => {
    const client = createClient();

    await client.assistants.create(mapAgentToVapi(agent));
  },

  updateAgent: async (id: string, agent: Agent) => {
    const client = createClient();

    await client.assistants.update(id, mapAgentToVapi(agent));
  },
};
