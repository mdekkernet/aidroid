# aidroid

This tool helps you deploy and export AI agents using configuration files, making it easier to work with various AI service providers. Other advantages;
 - **Improved collaboration** - Beeing able to collaborate on changes before they are applied & review them
 - **Auditability** - Who changed what & when
 - **Testability** - Being able to deploy changes to dedicated test account & test them before they are applied in production
 - **Reduced vendor lock-in** - Ability to transfer all data to another vendor if needed

Providers supported currently:
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

### Import

Import data to a specified provider:

```bash
aidroid import <file>
```

File needs to be in YAML format. You're able to use the -dir property to create a configuration file per agent:

```yaml
# yaml-language-server: $schema=https://aidroid.mdekker.net/schemas/voice-agent.json
provider: retell

voice-agent-dir: agents
```

### Export

Export agents from a specified provider to a local YAML file:

```bash
aidroid export <provider>
```

The exported agents will be saved to `agents.yml` in the current directory.

## License

MIT
