declare module '@transferwise/approve-api-action-helpers' {
  export enum Mode {
    PRODUCTION = 'PRODUCTION',
    SANDBOX = 'SANDBOX',
  }
  export function create(config: { mode: Mode }): (url: string, options: RequestInit) => Promise<Response>;
}
