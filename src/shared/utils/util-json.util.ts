export function buildJsonFromEnum(
  data: Record<string, any> | undefined,
  enumObject: Record<string, string>
): Record<string, string> {
  const result: Record<string, string> = {};

  if (!data) {
    return result;
  }

  Object.values(enumObject).forEach((key) => {
    const value = data[key] as string | undefined;
    if (value) {
      result[key] = value;
    }
  });

  return result;
}
