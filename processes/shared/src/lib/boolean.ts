export const predicate = (value: unknown): boolean => {
  if (value instanceof Function) {
    return Boolean(value());
  } else {
    return Boolean(value);
  }
};
