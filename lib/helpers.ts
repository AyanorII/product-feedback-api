export const toUpperSnakeCase = (str: string) => {
  return str.replace(/[^a-zA-Z]/, '_').toUpperCase();
};
