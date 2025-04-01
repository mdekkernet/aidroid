export class ProviderNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderNotFoundError';
  }
}

export class MissingEnvironmentVariableError extends Error {
  constructor(variableName: string) {
    super(`Missing environment variable: ${variableName}`);
    this.name = 'MissingEnvironmentVariableError';
  }
}
