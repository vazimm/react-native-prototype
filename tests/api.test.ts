import AxiosMockAdapter from "axios-mock-adapter";
import { afterEach, describe, expect, it, vi } from "vitest";
import api, { configureApiSession } from "../src/services/api";

const mock = new AxiosMockAdapter(api);

afterEach(() => {
  mock.reset();
  configureApiSession(async () => null, () => undefined);
});

describe("authenticated API client", () => {
  it("sends the secure session token as a Bearer authorization header", async () => {
    configureApiSession(async () => "test-token", () => undefined);
    mock.onGet("/posts/all").reply((config) => {
      expect(config.headers?.Authorization).toBe("Bearer test-token");
      return [200, { data: [] }];
    });

    await expect(api.get("/posts/all")).resolves.toMatchObject({ status: 200 });
  });

  it("clears the authenticated session callback after an unauthorized response", async () => {
    const onUnauthorized = vi.fn();
    configureApiSession(async () => "expired-token", onUnauthorized);
    mock.onGet("/posts/all").reply(401);

    await expect(api.get("/posts/all")).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });
});
