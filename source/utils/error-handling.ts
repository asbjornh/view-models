const exists = (value: any) => value !== null && typeof value !== "undefined";

export const throwError = (message: string) => {
  throw new Error(message);
};

export const throwIfNull = (message: string) => (value: any) =>
  exists(value) ? value : throwError(message);
