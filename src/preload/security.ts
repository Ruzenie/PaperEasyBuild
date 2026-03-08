/** 预加载层安全工具：校验可打开的外链 URL。 */
const SAFE_EXTERNAL_PROTOCOLS = new Set(["https:", "http:", "mailto:"]);

export const isSafeExternalUrl = (value: string): boolean => {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const parsed = new URL(trimmed);
    return SAFE_EXTERNAL_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
};
