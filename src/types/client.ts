export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiResponseState {
  status: number | null;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  loading: boolean;
  timeMs: number | null;
  sizeBytes: number | null;
  error?: string | null;
  endpointUrl: string;
  method: HttpMethod;
}

export type ActiveTab = 'rest' | 'overfetching' | 'idempotency' | 'graphql' | 'errors' | 'docs';
