export type Workflow = {
  name: string;
  description: string;
  steps: WorkflowStep[];
};

type WorkflowStep = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
};
