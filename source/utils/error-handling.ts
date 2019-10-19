export const throwError = (error: string | Error) => {
  throw error instanceof Error ? error : new Error(error);
};

export const throwIfNull = <T>(
  value: T | undefined | null,
  error: string | Error
) => {
  if (value === undefined || typeof value === "undefined" || value === null) {
    throw error instanceof Error ? error : new Error(error);
  }
  return value;
};
