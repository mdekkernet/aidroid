import Retell from 'retell-sdk';
import { Provider } from '../utils/provider';
import { MissingEnvironmentVariableError } from '../utils/errors';
import { Agent, AgentFunction } from '../utils/agent';
import { AgentCreateParams } from 'retell-sdk/resources/agent';

const createClient = () => {
  if (!process.env.RETELL_API_KEY) {
    throw new MissingEnvironmentVariableError('RETELL_API_KEY');
  }

  return new Retell({
    apiKey: process.env.RETELL_API_KEY!,
  });
};

type RetellFunction = {
  type: string;
  name: string;
  description: string;
  url?: string;
  speak_after_execution: boolean;
  speak_during_execution: boolean;
};

const mapLlm = (agent: Agent, tools: any[]) => {
  return {
    model: agent.model as any,
    general_prompt: agent.prompt,
    begin_message: agent.begin_message,
    model_temperature: agent.temperature,
    general_tools: tools,
  };
};

const mapTools = (tools: AgentFunction[]): RetellFunction[] => {
  return tools.map(aFunction => ({
    type: aFunction.type as any,
    name: aFunction.name,
    description: aFunction.description,
    url: aFunction.url,
    speak_after_execution: aFunction.speak_after_execution,
    speak_during_execution: aFunction.speak_during_execution,
  }));
};

const mapAgent = (agent: Agent, llmId: string) => {
  return {
    agent_name: agent.name,
    response_engine: {
      type: 'retell-llm',
      llm_id: llmId,
    },
    language: agent.language,
    voice_id: agent.voice_id,
  } as AgentCreateParams;
};

export const RetellProvider: Provider = {
  listAgents: async () => {
    const client = createClient();

    const agentsResponse = await client.agent.list();

    const llmsResponse = await client.llm.list();

    const agents = agentsResponse.map(agent => {
      const llm = llmsResponse.find(llm => llm.llm_id === (agent.response_engine as any).llm_id);

      if (!llm) {
        throw new Error(`LLM not found for agent ${agent.agent_name}`);
      }

      return {
        id: agent.agent_id,
        name: agent.agent_name,
        model: llm.model,
        prompt: llm.general_prompt,
        begin_message: llm.begin_message,
        language: agent.language,
        temperature: llm.model_temperature,
        voice_id: agent.voice_id,
        voice_provider: agent.voice_model,
        functions: llm.general_tools?.map(tool => ({
          type: tool.type,
          name: tool.name,
          description: tool.description,
          speak_after_execution: tool.type === 'custom' ? tool.speak_after_execution : undefined,
          speak_during_execution: tool.type === 'custom' ? tool.speak_during_execution : undefined,
          url: tool.type === 'custom' ? tool.url : undefined,
        })),
      } as Agent;
    });

    return agents;
  },

  createAgent: async (agent: Agent) => {
    const client = createClient();

    const tools = mapTools(agent.functions);
    const llm = await client.llm.create(mapLlm(agent, tools));

    await client.agent.create(mapAgent(agent, llm.llm_id));
  },

  updateAgent: async (id: string, agent: Agent) => {
    const client = createClient();

    const existingAgent = await client.agent.retrieve(id);

    if (existingAgent.response_engine.type !== 'retell-llm') {
      return;
    }

    await client.llm.update(
      existingAgent.response_engine.llm_id,
      mapLlm(agent, mapTools(agent.functions))
    );

    await client.agent.update(id, mapAgent(agent, existingAgent.response_engine.llm_id));
  },
};
