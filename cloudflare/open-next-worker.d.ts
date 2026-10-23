declare module "open-next-worker" {
  export type OpenNextEnv = object;
  export interface OpenNextContext {
    waitUntil(promise: Promise<unknown>): void;
    passThroughOnException(): void;
  }
  const worker: {
    fetch(
      request: Request,
      env: OpenNextEnv,
      ctx: OpenNextContext,
    ): Promise<Response>;
  };
  export default worker;
}
