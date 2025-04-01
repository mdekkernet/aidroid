# aidroid

A command-line tool for managing AI agents across different providers. This tool helps you deploy and export AI agents, making it easier to work with various AI service providers.

Available providers:
- `retell`
- `vapi`

## Installation

```bash
npm install aidroid
```

## Environment Variables

Before using the tool, make sure to set up the required environment variables:

- `RETELL_API_KEY`: Your Retell API key (required for Retell provider)
- `VAPI_API_KEY`: Your Vapi API key (required for Vapi provider)

## Available Commands

### Deploy

Deploy a model to a specified provider:

```bash
aidroid deploy <file>
```

File needs to be in YAML format. You're able to use `!!inc/file` to distribute configuration over mulitple files, for example:

```yaml
provider: retell

agents:
 - !!inc/file agents/my_agent.yml
```

### Export

Export agents from a specified provider to a local YAML file:

```bash
aidroid export <provider>
```

The exported agents will be saved to `agents.yml` in the current directory.

## License

MIT
