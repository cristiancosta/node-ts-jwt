export type HealthResponse = {
  status: 'healthy';
  dependencies: {
    database: 'connected' | 'not-connected';
    reason?: string;
  };
};
