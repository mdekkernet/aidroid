# aidroid

A command-line tool for managing AI agents across different providers. This tool helps you deploy and export AI agents, making it easier to work with various AI service providers.

## Installation

```bash
npm install aidroid
```

## Environment Variables

Before using the tool, make sure to set up the required environment variables:

- `RETELL_API_KEY`: Your Retell API key (required for Retell provider)

## Available Commands

### Deploy

Deploy a model to a specified provider:

```bash
aidroid deploy <file>
```

### Export

Export agents from a specified provider to a local YAML file:

```bash
aidroid export <provider>
```

Available providers:
- `retell`: Export agents from Retell

The exported agents will be saved to `agents.yml` in the current directory.

## Agent Configuration

Agents are configured with the following properties:
- `name`: The name of the agent
- `model`: The AI model to use
- `temperature`: The temperature setting for the model
- `prompt`: The general prompt for the agent
- `begin_message`: The initial message for the agent

## Development

This project is built with TypeScript and uses:
- Commander.js for CLI command handling
- Winston for logging
- YAML for configuration file handling

## License

MIT
