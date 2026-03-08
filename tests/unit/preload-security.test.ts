import { describe, expect, it } from "vitest";
import { isSafeExternalUrl } from "../../src/preload/security";

describe("preload security", () => {
  it("allows safe external protocols", () => {
    expect(isSafeExternalUrl("https://example.com/docs")).toBe(true);
    expect(isSafeExternalUrl("http://example.com")).toBe(true);
    expect(isSafeExternalUrl("mailto:hello@example.com")).toBe(true);
  });

  it("blocks dangerous or malformed URLs", () => {
    expect(isSafeExternalUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeExternalUrl("file:///etc/passwd")).toBe(false);
    expect(isSafeExternalUrl("data:text/html;base64,aaa")).toBe(false);
    expect(isSafeExternalUrl("not-a-url")).toBe(false);
    expect(isSafeExternalUrl("")).toBe(false);
  });
});
