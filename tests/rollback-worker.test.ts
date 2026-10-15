import { createServer } from "node:http";
import { describe, expect, it } from "vitest";
import { restoreWorkerVersion } from "../scripts/rollback-worker.mjs";

describe("code-only Worker rollback", () => {
  for (const status of [200, 400]) {
    it(`makes exactly one unforced native request on HTTP ${status}`, async () => {
      const requests: { url: string | undefined; body: string }[] = [];
      const server = createServer(async (request, response) => {
        let body = "";
        for await (const chunk of request) body += chunk;
        requests.push({ url: request.url, body });
        response.writeHead(status, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify(
            status === 200
              ? { success: true }
              : {
                  success: false,
                  errors: [
                    {
                      code: 10220,
                      message: "Secrets changed since this version",
                    },
                  ],
                },
          ),
        );
      });
      await new Promise<void>((resolve) =>
        server.listen(0, "127.0.0.1", resolve),
      );
      const address = server.address();
      if (!address || typeof address === "string")
        throw new Error("No HTTP fixture port");
      try {
        const result = restoreWorkerVersion({
          api: `http://127.0.0.1:${address.port}`,
          token: "synthetic-not-a-credential",
          version: "11111111-1111-4111-8111-111111111111",
        });
        if (status === 200) await result;
        else await expect(result).rejects.toThrow(/do not force/);
        expect(requests).toHaveLength(1);
        expect(requests[0]!.url).toBe("/deployments");
        expect(JSON.parse(requests[0]!.body)).toMatchObject({
          strategy: "percentage",
          versions: [
            {
              version_id: "11111111-1111-4111-8111-111111111111",
              percentage: 100,
            },
          ],
        });
        expect(requests[0]!.body).not.toContain("force");
      } finally {
        server.closeAllConnections();
        await new Promise<void>((resolve, reject) =>
          server.close((error) => (error ? reject(error) : resolve())),
        );
      }
    });
  }
});
